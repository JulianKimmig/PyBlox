Blockly.Blocks['pyblox_ini_var'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new PYBLOX.FIELDS.VarNameInputField(""), "var_name");
        this.appendValueInput("value")
            //.setCheck("pyblox_pyvar")
            .appendField("=");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(true);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Python['pyblox_ini_var'] = function(block) {
    var var_name = block.getFieldValue('var_name');
    var value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);
    var code = var_name + ' = '+value +'\n';
    return code;
};


Blockly.Blocks['pyblox_var'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabelSerializable("class_name"), "var_name");
        this.appendDummyInput()
            .appendField(new PYBLOX.FIELDS.VarLinkField(),"var_link");

        this.setInputsInline(true);
        this.setColour(230);
        this.setOutput(true, "pyblox_pyvar");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Python['pyblox_var'] = function(block) {
    var variable_class_name = Blockly.Python.variableDB_.getName(block.getFieldValue('var_name'), Blockly.Variables.NAME_TYPE);
    // TODO: Assemble Python into code variable.
    var code = variable_class_name+"\n";
    return [code, Blockly.Python.ORDER_ATOMIC];
};



PYBLOX.registerworkspacefunctions.push(function(workspace) {

    workspace.addChangeListener(function (event) {
        if(PYBLOX.FUNCTIONS.event_irrelevant_for_blocks(event))
            return;

        let block = PYBLOX.FUNCTIONS.event_to_block(event);

        if (block.type !== "pyblox_class_block")
            return;
        if (event.type === Blockly.Events.CREATE) {
        }
        if (event.type === Blockly.Events.CHANGE) {
        }

    });
});



PYBLOX.FUNCTIONS.add_to_nested_flyout('LOKALPYVARS', function (ws) {
    var xmlList = [];
    let ab = ws.getAllBlocks();
    for (let i = 0,block; block = ab[i]; i++) {
        let field = block.getField("var_name");
        if(field&& field instanceof PYBLOX.FIELDS.VarNameInputField){
            var blockText = '<block type="'+(block.varclass?block.varclass:"pyblox_var")+'">' +
                '<field name="var_name">' + field.getValue() + '</field>' +
                '<field name="var_link">' + block.id + '</field>' +
                '</block>';
            var block_xml = Blockly.Xml.textToDom(blockText);
            xmlList.push(block_xml);
        }
    }
    return xmlList;
});


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


