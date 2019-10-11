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

        this.setMutator(new Blockly.Mutator(['pyblox_function_arg_input_creator']));

        this.arg_dummy = this.appendDummyInput("args");


        this.setInputsInline(undefined);


        this.arg_count_ = 0;
        this.kwarg_count_ = 0;
        this.arg_blocks = [];
        this.create_scope =temp_create_scope;
        PYBLOX.Blocks.pyblox_scope_block.init.call(this);
        this.setColour(PYBLOX.COLORS.FUNCTION);
    }
};
Blockly.Blocks.procedures_defreturn
Blockly.Blocks.pyblox_function_definition_block = {
    init: function() {
        PYBLOX.Blocks.pyblox_abstract_function_definition_block.init.call(this,{})
    },

    mutationToDom: function() {
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('args', this.arg_count_);
        container.setAttribute('kwargs', this.kwarg_count_);
        return container;
    },

    domToMutation: function(xmlElement) {
        this.arg_count_ = parseInt(xmlElement.getAttribute('args'), 10);
        this.kwarg_count_ = parseInt(xmlElement.getAttribute('kwargs'), 10);


        for (var i = 0; i < this.arg_count_; i++) {
            if (!this.getInput('ADD_ARG' + i)) {
                var input = this.appendValueInput('ADD_ARG' + i);
                if (i === 0) {
                    if (!this.getField("args_label"))
                        input.appendField("args","args_label");
                }
            }
        }

        for (var i = 0; i < this.kwarg_count_; i++) {
            if (!this.getInput('ADD_KWARG' + i)) {
                var input = this.appendValueInput('ADD_KWARG' + i);
                if (i === 0) {
                    if (!this.getField("kwargs_label"))
                        input.appendField("kwargs","kwargs_label");
                }
            }
        }

    },

    decompose: function(workspace) {
        var containerBlock = workspace.newBlock('pyblox_function_create_with_args_and_kwargs');
        containerBlock.initSvg();
        var arg_connection = containerBlock.getInput('ARGS').connection;
        for (var i = 0; i < this.arg_count_; i++) {
            var itemBlock = workspace.newBlock('pyblox_function_arg_input_creator');
            itemBlock.initSvg();
            arg_connection.connect(itemBlock.previousConnection);
            arg_connection = itemBlock.nextConnection;
        }
        var kwarg_connection = containerBlock.getInput('KWARGS').connection;
        for (var i = 0; i < this.kwarg_count_; i++) {
            var itemBlock = workspace.newBlock('pyblox_function_arg_input_creator');
            itemBlock.initSvg();
            kwarg_connection.connect(itemBlock.previousConnection);
            kwarg_connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
        var arg_Block = containerBlock.getInputTargetBlock('ARGS');
        var kwarg_Block = containerBlock.getInputTargetBlock('KWARGS');

        // Count number of inputs.
        var arg_connections = [];
        var kwarg_connections = [];

        while (arg_Block) {
            arg_connections.push(arg_Block.valueConnection_);
            arg_Block = arg_Block.nextConnection &&
                arg_Block.nextConnection.targetBlock();
        }
        while (kwarg_Block) {
            kwarg_connections.push(kwarg_Block.valueConnection_);
            kwarg_Block = kwarg_Block.nextConnection &&
                kwarg_Block.nextConnection.targetBlock();
        }

        // Disconnect any children that don't belong.
        for (var i = 0; i < this.arg_count_; i++) {
            var connection = this.getField('ADD_ARG' + i);
            if (connection && arg_connections.indexOf(connection) == -1) {
                connection.getSourceBlock().dispose(true);
            }
        }

        for (var i = 0; i < this.kwarg_count_; i++) {
            var connection = this.getInput('ADD_KWARG' + i).connection.targetConnection;
            if (connection && kwarg_connections.indexOf(connection) == -1) {
                connection.getSourceBlock().dispose(true);
            }
        }

        this.arg_count_ = arg_connections.length;
        this.kwarg_count_ = kwarg_connections.length;

        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.arg_count_; i++) {
            Blockly.Mutator.reconnect(arg_connections[i], this, 'ADD_ARG' + i);
        }
        for (var i = 0; i < this.kwarg_count_; i++) {
            Blockly.Mutator.reconnect(kwarg_connections[i], this, 'ADD_KWARG' + i);
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function(containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('ARGS');
        var i = 0;
        while (itemBlock) {
            var input = this.getInput('ADD_ARG' + i);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            i++;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }

        itemBlock = containerBlock.getInputTargetBlock('KWARGS');
        i = 0;
        while (itemBlock) {
            var input = this.getInput('ADD_KWARG' + i);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            i++;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function() {
        // Add new inputs.

        // Add new inputs.
        var input,i;
        for (i = 0; i < this.arg_count_; i++) {
            if (!this.getInput('ADD_ARG' + i)) {
                input = this.appendValueInput('ADD_ARG' + i);
                if (i === 0) {
                    if (!this.getField("args_label"))
                        input.appendField("args","args_label");
                }
                let connection = input.connection;
                let childBlock = this.workspace.newBlock("pyblox_arg_var_block");
                childBlock.initSvg();
                childBlock.render();
                let childConnection = childBlock.outputConnection;
                connection.connect(childConnection);
                PYBLOX.FUNCTIONS.add_to_scope(this.workspace.id,this.id,childBlock.id)
            }
        }
        // Remove deleted inputs.

        while (input = this.getInput('ADD_ARG' + i)) {
            if(input.connection.targetConnection)
                input.connection.targetConnection.getSourceBlock().dispose(true);
            this.removeInput('ADD_ARG' + i);
            i++;
        }


        // Add new inputs.
        for (i = 0; i < this.kwarg_count_; i++) {
            if (!this.getInput('ADD_KWARG' + i)) {
                input = this.appendValueInput('ADD_KWARG' + i);
                if (i === 0) {
                    if (!this.getField("kwargs_label"))
                        input.appendField("kwargs","kwargs_label");
                }
                let connection = input.connection;
                let childBlock = this.workspace.newBlock("pyblox_kwarg_var_block");
                childBlock.initSvg();
                childBlock.render();
                let childConnection = childBlock.outputConnection;
                connection.connect(childConnection);
                PYBLOX.FUNCTIONS.add_to_scope(this.workspace.id,this.id,childBlock.id)
            }
        }
        // Remove deleted inputs.
        while (input = this.getInput('ADD_KWARG' + i)) {
            if(input.connection.targetConnection)
                input.connection.targetConnection.getSourceBlock().dispose(true);
            this.removeInput('ADD_KWARG' + i);
            i++;
        }
    }


};


Blockly.Blocks.pyblox_function_create_with_args_and_kwargs = {

    init: function() {
        this.setColour(PYBLOX.COLORS.FUNCTION);

        this.appendDummyInput()
            .appendField("argumens");
        this.appendStatementInput('ARGS');
        this.appendDummyInput()
            .appendField("keyword argumens");
        this.appendStatementInput('KWARGS');
        this.contextMenu = false;
    }
};

Blockly.Blocks.pyblox_function_arg_input_creator = {
    /**
     * Mutator block for adding items.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(PYBLOX.COLORS.FUNCTION);

        this.appendDummyInput()
            .appendField("argument");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.contextMenu = false;
    }
};


Blockly.Python.pyblox_function_definition_block = function(block) {
    var var_code = PYBLOX.PYTHON.GENERATOR.VAR(block);
    var args = [];
    for (let i=0,input;input = this.getInput('ADD_ARG' + i);i++) {
        if(input.connection.targetConnection)
            args.push(PYBLOX.PYTHON.GENERATOR.VAR(input.connection.targetConnection.getSourceBlock()))
    }

    for (let i=0,input;input = this.getInput('ADD_KWARG' + i);i++) {
        if(input.connection.targetConnection)
            args.push(Blockly.Python.pyblox_kwarg_var_block(input.connection.targetConnection.getSourceBlock()))
    }
    var scope_code = PYBLOX.PYTHON.GENERATOR.SCOPE(block);

    return var_code + "("+args.join(", ")+"):\n" + scope_code.replace(/^/g, "  ") + "\n";
};



