PYBLOX.VARTYPES.VAR = "pyblox_var";
PYBLOX.REFERENCES.VAR_NAME = "var_name";
PYBLOX.REFERENCES.VAR_VALUE = "value";
PYBLOX.REFERENCES.VAR_LINK = "var_link";


PYBLOX.Blocks.pyblox_abstract_ini_var={
    init: function() {
        PYBLOX.FUNCTIONS.block_set_default_values(this,{
            default_name:PYBLOX.FUNCTIONS.var_name_generator("var")
        });
        this.appendDummyInput()
            .appendField(this.prefix)
            .appendField(new PYBLOX.FIELDS.VarNameInputField(this.default_name), PYBLOX.REFERENCES.VAR_NAME );

        PYBLOX.Blocks.pyblox_scope_block.init.call(this,{});
        this.var_class = PYBLOX.VARTYPES.VAR;
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(true);
    },
};


/**
 * @return {string}
 */
PYBLOX.PYTHON.GENERATOR.VAR = function(block){
    var variable_name = Blockly.Python.variableDB_.getName(block.getFieldValue(PYBLOX.REFERENCES.VAR_NAME), Blockly.Variables.NAME_TYPE);
    return (block.prefix?(block.prefix +' '):"") + variable_name;
};


Blockly.Blocks.pyblox_ini_var_block = {
    init: function() {
        PYBLOX.Blocks.pyblox_abstract_ini_var.init.call(this);

        this.appendValueInput(PYBLOX.REFERENCES.VAR_VALUE)
        //.setCheck("pyblox_pyvar")
        ;

        this.setColour(230);
    }
};


Blockly.Python.pyblox_ini_var_block = function(block) {
    var var_code = PYBLOX.PYTHON.GENERATOR.VAR(block);
    var value = Blockly.Python.valueToCode(block, PYBLOX.REFERENCES.VAR_VALUE, Blockly.Python.ORDER_ATOMIC);
    return var_code + ' = ' + value + '\n';
};

















Blockly.Blocks['pyblox_var'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabelSerializable("class_name"), "var_name");
        this.appendDummyInput()
            .appendField(new PYBLOX.FIELDS.VarLinkField(),"var_link");

        this.setInputsInline(true);
        this.setColour(230);
        this.setOutput(true, "pyblox_pyvar");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Python['pyblox_var'] = function(block) {
    var variable_class_name = Blockly.Python.variableDB_.getName(block.getFieldValue('var_name'), Blockly.Variables.NAME_TYPE);
    // TODO: Assemble Python into code variable.
    var code = variable_class_name+"\n";
    return [code, Blockly.Python.ORDER_ATOMIC];
};



PYBLOX.registerworkspacefunctions.push(function(workspace) {

    workspace.addChangeListener(function (event) {
        if(PYBLOX.FUNCTIONS.event_irrelevant_for_blocks(event))
            return;

        let blocks = PYBLOX.FUNCTIONS.event_to_block(event);
        for(let i = 0; i<blocks.length;i++) {
            if (!blocks[i]) {
                //console.error("block not defined")
                return;
            }
            if (event.type === Blockly.Events.CREATE) {
            }
            if (event.type === Blockly.Events.CHANGE) {
            }
        }
    });
});



PYBLOX.FLYOUTS.LOKALPYVARS =  function (ws) {
    var xmlList = [];
    console.log(ws.id,PYBLOX.SCOPES);
    let scope = PYBLOX.SCOPES[ws.id][null];
    for (let i = 0;i<scope.length; i++) {
        console.log(scope[i]);
        let block = ws.getBlockById(scope[i]);
        let field = block.getField(PYBLOX.REFERENCES.VAR_NAME);
        if(field&& field instanceof PYBLOX.FIELDS.VarNameInputField){
            var blockText = '<block type="'+PYBLOX.VARTYPES.VAR+'">' +
                '<field name="'+PYBLOX.REFERENCES.VAR_NAME+'">' + field.getValue() + '</field>' +
                '<field name="'+PYBLOX.REFERENCES.VAR_LINK+'">' + block.id + '</field>' +
                '</block>';
            var block_xml = Blockly.Xml.textToDom(blockText);
            xmlList.push(block_xml);
        }
    }
    return xmlList;
};





