PYBLOX.REFERENCES.SCOPE = "scope";
PYBLOX.PYTHON.STRINGS.EMPTYSCOPE = "pass";

PYBLOX.REFERENCES.SCOPESCATEGORYNAME = "Scopes";

PYBLOX.Blocks.pyblox_scope_block = {
    init: function(options) {
        PYBLOX.FUNCTIONS.block_set_default_values(this,{
            scope_name:undefined,
            create_scope:false,
            has_scope:true,
        });

        if(this.create_scope)
            this.appendStatementInput(PYBLOX.REFERENCES.SCOPE)
                .setCheck(null)
                .appendField(this.scope_name);

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};


/**
 * @return {string}
 */
PYBLOX.PYTHON.GENERATOR.SCOPE = function(block){
    let scope_code = Blockly.Python.statementToCode(block, PYBLOX.REFERENCES.SCOPE);
    if(scope_code === "")
        scope_code = PYBLOX.PYTHON.STRINGS.EMPTYSCOPE+"\n";
    return scope_code;
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
        PYBLOX.FUNCTIONS.create_scope(event.workspaceId,block.id);
    }
    if (event.type === Blockly.Events.CHANGE) {
        PYBLOX.FUNCTIONS.generate_scopes_cat_tree(Blockly.Workspace.getById(event.workspaceId));
    }
    if (event.type === Blockly.Events.BLOCK_MOVE) {
    }
    if (event.type === Blockly.Events.DELETE) {
        PYBLOX.FUNCTIONS.delete_scope(event.workspaceId,block.id);
    }
    PYBLOX.FUNCTIONS.generate_scopes_cat_tree(Blockly.Workspace.getById(event.workspaceId));
}

function event_pyblox_scoped_block(block,event){
    if (event.type === Blockly.Events.CREATE) {
        PYBLOX.FUNCTIONS.add_to_scope(event.workspaceId,block.getSurroundParent()?block.getSurroundParent().id:null,block.id)
    }
    if (event.type === Blockly.Events.CHANGE) {
    }
    if (event.type === Blockly.Events.BLOCK_MOVE) {
        PYBLOX.FUNCTIONS.change_scope(event.workspaceId,event.oldParentId,block.getSurroundParent()?block.getSurroundParent().id:null,block.id)
    }
    if (event.type === Blockly.Events.DELETE) {
        PYBLOX.FUNCTIONS.remove_from_scope(event.workspaceId,block.getSurroundParent()?block.getSurroundParent().id:null,block.id);

    }
    PYBLOX.FUNCTIONS.generate_scopes_cat_tree(Blockly.Workspace.getById(event.workspaceId));
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

PYBLOX.FUNCTIONS.generate_scope_vars = function(scopeid,scopes,ws){
    var xmlList = [];
    let scope = scopes[scopeid];
    if(scope) {
        for (let i = 0; i < scope.length; i++) {
            let block = ws.getBlockById(scope[i]);
            if(block) {
                let field = block.getField(PYBLOX.REFERENCES.VAR_NAME);
                if (field && field instanceof PYBLOX.FIELDS.VarNameInputField) {
                    var blockText = '<block type="' + PYBLOX.VARTYPES.VAR + '">' +
                        '<field name="' + PYBLOX.REFERENCES.VAR_NAME + '">' + field.getValue() + '</field>' +
                        '<field name="' + PYBLOX.REFERENCES.VAR_LINK + '">' + block.id + '</field>' +
                        '</block>';
                    var block_xml = Blockly.Xml.textToDom(blockText);
                    xmlList.push(block_xml);
                }
            }
        }
        for(let id in scopes)
            if(scopes[id].indexOf(scopeid)>-1)
                xmlList = xmlList.concat(PYBLOX.FUNCTIONS.generate_scope_vars(id,scopes,ws))
    }
    return xmlList;
};

PYBLOX.FUNCTIONS.generate_scope_subbox =  function(scope_id,scopes,workspace) {
    let scope_name = "global";
    if (scope_id !== null && workspace.getBlockById(scope_id))
        scope_name = workspace.getBlockById(scope_id).getField(PYBLOX.REFERENCES.VAR_NAME).getValue();
    let cat = document.createElement("CATEGORY");
    cat.setAttribute("name", scope_name);

    if(scopes[scope_id]) {
        let var_cat = document.createElement("CATEGORY");
        var_cat.setAttribute("name","Variables");
        let vars = PYBLOX.FUNCTIONS.generate_scope_vars(scope_id,scopes,workspace);
        for(let i=0;i<vars.length;i++)
            var_cat.append(vars[i]);
        cat.append(var_cat);

        for (let i = 0; i < scopes[scope_id].length; i++) {

            //console.log(i,
            //    scope_id,
            //     scopes[scope_id],
            //   scopes[scope_id][i],
            //    scopes[scopes[scope_id][i]] !== undefined,
            //);
            if (scopes[scopes[scope_id][i]] !== undefined) {
                cat.append(PYBLOX.FUNCTIONS.generate_scope_subbox(scopes[scope_id][i], scopes,workspace))
            }
        }
    }
    return cat;
};
PYBLOX.FUNCTIONS.generate_new_scope_box =  function(category,workspace) {

    let newcategories = document.createElement("CATEGORY");
    let attributes = category.getAttributeNames();
    for(let i =0;i<attributes.length;i++){
        newcategories.setAttribute(attributes[i],category.getAttribute(attributes[i]))
    }
    let scopes = PYBLOX.SCOPES[workspace.id];
    if(scopes[null])
    for(let i=0;i<scopes[null].length;i++) {
        newcategories.append(PYBLOX.FUNCTIONS.generate_scope_subbox(scopes[null][i], scopes,workspace));
    }
    return newcategories;
};

PYBLOX.FUNCTIONS.generate_scopes_cat_tree = function(workspace){
    console.log("recat");
    let toolbox = workspace.options.languageTree;
    let categories = toolbox.getElementsByTagName("category");

    for (let i = 0;i<categories.length;i++){
        if(categories[i].getAttribute("box") === "SCOPES"){
            categories[i].replaceWith(PYBLOX.FUNCTIONS.generate_new_scope_box(categories[i],workspace));
        }
    }
    workspace.updateToolbox(toolbox);

};
