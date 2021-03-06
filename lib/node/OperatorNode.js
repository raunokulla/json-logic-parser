var Node = require('./Node');

function OperatorNode (op, args) {
  this[op] = args || [];
}

OperatorNode.prototype = Object.create(Node.prototype);

OperatorNode.prototype.type = 'OperatorNode';

module.exports = OperatorNode;
