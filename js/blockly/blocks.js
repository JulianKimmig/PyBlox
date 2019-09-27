Blockly.Blocks['pyblox_class_create_with_container'] = {
    init: function () {
        this.setColour(230);
        this.appendDummyInput().appendField('Add new dict elements below');
        this.appendStatementInput('STACK');
        this.contextMenu = false;
    },procedures_defnoreturn
}

Blockly.Blocks['pyblox_class_create_with_item'] = {
    init: function () {
        this.setColour(230);
        this.appendDummyInput().appendField('Element');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.contextMenu = false;
    },
}

Blockly.Blocks['pyblox_class_superclass'] = {
    init: function () {
        this.appendValueInput("KEY").setCheck(null);
        this.appendValueInput("VALUE").setCheck(null).appendField(":");
        this.setInputsInline(true);
        this.setOutput(true, "DictPair");
        this.setColour(230);
    },
}

Blockly.Blocks['class'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("ClassBlock");

        this.appendDummyInput()
            .appendField("Name")
            .appendField(new Blockly.FieldVariable("ClassName"), "class_name");

        this.appendStatementInput("attributes")
            .setCheck("function")
            .appendField("Attributes");
        //this.setInputsInline(false);
        this.setMutator(new Blockly.Mutator(['pyblox_class_create_with_item']));
        this.setColour(230);
    },

    // Mutator functions
    mutationToDom() {
        var container = document.createElement('mutation');
        container.setAttribute('parents', this.itemCount_);
        return container;
    },
    domToMutation(xmlElement) {
        this.parentCount_ = parseInt(xmlElement.getAttribute('parents'), 10);
        this.updateShape_();
    },
    decompose(workspace) {
        var containerBlock = workspace.newBlock('pyblox_class_create_with_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;

        for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('pyblox_class_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }

        return containerBlock;
    },
    compose(containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK'); // Count number of inputs.

        var connections = [];

        while (itemBlock) {
            connections.push(itemBlock.valueConnection_);
            itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
        } // Disconnect any children that don't belong.


        for (var i = 0; i < this.itemCount_; i++) {
            var connection = this.getInput('ADD' + i).connection.targetConnection;

            if (connection && connections.indexOf(connection) == -1) {
                var key = connection.getSourceBlock().getInput("KEY");

                if (key.connection.targetConnection) {
                    key.connection.targetConnection.getSourceBlock().unplug(true);
                }

                var value = connection.getSourceBlock().getInput("VALUE");

                if (value.connection.targetConnection) {
                    value.connection.targetConnection.getSourceBlock().unplug(true);
                }

                connection.disconnect();
                connection.getSourceBlock().dispose();
            }
        }

        this.itemCount_ = connections.length;
        this.updateShape_(); // Reconnect any child blocks.

        for (var i = 0; i < this.itemCount_; i++) {
            Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);

            if (!connections[i]) {
                var _itemBlock = this.workspace.newBlock('pyblox_class_superclass');

                _itemBlock.setDeletable(false);

                _itemBlock.setMovable(false);

                _itemBlock.initSvg();

                this.getInput('ADD' + i).connection.connect(_itemBlock.outputConnection);

                _itemBlock.render(); //this.get(itemBlock, 'ADD'+i)

            }
        }
    },
    // Aux functions

    updateShape_() {
        if (this.itemCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY').appendField('empty dictionary');
        } // Add new inputs.


        for (var i = 0; i < this.itemCount_; i++) {
            if (!this.getInput('ADD' + i)) {
                var input = this.appendValueInput('ADD' + i).setCheck('DictPair');

                if (i === 0) {
                    input.appendField('create dict with').setAlign(Blockly.ALIGN_RIGHT);
                }
            }
        } // Remove deleted inputs.


        while (this.getInput('ADD' + i)) {
            this.removeInput('ADD' + i);
            i++;
        } // Add the trailing \"}\"

        /*
        if (this.getInput('TAIL')) {
            this.removeInput('TAIL');
        }
        if (this.itemCount_) {
            let tail = this.appendDummyInput('TAIL')
                .appendField('}');
            tail.setAlign(Blockly.ALIGN_RIGHT);
        }*/

    }
};

Blockly.Blocks['inherited_class'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("ClassBlock");
        this.appendDummyInput()
            .appendField("Name")
            .appendField(new Blockly.FieldVariable("ClassName"), "class_name");
        this.appendValueInput("superclass")
            .setCheck("class")
            .appendField("superclass(es)");
        this.appendStatementInput("attributes")
            .setCheck(null)
            .appendField("Attributes");
        this.setInputsInline(false);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['ini_class'] = {
  init: function() {
    this.appendValueInput("class")
        .setCheck("class");
    this.appendStatementInput("attributes")
        .setCheck(null);
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};