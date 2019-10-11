PYBLOX.VARTYPES.FUNCTION = "pyblox_function";
PYBLOX.PYTHON.STRINGS.FUNCTIONDEFINITION = "def";
PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX = "ADD_";
PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_LABEL_PREFIX = "label_";
PYBLOX.REFERENCES.FUNCION_INPUT_ARG = "args";
PYBLOX.REFERENCES.FUNCION_INPUT_KWARG = "kwargs";


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


        this.setInputsInline(undefined);


        this.arg_count_ = 0;
        this.kwarg_count_ = 0;
        this.create_scope =temp_create_scope;
        PYBLOX.Blocks.pyblox_scope_block.init.call(this);
        this.setColour(PYBLOX.COLORS.FUNCTION);
    }
};

Blockly.Blocks.pyblox_function_definition_block = {
    init: function() {
        PYBLOX.Blocks.pyblox_abstract_function_definition_block.init.call(this,{})
    },

    mutationToDom: function() {
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute(PYBLOX.REFERENCES.FUNCION_INPUT_ARG, this.arg_count_);
        container.setAttribute(PYBLOX.REFERENCES.FUNCION_INPUT_KWARG, this.kwarg_count_);
        return container;
    },


    _update_function_input:function(input_type,size){
        for (var i = 0; i < size; i++) {
            if (!this.getInput(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX+input_type + i)) {
                var input = this.appendValueInput(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX+input_type + i);
                if (i === 0) {
                    if (!this.getField(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_LABEL_PREFIX+input_type))
                        input.appendField(input_type,PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_LABEL_PREFIX+input_type);
                }
            }
        }
    },



    domToMutation: function(xmlElement) {
        this.arg_count_ = parseInt(xmlElement.getAttribute(PYBLOX.REFERENCES.FUNCION_INPUT_ARG), 10);
        this.kwarg_count_ = parseInt(xmlElement.getAttribute(PYBLOX.REFERENCES.FUNCION_INPUT_KWARG), 10);

        this._update_function_input(PYBLOX.REFERENCES.FUNCION_INPUT_ARG,this.arg_count_);
        this._update_function_input(PYBLOX.REFERENCES.FUNCION_INPUT_KWARG,this.kwarg_count_);
        this.sort_inputs()
    },

    decompose: function(workspace) {
        var containerBlock = workspace.newBlock('pyblox_function_create_with_args_and_kwargs');
        containerBlock.initSvg();

        function _createconenctions(conkey, size) {
            var connection = containerBlock.getInput(conkey).connection;
            for (var i = 0; i < size; i++) {
                var itemBlock = workspace.newBlock('pyblox_function_arg_input_creator');
                itemBlock.initSvg();
                connection.connect(itemBlock.previousConnection);
                connection = itemBlock.nextConnection;
            }
        }

        _createconenctions(PYBLOX.REFERENCES.FUNCION_INPUT_ARG,this.arg_count_);
        _createconenctions(PYBLOX.REFERENCES.FUNCION_INPUT_KWARG,this.kwarg_count_);

        return containerBlock;
    },
    sort_inputs: function () {
        var i=0;
        while(this.getInput(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX+PYBLOX.REFERENCES.FUNCION_INPUT_ARG + i)) {
            this.moveInputBefore(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX + PYBLOX.REFERENCES.FUNCION_INPUT_ARG + i,PYBLOX.REFERENCES.SCOPE);
            i++;
        }

        i=0;
        while(this.getInput(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX+PYBLOX.REFERENCES.FUNCION_INPUT_KWARG + i)){
            this.moveInputBefore(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX+PYBLOX.REFERENCES.FUNCION_INPUT_KWARG + i,PYBLOX.REFERENCES.SCOPE);
        i++;
    }
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
        let _create_input_blocks = function(input_type, size){
            var input,i;
            for (i = 0; i < size; i++) {
                input = this.getInput(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX + input_type + i);
                if (input) {
                    let connection = input.connection;
                    if(!connection.targetConnection) {
                        let childBlock = this.workspace.newBlock("pyblox_" +input_type+"_var_block");
                        childBlock.initSvg();
                        childBlock.render();
                        let childConnection = childBlock.outputConnection;
                        connection.connect(childConnection);
                    }
                }
            }

            while (input = this.getInput(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX+ input_type + i)) {
                if(input.connection.targetConnection)
                    input.connection.targetConnection.getSourceBlock().dispose(true);
                this.removeInput(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX + input_type + i);
                i++;
            }
        }.bind(this);

        let _compose_block = function (type,size) {
            var block =  containerBlock.getInputTargetBlock(type);
            var connections = [];

            //get all connections
            while (block) {
                connections.push(block.valueConnection_);
                block = block.nextConnection &&
                    block.nextConnection.targetBlock();
            }

            // Disconnect any children that don't belong.
            for (var i = 0; i < size; i++) {
                var connection = this.getField(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX+type + i);
                if (connection && connections.indexOf(connection) == -1) {
                    connection.getSourceBlock().dispose(true);
                }
            }

            let newsize = connections.length;
            this._update_function_input(type,newsize);
            _create_input_blocks(type,newsize);

          //  for (var i = 0; i < newsize; i++) {
           //     Blockly.Mutator.reconnect(connections[i], this, PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX+type + i);
          //  }

            return newsize;
        }.bind(this);

        this.arg_count_ = _compose_block(PYBLOX.REFERENCES.FUNCION_INPUT_ARG,this.arg_count_);
        this.kwarg_count_ = _compose_block(PYBLOX.REFERENCES.FUNCION_INPUT_KWARG,this.kwarg_count_);

        this.sort_inputs()
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function(containerBlock) {

        let _saveConnections = function (input_type){
            var itemBlock = containerBlock.getInputTargetBlock(input_type);
            var i = 0;
            while (itemBlock) {
                var input = this.getInput(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX+input_type + i);
                itemBlock.valueConnection_ = input && input.connection.targetConnection;
                i++;
                itemBlock = itemBlock.nextConnection &&
                    itemBlock.nextConnection.targetBlock();
            }
        }.bind(this);

        _saveConnections(PYBLOX.REFERENCES.FUNCION_INPUT_ARG);
        _saveConnections(PYBLOX.REFERENCES.FUNCION_INPUT_KWARG);
    },


};

//the lefthandsite block in the mutator
Blockly.Blocks.pyblox_function_create_with_args_and_kwargs = {
    init: function() {
        this.setColour(PYBLOX.COLORS.FUNCTION);

        this.appendDummyInput()
            .appendField("argumens");
        this.appendStatementInput(PYBLOX.REFERENCES.FUNCION_INPUT_ARG );
        this.appendDummyInput()
            .appendField("keyword argumens");
        this.appendStatementInput(PYBLOX.REFERENCES.FUNCION_INPUT_KWARG );
        this.contextMenu = false;
    }
};

//the arguments blocks for the mutator
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
    for (let i=0,input;input = this.getInput(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX+PYBLOX.REFERENCES.FUNCION_INPUT_ARG + i);i++) {
        if(input.connection.targetConnection)
            args.push(PYBLOX.PYTHON.GENERATOR.pyblox_arg_var_block(input.connection.targetConnection.getSourceBlock()))
    }

    for (let i=0,input;input = this.getInput(PYBLOX.REFERENCES.FUNCION_INPUT_FIELD_PREFIX+PYBLOX.REFERENCES.FUNCION_INPUT_KWARG + i);i++) {
        if(input.connection.targetConnection)
            args.push(PYBLOX.PYTHON.GENERATOR.pyblox_kwarg_var_block(input.connection.targetConnection.getSourceBlock()))
    }
    var scope_code = PYBLOX.PYTHON.GENERATOR.SCOPE(block);

    return var_code + "("+args.join(", ")+"):\n" + scope_code.replace(/^/g, "  ") + "\n";
};






PYBLOX.FLYOUTS.FUNCTIONS =  function (ws) {
    var xmlList = [];
    var all_blocks = workspace.getAllBlocks();
    for (let i = 0,block;block = all_blocks[i]; i++) {
        if(block.has_scope){
            if(!block.scope){
                if(block.var_class === PYBLOX.VARTYPES.FUNCTION) {
                    let field = block.getField(PYBLOX.REFERENCES.VAR_NAME);
                    if (field && field instanceof PYBLOX.FIELDS.VarNameInputField) {
                       // var blockText = '<block type="pyblox_var_instance_block">' +
                       //     '<field name="' + PYBLOX.REFERENCES.VAR_NAME + '">' + field.getValue() + '</field>' +
                        //    '<field name="' + PYBLOX.REFERENCES.VAR_LINK + '">' + block.id + '</field>' +
                        //    '</block>';
                      //  var block_xml = Blockly.Xml.textToDom(blockText);
                     //   xmlList.push(block_xml);
                    }
                }
            }
        }
    }
    return xmlList;
};



