PYBLOX.VARTYPES.FUNCTION = "pyblox_function";
PYBLOX.PYTHON.STRINGS.FUNCTIONDEFINITION = "def";


PYBLOX.Blocks.pyblox_abstract_function_definition_block = {

    init: function(options) {
        PYBLOX.FUNCTIONS.block_set_default_values(this,{
            prefix:PYBLOX.PYTHON.STRINGS.FUNCTIONDEFINITION,
            default_name:PYBLOX.FUNCTIONS.var_name_generator("func"),
            scope_name:undefined,
            create_scope:true,
            description_text:"function description ..."
        });
        let temp_create_scope = this.create_scope;
        this.create_scope = false;
        PYBLOX.Blocks.pyblox_abstract_ini_var.init.call(this);

        this.var_class = PYBLOX.VARTYPES.FUNCTION;

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
                this.workspace.options.parentWorkspace.options.comments))) {
            this.setCommentText(this.description_text);
        }

        this.create_scope =temp_create_scope;
        PYBLOX.Blocks.pyblox_scope_block.init.call(this);
        this.setColour(PYBLOX.COLORS.FUNCTION);
    }
};

Blockly.Blocks.pyblox_function_definition_block = {
    init: function() {
        PYBLOX.Blocks.pyblox_abstract_function_definition_block.init.call(this,{})
    }
};

Blockly.Python.pyblox_function_definition_block = function(block) {
    var var_code = PYBLOX.PYTHON.GENERATOR.VAR(block);
    //var value_superclass = Blockly.Python.valueToCode(block, 'superclass', Blockly.Python.ORDER_ATOMIC);
    var scope_code = PYBLOX.PYTHON.GENERATOR.SCOPE(block);

    return var_code + "():\n" + scope_code.replace(/^/g, "  ") + "\n";
};



