PYBLOX.REFERENCES.SCOPE = "scope";
PYBLOX.PYTHON.STRINGS.EMPTYSCOPE = "pass";
PYBLOX.REFERENCES.SCOPESCATEGORYNAME = "Scopes";


//PYBLOX.FUNCTIONS.add_to_scope(event.workspaceId,block.getSurroundParent()?block.getSurroundParent().id:null,block.id)

PYBLOX.Blocks.pyblox_scope_block = {

    init: function() {
        PYBLOX.FUNCTIONS.block_set_default_values(this,{
            scope_name:undefined,
            create_scope:false,
            has_scope:true,
            name:this.id
        });
        PYBLOX.Blocks.pyblox_general_block.init.call(this);
        if(this.create_scope) {
            this.appendStatementInput(PYBLOX.REFERENCES.SCOPE)
                .setCheck(null)
                .appendField(this.scope_name);
            this.scope_contents = [];
        }


        this.update_scope = PYBLOX.Blocks.pyblox_scope_block._update_scope.bind(this);
        this.add_scope_content = PYBLOX.Blocks.pyblox_scope_block._add_scope_content.bind(this);
        this.remove_scope_content = PYBLOX.Blocks.pyblox_scope_block._remove_scope_content.bind(this);
        this.get_all_scope_vars = PYBLOX.Blocks.pyblox_scope_block._get_all_scope_vars.bind(this);
        this.add_move_function(this.update_scope);
        this.add_create_function(this.update_scope);

        if(!this.workspace.scope_contents)
            this.workspace.scope_contents=[];
        if(!this.workspace.create_scope)
            this.workspace.create_scope = true;
        if(!this.workspace.update_scope)
            this.workspace.update_scope = PYBLOX.Blocks.pyblox_scope_block._update_scope.bind(this.workspace);
        if(!this.workspace.add_scope_content)
            this.workspace.add_scope_content = PYBLOX.Blocks.pyblox_scope_block._add_scope_content.bind(this.workspace);
        if(!this.workspace.remove_scope_content)
            this.workspace.remove_scope_content = PYBLOX.Blocks.pyblox_scope_block._remove_scope_content.bind(this.workspace);
        if(!this.workspace.get_all_scope_vars)
            this.workspace.get_all_scope_vars = PYBLOX.Blocks.pyblox_scope_block._get_all_scope_vars.bind(this.workspace);


    },

    _add_scope_content(scope_content){
        if(this.scope_contents.indexOf(scope_content) === -1)
            this.scope_contents.push(scope_content);
    },

    _remove_scope_content(scope_content){
        let i = this.scope_contents.indexOf(scope_content);
        if(i !== -1)
            this.scope_contents.splice(i,1);
    },

    _update_scope(){
        if(this.has_scope) {
            let new_scope = this.getSurroundParent() ? this.getSurroundParent() : this.workspace;
            if(this.scope === new_scope)
                return;
            if(this.scope)
                this.scope.remove_scope_content(this);
            else if(this.scope === null)
                PYBLOX.FUNCTIONS.remove_workspace_scope(this);

            if(new_scope)
                new_scope.add_scope_content(this);
            else
                PYBLOX.FUNCTIONS.add_workspace_scope(this);

            this.scope = new_scope;
            PYBLOX.FUNCTIONS.generate_scopes_cat_tree(this.workspace)
        }
    },
    _get_all_scope_vars(){
        let scope_vars = [];
        if(this.scope)
            scope_vars = this.scope.get_all_scope_vars();
        if(this.scope_contents){
            for(let j=0;j<this.scope_contents.length;j++) {
                let sub_content = this.scope_contents[j];
                let field = sub_content.getField(PYBLOX.REFERENCES.VAR_NAME);
                if (field && field instanceof PYBLOX.FIELDS.VarNameInputField) {
                    scope_vars.push(sub_content);
                }
            }
        }
        return scope_vars
    },
};



PYBLOX.FUNCTIONS.generate_scopes_cat = function(workspace,scope_ele,scope_contents){
    //console.log(scope_ele,scope_ele.parentElement,scope_ele.getAttribute("scope"));
    for(let i=0;i<scope_contents.length;i++){
        let cont = scope_contents[i];
        if(cont.create_scope) {
            let ele = document.createElement("category");


            ele.setAttribute("name", cont.name);

            var functionbox = document.createElement("category");
            functionbox.setAttribute("name", "Functions");
            ele.append(functionbox);

            var classbox = document.createElement("category");
            classbox.setAttribute("name", "Classes");
            ele.append(classbox);

            var scopebox = document.createElement("category");
            scopebox.setAttribute("name", "Scopes");
            ele.append(scopebox);

            let  in_scope_vars = cont.get_all_scope_vars();
            if(in_scope_vars.length > 0){
                var varbox = document.createElement("category");
                varbox.setAttribute("name", "Variables");
                ele.append(varbox);
            }
            for(let j=0;j<in_scope_vars.length;j++) {
                let sub_content = in_scope_vars[j];
                let field = sub_content.getField(PYBLOX.REFERENCES.VAR_NAME);
                var blockText = '<block type="pyblox_var_instance_block">' +
                    '<field name="' + PYBLOX.REFERENCES.VAR_NAME + '">' + field.getValue() + '</field>' +
                    '<field name="' + PYBLOX.REFERENCES.VAR_LINK + '">' + sub_content.id + '</field>' +
                    '</block>';
                var block_xml = Blockly.Xml.textToDom(blockText);
                varbox.append(block_xml);
            }


            PYBLOX.FUNCTIONS.generate_scopes_cat(workspace, scopebox, cont.scope_contents);
            scope_ele.append(ele);
        }
    }
};

PYBLOX.FUNCTIONS.generate_scopes_cat_tree = function(workspace,scope_ele=null){
    console.log("recat");
    let toolbox = workspace.options.languageTree;
    let categories = toolbox.getElementsByTagName("category");

    for (let i = 0;i<categories.length;i++){
        if(categories[i].getAttribute("box") === "SCOPES"){
            while (categories[i].firstChild) {
                categories[i].firstChild.remove();
            }
            PYBLOX.FUNCTIONS.generate_scopes_cat(workspace,categories[i],workspace.scope_contents);
        }
    }
    workspace.updateToolbox(toolbox);

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



/*
PYBLOX.registerworkspacefunctions.push(function(workspace) {
    workspace.addChangeListener(function (event) {
        if(event.type !== Blockly.Events.UI)
            PYBLOX.FUNCTIONS.generate_scopes_cat_tree(workspace);
    });
});
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
    PYBLOX.FUNCTIONS.get_scope(workspace_id,scope).push(id);
    return scope
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
             //   event_block_missing(event);
                return;
            }

            if (blocks[i].create_scope) {
         //       event_pyblox_scope_block(blocks[i], event)
            }
            if (blocks[i].has_scope) {
         //       event_pyblox_scoped_block(blocks[i], event)
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
*/