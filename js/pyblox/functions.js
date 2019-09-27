PYBLOX.Blocks['pyblox_abstract_function_definition_block'] = {

    init: function(options) {
        PYBLOX.FUNCTIONS.block_set_default_values(this,{
            prefix:"def",
            default_name:"function_name",
            scope_name:undefined,
            create_scope:true,
            description_text:"function description ..."
        });
        let temp_create_scope = this.create_scope;
        this.create_scope = false;
        PYBLOX.Blocks['pyblox_abstract_ini_var'].init.call(this);

        this.var_class = "pyblox_function";

        this.appendValueInput("args")
            .setCheck("list")
            .appendField("args");
        this.appendValueInput("kwargs")
            .setCheck("dict")
            .appendField("kwargs");

        this.setInputsInline(undefined);

        this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
        if ((this.workspace.options.comments ||
            (this.workspace.options.parentWorkspace &&
                this.workspace.options.parentWorkspace.options.comments)) &&
            Blockly.Msg['PROCEDURES_DEFNORETURN_COMMENT']) {
            this.setCommentText(this.description_text);
        }

        this.create_scope =temp_create_scope;
        PYBLOX.Blocks['pyblox_scope_block'].init.call(this);
        this.setColour(PYBLOX.COLORS.FUNCTION);
    }
};

Blockly.Blocks['pyblox_function_definition_block'] = {
    init: function() {
        PYBLOX.Blocks['pyblox_abstract_function_definition_block'].init.call(this,{})
    }
};

Blockly.Python['pyblox_function_definition_block'] = function(block) {
    var variable_class_name = Blockly.Python.variableDB_.getName(block.getFieldValue('var_name'), Blockly.Variables.NAME_TYPE);
    var value_superclass = Blockly.Python.valueToCode(block, 'superclass', Blockly.Python.ORDER_ATOMIC);
    var scope_code = Blockly.Python.statementToCode(block, 'scope');
    // TODO: Assemble Python into code variable.
    var code = this.prefix +' '+variable_class_name+"():\n" + scope_code;

    code = Blockly.Python.scrub_(block, code);
    Blockly.Python.definitions_["%" + variable_class_name] = code;
    return null

    return null;
};


