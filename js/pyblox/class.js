PYBLOX.VARTYPES.CLASS = "pyblox_class";
PYBLOX.PYTHON.STRINGS.CLASSDEFINITION = "class";

Blockly.Blocks.pyblox_class_block = {
    init: function() {

        PYBLOX.FUNCTIONS.block_set_default_values(this,{
            prefix:PYBLOX.PYTHON.STRINGS.CLASSDEFINITION,
            default_name: PYBLOX.FUNCTIONS.var_name_generator("Class")
        });
        PYBLOX.Blocks.pyblox_abstract_function_definition_block.init.call(this);


        this.var_class = PYBLOX.VARTYPES.CLASS;
        this.setColour(PYBLOX.COLORS.CLASS);
    }
};

Blockly.Python.pyblox_class_block = Blockly.Python.pyblox_function_definition_block;


















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
    if (event.type === Blockly.Events.BLOCK_MOVE) {
    }
    if (event.type === Blockly.Events.DELETE) {
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

        let blocks = PYBLOX.FUNCTIONS.event_to_block(event);
        for(let i = 0; i<blocks.length;i++) {
            if (!blocks[i]) {
                //console.error("blocks[i] not defined")
                return;
            }
            if (blocks[i].type === "pyblox_class_block") {
                event_pyblox_class_block(blocks[i], event)
            } else if (blocks[i].type === "pyblox_class_var_caller") {
                event_pyblox_class_var_caller_block(blocks[i], event)
            }
        }
    });
});
