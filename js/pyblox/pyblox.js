var PYBLOX = {
    COLORS:{},
    FUNCTIONS:{},
    registerworkspacefunctions:[],
    FLYOUTS:{},
    NESTEDFLYOUTS:{},
    FIELDS:{},
    SCOPES:{},
    Blocks:{},
    DUMMY_WORKSPACE : new Blockly.Workspace(),
};






//visuals
PYBLOX.COLORS.CLASS = '#9d75d4';
PYBLOX.COLORS.FUNCTION = '#5890d4';

//wokspaceini
PYBLOX.registerworkspacefunctions.push(function(workspace) {
    for(let n in PYBLOX.FLYOUTS){
        workspace.registerToolboxCategoryCallback(
            n, PYBLOX.FLYOUTS[n]);
    }
    for(let n in PYBLOX.NESTEDFLYOUTS){
        workspace.registerToolboxCategoryCallback(
            n,function(workspace){
                var xmlList = [];
                for (let i = 0;i< PYBLOX.NESTEDFLYOUTS[n].length;i++)
                    xmlList = xmlList.concat(PYBLOX.NESTEDFLYOUTS[n][i](workspace));
                return xmlList;
            }
            );
    }
});


// functions

PYBLOX.FUNCTIONS.block_set_default_value = function(block,attribute,value){
    block[attribute] = block[attribute] || value
};

PYBLOX.FUNCTIONS.block_set_default_values = function(block,dict){
    for (let attribute in dict)
        PYBLOX.FUNCTIONS.block_set_default_value(block,attribute,dict[attribute])
};

PYBLOX.FUNCTIONS.find_block_by_id_globally = function(id){
    let all_ws = Blockly.Workspace.getAll();
    for(let i=0, ws;ws=all_ws[i];i++) {
        let b = ws.getBlockById(id);
        if (b)
            return b;
    }
    return null
}

PYBLOX.FUNCTIONS.validate_var_name = function(input){
    return input.trim().replace(/^[^a-zA-Z_]|[^0-9a-zA-Z_]/g, "_");
};

PYBLOX.register_workspace = function (ws) {
    for(let i=0;i< PYBLOX.registerworkspacefunctions.length;i++)
        PYBLOX.registerworkspacefunctions[i](ws);
};

PYBLOX.FUNCTIONS.event_irrelevant_for_blocks = function (event) {
    return event.type === Blockly.Events.UI || event.type === Blockly.Events.FINISHED_LOADING ;
};

PYBLOX.FUNCTIONS.event_to_block = function (event) {
    let ids = event.ids;
    if(!ids)
        ids = [event.blockId];
    let blocks = [];

    for(let i=0;i<ids.length;i++) {
        let ws = Blockly.Workspace.getById(event.workspaceId);
        let block = ws.getBlockById(ids[i]);
        if (!block)
            block = PYBLOX.FUNCTIONS.find_block_by_id_globally();

        if (!block)
            block = PYBLOX.FUNCTIONS.find_block_by_id_globally(ids[i]);
        if (!block && event.type === Blockly.Events.DELETE) {
            block = Blockly.Xml.domToBlock(event.oldXml, PYBLOX.DUMMY_WORKSPACE);
        }

        blocks.push(block)
    }
    //if(!block)
        //console.log(event.type,event);
    return blocks;

};

PYBLOX.FUNCTIONS.add_to_nested_flyout = function (name, func) {
    if(!PYBLOX.NESTEDFLYOUTS[name])
        PYBLOX.NESTEDFLYOUTS[name] = [];
    PYBLOX.NESTEDFLYOUTS[name].push(func)
};


