PYBLOX.VARTYPES.VAR = "pyblox_var";
PYBLOX.REFERENCES.VAR_NAME = "var_name";
PYBLOX.REFERENCES.VAR_VALUE = "value";
PYBLOX.REFERENCES.VAR_LINK = "var_link";


PYBLOX.Blocks.pyblox_abstract_ini_var={
    init: function() {
        PYBLOX.FUNCTIONS.block_set_default_values(this,{
            default_name:PYBLOX.FUNCTIONS.var_name_generator("var")
        });
        this.appendDummyInput()
            .appendField(this.prefix)
            .appendField(new PYBLOX.FIELDS.VarNameInputField(this.default_name), PYBLOX.REFERENCES.VAR_NAME );
        PYBLOX.Blocks.pyblox_general_block.init.call(this,{});
        PYBLOX.Blocks.pyblox_scope_block.init.call(this,{});
        this.var_class = PYBLOX.VARTYPES.VAR;
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(true);
    },


};

//creates a variable in local or global scope
Blockly.Blocks.pyblox_ini_var_block = {
    init: function() {
        PYBLOX.Blocks.pyblox_abstract_ini_var.init.call(this);

        this.appendValueInput(PYBLOX.REFERENCES.VAR_VALUE)
        .setCheck(PYBLOX.VARTYPES.VAR);

        this.setColour(PYBLOX.COLORS.VARIABLE);
    }
};

Blockly.Python.pyblox_ini_var_block = function(block) {
    var var_code = PYBLOX.PYTHON.GENERATOR.VAR(block);
    var value = Blockly.Python.valueToCode(block, PYBLOX.REFERENCES.VAR_VALUE, Blockly.Python.ORDER_ATOMIC);
    return var_code + ' = ' + value + '\n';
};



Blockly.Blocks.pyblox_var_instance_block = {
    init: function() {
        PYBLOX.Blocks.pyblox_general_block.init.call(this,{});

        this.appendDummyInput()
            .appendField(new Blockly.FieldLabelSerializable("class_name"), PYBLOX.REFERENCES.VAR_NAME);
        this.appendDummyInput()
            .appendField(new PYBLOX.FIELDS.VarLinkField(),PYBLOX.REFERENCES.VAR_LINK);

        this.setInputsInline(true);
        this.setColour(PYBLOX.COLORS.VARIABLE);
        this.setOutput(true, PYBLOX.VARTYPES.VAR);
    }
};

Blockly.Python.pyblox_var_instance_block = function(block) {
    var variable_class_name = Blockly.Python.variableDB_.getName(block.getFieldValue('var_name'), Blockly.Variables.NAME_TYPE);
    // TODO: Assemble Python into code variable.
    var code = variable_class_name+"\n";
    return [code, Blockly.Python.ORDER_ATOMIC];
};




PYBLOX.FLYOUTS.LOKALPYVARS =  function (ws) {
    var xmlList = [];
    var all_blocks = workspace.getAllBlocks();
    for (let i = 0,block;block = all_blocks[i]; i++) {
        if(block.has_scope){
            if(!block.scope){
                    let field = block.getField(PYBLOX.REFERENCES.VAR_NAME);
                    if (field && field instanceof PYBLOX.FIELDS.VarNameInputField) {
                        var blockText = '<block type="pyblox_var_instance_block">' +
                            '<field name="' + PYBLOX.REFERENCES.VAR_NAME + '">' + field.getValue() + '</field>' +
                            '<field name="' + PYBLOX.REFERENCES.VAR_LINK + '">' + block.id + '</field>' +
                            '</block>';
                        var block_xml = Blockly.Xml.textToDom(blockText);
                        xmlList.push(block_xml);

                }
            }
        }
    }
    return xmlList;
};




/**
 * @return {string}
 */
PYBLOX.PYTHON.GENERATOR.VAR = function(block){
    var variable_name = Blockly.Python.variableDB_.getName(block.getFieldValue(PYBLOX.REFERENCES.VAR_NAME), Blockly.Variables.NAME_TYPE);
    return (block.prefix?(block.prefix +' '):"") + variable_name;
};



Blockly.Blocks.pyblox_args_var_block = {
    init: function() {
        PYBLOX.Blocks.pyblox_abstract_ini_var.init.call(this);

        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);

        this.setOutput(true, this.var_class);
        this.setMovable(false);
        this.setDeletable(false);
        this.setColour(PYBLOX.COLORS.VARIABLE);
    }
};

PYBLOX.PYTHON.GENERATOR.pyblox_arg_var_block = PYBLOX.PYTHON.GENERATOR.VAR;

Blockly.Blocks.pyblox_kwargs_var_block = {
    init: function() {
        PYBLOX.Blocks.pyblox_abstract_ini_var.init.call(this);

        this.appendValueInput(PYBLOX.REFERENCES.VAR_VALUE);

        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);

        this.setOutput(true, this.var_class);
        this.setMovable(false);
        this.setDeletable(false);
        this.setColour(PYBLOX.COLORS.VARIABLE);
    }
};

PYBLOX.PYTHON.GENERATOR.pyblox_kwarg_var_block = function(block) {
    var var_code = PYBLOX.PYTHON.GENERATOR.VAR(block);
    var value = Blockly.Python.valueToCode(block, PYBLOX.REFERENCES.VAR_VALUE, Blockly.Python.ORDER_ATOMIC);
    if(value==="")
        value="None";
    return var_code + '=' + value;
};