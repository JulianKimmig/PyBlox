PYBLOX.Blocks.pyblox_general_block={
    add_create_function_: function (func) {
        if(this.on_create_functions.indexOf(func) === -1)
            this.on_create_functions.push(func);
    },

    add_delete_function_: function (func) {
        if(this.on_delete_functions.indexOf(func) === -1)
            this.on_delete_functions.push(func);
    },

    add_change_function_: function (func) {
        if(this.on_change_functions.indexOf(func) === -1)
            this.on_change_functions.push(func);
    },

    add_move_function_: function (func) {
        if(this.on_move_functions.indexOf(func) === -1)
            this.on_move_functions.push(func);
    },

    init: function() {
        if(!this.on_delete_functions) {
            this.on_delete_functions = [];
        }
        if(!this.on_create_functions) {
            this.on_create_functions = [];
        }
        if(!this.on_change_functions) {
            this.on_change_functions = [];
        }
        if(!this.on_move_functions) {
            this.on_move_functions = [];
        }
        if(!this.add_create_function)
            this.add_create_function = PYBLOX.Blocks.pyblox_general_block.add_create_function_.bind(this);

        if(!this.add_delete_function)
            this.add_delete_function = PYBLOX.Blocks.pyblox_general_block.add_delete_function_.bind(this);

        if(!this.add_change_function)
            this.add_change_function = PYBLOX.Blocks.pyblox_general_block.add_change_function_.bind(this);

        if(!this.add_move_function)
            this.add_move_function = PYBLOX.Blocks.pyblox_general_block.add_move_function_.bind(this);
    },


};

function event_pyblox_general(block,event){
    //console.log(event.type);
    if (event.type === Blockly.Events.CREATE) {
        for(let i=0;i<block.on_create_functions.length;i++)
            block.on_create_functions[i].call(block)
    }
    if (event.type === Blockly.Events.CHANGE) {
        for(let i=0;i<block.on_change_functions.length;i++)
            block.on_change_functions[i].call(block)
    }
    if (event.type === Blockly.Events.BLOCK_MOVE) {
        for(let i=0;i<block.on_move_functions.length;i++)
            block.on_move_functions[i].call(block)
    }
    if (event.type === Blockly.Events.DELETE) {
        for(let i=0;i<block.on_delete_functions.length;i++)
            block.on_delete_functions[i].call(block)
    }
}

PYBLOX.registerworkspacefunctions.push(function(workspace) {
    workspace.addChangeListener(function (event) {
        if(PYBLOX.FUNCTIONS.event_irrelevant_for_blocks(event))
            return;

        let blocks = PYBLOX.FUNCTIONS.event_to_block(event);
        for(let i = 0; i<blocks.length;i++) {
            if (blocks[i]) {
                event_pyblox_general(blocks[i],event)
            }
        }
    });
});