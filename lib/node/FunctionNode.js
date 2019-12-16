var Node = require('./Node');

function FunctionNode(name, args) {
  if (name === 'maxValue' && args.length >= 2) {
    this["if"] = [
      {"<=": [args[0], args[1]]}, args[0],
      args[1]
    ]
  } else if (name === 'penaltyMonths' && args.length >= 2) {
    this["if"] = [
      {
        ">=": [{"date_parse": args[0]}, {"date_parse": args[1]}, 0,
          {"*": [0.15, {"+": [1, {"monthsDiff": [{"date_parse": args[1]}, {"date_parse": args[0]}]}]}]}]
      }
    ]
  } else if (name === 'rounduphundred' && args.length >= 1) {
    this["if"] = [
      {"==": [{"%": [args[0], 100]}, 0]}, {"/": [args[0], 100]},
      {"+": [{"/": [{"-": [args[0], {"%": [args[0], 100]}]}, 100]}, 1]}
    ]
  } else if (name === 'roundupthousand' && args.length >= 1) {
    this["if"] = [
      {"==": [{"%": [args[0], 1000]}, 0]}, {"/": [args[0], 1000]},
      {"+": [{"/": [{"-": [args[0], {"%": [args[0], 1000]}]}, 1000]}, 1]}
    ]
  } else if (name === 'rounduphundredthousand' && args.length >= 1) {
    this["if"] = [
      {"==": [{"%": [args[0], 100000]}, 0]}, {"/": [args[0], 100000]},
      {"+": [{"/": [{"-": [args[0], {"%": [args[0], 100000]}]}, 100000]}, 1]}
    ]
  } else {
    this[name] = args || [];
  }
}

FunctionNode.prototype = Object.create(Node.prototype);

FunctionNode.prototype.type = 'FunctionNode';

module.exports = FunctionNode;
