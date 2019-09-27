var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.invisibleField { display:None }';
document.getElementsByTagName('head')[0].appendChild(style);


PYBLOX.FIELDS.VarLinkField = function (source) {
    this.source = source;
    PYBLOX.FIELDS.VarLinkField.superClass_.constructor.call(this, source)
};

goog.inherits(PYBLOX.FIELDS.VarLinkField, Blockly.FieldLabel);
PYBLOX.FIELDS.VarLinkField.prototype.isDirty_ = true;
PYBLOX.FIELDS.VarLinkField.prototype.EDITABLE= false;
PYBLOX.FIELDS.VarLinkField.prototype.SERIALIZABLE= true;
PYBLOX.FIELDS.VarLinkField.fromJson = function (a) {
    var source = Number(Blockly.utils.replaceMessageReferences(a['source']));
    return new PYBLOX.FIELDS.VarLinkField(source)
};
PYBLOX.FIELDS.VarLinkField.prototype.initView = function () {
    this.textElement_ = Blockly.utils.dom.createSvgElement("text", {
        "class": "invisibleField",
        y: this.size_.height - 12.5
    }, this.fieldGroup_);
    this.textContent_ = document.createTextNode("");
    this.textElement_.appendChild(this.textContent_);
    field = this
};

Blockly.Field.register("pyblox_field_VarLinkField", PYBLOX.FIELDS.VarLinkField);



rename_all_variables_by_source_block = function(sourceblock,newname){
    let ab = sourceblock.workspace.getAllBlocks();
    for(let i = 0; i< ab.length;i++){
        let linkfield = ab[i].getField("var_link");
        if(linkfield)
            if(linkfield.getText()===sourceblock.id)
                ab[i].getField("var_name").setValue(newname)
    }
};

PYBLOX.FIELDS.VarNameInputField = function (name) {
    PYBLOX.FIELDS.VarNameInputField.superClass_.constructor.call(this, name,function (varname) {
        let oldname = this.getText();
        let newvarname = PYBLOX.FUNCTIONS.validate_var_name(varname);
        if(newvarname === "")
            return oldname;
        rename_all_variables_by_source_block(this.getSourceBlock(),newvarname);
        return newvarname

    })
};

PYBLOX.FIELDS.VarNameInputField.fromJson = function (a) {
    var b = Blockly.utils.replaceMessageReferences(a.text);
    b = new Blockly.VarNameInputField(b);
    "boolean" === typeof a.spellcheck && b.setSpellcheck(a.spellcheck);
    return b
};
goog.inherits(PYBLOX.FIELDS.VarNameInputField, Blockly.FieldTextInput);

Blockly.Field.register("pyblox_field_VarNameInputField", PYBLOX.FIELDS.VarNameInputField);