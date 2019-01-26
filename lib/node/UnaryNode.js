var Node = require('./Node');

function UnaryNode (op, argument) {
  this[op] = argument;
}

UnaryNode.prototype = Object.create(Node.prototype);

UnaryNode.prototype.type = 'UnaryNode';

module.exports = UnaryNode;
