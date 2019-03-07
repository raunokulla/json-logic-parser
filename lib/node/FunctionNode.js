var Node = require('./Node');

function FunctionNode (name, args) {
  if (name === 'maxValue' && args.length >= 2) {
    this["if"] = [
        {"<=": [args[0], args[1]] }, args[0],
        args[1]
      ]
  } else if (name === 'roundupthousand' && args.length >= 1) {
    this["_ceil"] = [{"/": [args[0], 1000]}];
  } else if (name === 'rounduphundredthousand' && args.length >= 1) {
    this["_ceil"] = [{"/": [args[0], 100000]}];
  } else {
    this[name] = args || [];
  }
}

FunctionNode.prototype = Object.create(Node.prototype);

FunctionNode.prototype.type = 'FunctionNode';

module.exports = FunctionNode;
