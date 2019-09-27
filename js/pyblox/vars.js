PYBLOX.Blocks['pyblox_abstract_ini_var']={
    init: function() {
        PYBLOX.FUNCTIONS.block_set_default_values(this,{
            default_name:"var_name"
        });
        this.appendDummyInput()
            .appendField(this.prefix)
            .appendField(new PYBLOX.FIELDS.VarNameInputField(this.default_name), "var_name");

        PYBLOX.Blocks['pyblox_scope_block'].init.call(this,{});
        this.var_classes = "pyblox_var";
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(true);
    },
};













Blockly.Blocks['pyblox_ini_var_block'] = {
    init: function() {
        PYBLOX.Blocks['pyblox_abstract_ini_var'].init.call(this);

        this.appendValueInput("value")
            //.setCheck("pyblox_pyvar")
            ;


        this.setColour(230);
    }
};



Blockly.Python['pyblox_ini_var_block'] = function(block) {
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

        let blocks = PYBLOX.FUNCTIONS.event_to_block(event);
        for(let i = 0; i<blocks.length;i++) {
            if (!blocks[i]) {
                //console.error("block not defined")
                return;
            }
            if (event.type === Blockly.Events.CREATE) {
            }
            if (event.type === Blockly.Events.CHANGE) {
            }
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





