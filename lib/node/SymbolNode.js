var Node = require('./Node');

function SymbolNode (name) {
  this.var = name;
}

SymbolNode.prototype = Object.create(Node.prototype);

SymbolNode.prototype.type = 'SymbolNode';

module.exports = SymbolNode;
