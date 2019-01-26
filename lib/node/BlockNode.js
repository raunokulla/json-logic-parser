var Node = require('./Node');

function BlockNode (blocks) {
  return blocks;
}

BlockNode.prototype = Object.create(Node.prototype);

BlockNode.prototype.type = 'BlockNode';

module.exports = BlockNode;
