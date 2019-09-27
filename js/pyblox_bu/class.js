Blockly.Blocks['pyblox_class_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("ClassBlock");
        this.appendDummyInput()
            .appendField("Name")
            .appendField(new PYBLOX.FIELDS.VarNameInputField("className"
            ), "var_name");
        this.appendValueInput("superclass")
            .setCheck("class")
            .appendField("superclass(es)");
        this.appendStatementInput("attributes")
            .setCheck(null)
            .appendField("Attributes");
        this.setInputsInline(false);
        this.setColour(PYBLOX.COLORS.CLASS);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip("");
        this.setHelpUrl("");
        this.varclass = "pyblox_class_var_caller"
    }
};

Blockly.Python['pyblox_class_block'] = function(block) {
    var variable_class_name = Blockly.Python.variableDB_.getName(block.getFieldValue('var_name'), Blockly.Variables.NAME_TYPE);
    var value_superclass = Blockly.Python.valueToCode(block, 'superclass', Blockly.Python.ORDER_ATOMIC);
    var statements_attributes = Blockly.Python.statementToCode(block, 'attributes');
    // TODO: Assemble Python into code variable.
    var code = 'class '+variable_class_name+"():\n";
    return code;
};


Blockly.Blocks['pyblox_class_var_caller'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabelSerializable("class_name"), "var_name");
        this.appendDummyInput()
            .appendField(new PYBLOX.FIELDS.VarLinkField(),"var_link");

        this.appendValueInput("attributes")
            .setCheck("pyblox_pyvar");
        this.setInputsInline(true);
        this.setColour(PYBLOX.COLORS.CLASS);
        this.setOutput(true, "pyblox_pyvar");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Python['pyblox_class_var_caller'] = function(block) {
    var variable_class_name = Blockly.Python.variableDB_.getName(block.getFieldValue('var_name'), Blockly.Variables.NAME_TYPE);
    // TODO: Assemble Python into code variable.
    var code = variable_class_name+"()\n";
    return [code, Blockly.Python.ORDER_ATOMIC];
};






function event_pyblox_class_block(block,event){
    if (event.type === Blockly.Events.CREATE) {
    }
    if (event.type === Blockly.Events.CHANGE) {

    }
}

function event_pyblox_class_var_caller_block(block,event){
    if (event.type === Blockly.Events.CREATE) {
    }
    if (event.type === Blockly.Events.CHANGE) {
    }
}


PYBLOX.registerworkspacefunctions.push(function(workspace) {
    workspace.addChangeListener(function (event) {
        if(PYBLOX.FUNCTIONS.event_irrelevant_for_blocks(event))
            return;

        let block = PYBLOX.FUNCTIONS.event_to_block(event);

        if (block.type === "pyblox_class_block"){
            event_pyblox_class_block(block,event)
        }else if (block.type === "pyblox_class_var_caller"){
            event_pyblox_class_var_caller_block(block,event)
        }
    });
});
