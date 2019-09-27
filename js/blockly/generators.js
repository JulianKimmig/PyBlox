Blockly.Python['class'] = function(block) {
  var variable_class_name = Blockly.Python.variableDB_.getName(block.getFieldValue('class_name'), Blockly.Variables.NAME_TYPE);
  var statements_attributes = Blockly.Python.statementToCode(block, 'attributes');
  // TODO: Assemble Python into code variable.
  var code = 'class '+variable_class_name+"():";
  return code;
};

Blockly.Python['inherited_class'] = function(block) {
  var variable_class_name = Blockly.Python.variableDB_.getName(block.getFieldValue('class_name'), Blockly.Variables.NAME_TYPE);
  var value_superclass = Blockly.Python.valueToCode(block, 'superclass', Blockly.Python.ORDER_ATOMIC);
  var statements_attributes = Blockly.Python.statementToCode(block, 'attributes');
  // TODO: Assemble Python into code variable.
  var code = 'class '+variable_class_name+"():";
  return code;
};

Blockly.Python['ini_class'] = function(block) {
  var value_class = Blockly.Python.valueToCode(block, 'class', Blockly.Python.ORDER_ATOMIC);
  var statements_attributes = Blockly.Python.statementToCode(block, 'attributes');
  // TODO: Assemble Python into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};