var PYBLOX = {
    COLORS:{},
    FUNCTIONS:{},
    registerworkspacefunctions:[],
    FLYOUTS:{},
    NESTEDFLYOUTS:{},
    FIELDS:{}
};






//visuals
PYBLOX.COLORS.CLASS = '#9d75d4';


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

PYBLOX.FUNCTIONS.validate_var_name = function(input){
    return input.trim().replace(/^[^a-zA-Z_]|[^0-9a-zA-Z_]/g, "_");
};

PYBLOX.register_workspace = function (ws) {
    for(let i=0;i< PYBLOX.registerworkspacefunctions.length;i++)
        PYBLOX.registerworkspacefunctions[i](ws);
};

PYBLOX.FUNCTIONS.event_irrelevant_for_blocks = function (event) {
    return event.type === Blockly.Events.UI || Blockly.Events.FINISHED_LOADING ;
};

PYBLOX.FUNCTIONS.event_to_block = function (event) {
    let ws = Blockly.Workspace.getById(event.workspaceId);
    let block = ws.getBlockById(event.blockId);
    if(!block)
        console.log(event.type,event);
    return block;

};

PYBLOX.FUNCTIONS.add_to_nested_flyout = function (name, func) {
    if(!PYBLOX.NESTEDFLYOUTS[name])
        PYBLOX.NESTEDFLYOUTS[name] = [];
    PYBLOX.NESTEDFLYOUTS[name].push(func)
};








