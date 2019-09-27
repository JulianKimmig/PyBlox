PYBLOX.Blocks['pyblox_scope_block'] = {
    init: function(options) {
        PYBLOX.FUNCTIONS.block_set_default_values(this,{
            scope_name:undefined,
            create_scope:false,
            has_scope:true,
        });

        if(this.create_scope)
            this.appendStatementInput("scope")
                .setCheck(null)
                .appendField(this.scope_name);

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

PYBLOX.FUNCTIONS.create_scope = function (workspace_id,scope) {
    if(scope === undefined)
        scope = null;
    if(!PYBLOX.SCOPES[workspace_id])
        PYBLOX.SCOPES[workspace_id] = {};
    if(!PYBLOX.SCOPES[workspace_id][scope])
        PYBLOX.SCOPES[workspace_id][scope] = [];

    return PYBLOX.SCOPES[workspace_id][scope];
};


PYBLOX.FUNCTIONS.get_scope = function (workspace_id, scope) {
    return PYBLOX.FUNCTIONS.create_scope(workspace_id, scope);
};
PYBLOX.FUNCTIONS.add_to_scope = function (workspace_id,scope, id) {
    PYBLOX.FUNCTIONS.get_scope(workspace_id,scope).push(id)
};

PYBLOX.FUNCTIONS.remove_from_scope = function (workspace_id, scope, id) {
    scope = PYBLOX.FUNCTIONS.get_scope(workspace_id,scope);
    while ((ax= scope.indexOf(id)) !== -1) {
        scope.splice(ax, 1);
    }
};
PYBLOX.FUNCTIONS.change_scope = function (workspace_id,old_scope,new_scope, id) {
    if(old_scope === new_scope)return;
    PYBLOX.FUNCTIONS.remove_from_scope(workspace_id,old_scope,id);
    PYBLOX.FUNCTIONS.add_to_scope(workspace_id,new_scope, id)
};


PYBLOX.FUNCTIONS.delete_scope = function (workspace_id, scope) {
    if(scope === undefined)
        scope = null;
    if(!PYBLOX.SCOPES[workspace_id])
        return;
    if(!PYBLOX.SCOPES[workspace_id][scope])
        return;

    delete PYBLOX.SCOPES[workspace_id][scope];

};

PYBLOX.FUNCTIONS.remove_from_every_scope = function(id){
    for(let ws in PYBLOX.SCOPES)
        for (let scope in PYBLOX.SCOPES[ws])
            PYBLOX.FUNCTIONS.remove_from_scope(ws,scope,id)

};


function event_pyblox_scope_block(block,event){
    if (event.type === Blockly.Events.CREATE) {
        PYBLOX.FUNCTIONS.create_scope(event.workspaceId,block.id)
    }
    if (event.type === Blockly.Events.CHANGE) {
    }
    if (event.type === Blockly.Events.BLOCK_MOVE) {
    }
    if (event.type === Blockly.Events.DELETE) {
        PYBLOX.FUNCTIONS.delete_scope(event.workspaceId,block.id)
    }
}

function event_pyblox_scoped_block(block,event){
    if (event.type === Blockly.Events.CREATE) {
        PYBLOX.FUNCTIONS.add_to_scope(event.workspaceId,block.getParent()?block.getParent().id:null,block.id)
    }
    if (event.type === Blockly.Events.CHANGE) {
    }
    if (event.type === Blockly.Events.BLOCK_MOVE) {
        PYBLOX.FUNCTIONS.change_scope(event.workspaceId,event.oldParentId,event.newParentId,block.id)
    }
    if (event.type === Blockly.Events.DELETE) {
        PYBLOX.FUNCTIONS.remove_from_scope(event.workspaceId,block.getParent()?block.getParent().id:null,block.id);

    }
}

function event_block_missing(event){
    PYBLOX.FUNCTIONS.remove_from_every_scope(event.blockId);
    for(let ws in PYBLOX.SCOPES){
        PYBLOX.FUNCTIONS.delete_scope(ws, event.blockId)
    }
}


PYBLOX.registerworkspacefunctions.push(function(workspace) {
    workspace.addChangeListener(function (event) {
        if(PYBLOX.FUNCTIONS.event_irrelevant_for_blocks(event))
            return;

        let blocks = PYBLOX.FUNCTIONS.event_to_block(event);
        for(let i = 0; i<blocks.length;i++) {
            if (!blocks[i]) {
                event_block_missing(event);
                return;
            }

            if (blocks[i].create_scope) {
                event_pyblox_scope_block(blocks[i], event)
            }
            if (blocks[i].has_scope) {
                event_pyblox_scoped_block(blocks[i], event)
            }
            //console.log(PYBLOX.SCOPES)
        }
    });
});
