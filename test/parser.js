'use strict';

var mrParser = require('../');
var Parser = mrParser.Parser;
var test = require('tape');

function parse (exp) {
  return new Parser().parse(exp);
}

test('parser:number', function (t) {
  t.deepEquals(parse('32'), [32]);
  t.end();
});

test('parser:assignment', function (t) {
  t.deepEquals(parse('x = 1 + 2'), [{
    name: 'x',
    expr: {
      '+': [1, 2]
    }
  }]);
  t.end();
});

test('parser:ternary', function (t) {
  t.deepEquals(parse('1 ? a : b'), [{
    condition: 1,
    trueExpr: { var: 'a' },
    falseExpr: { var: 'b' }
  }]);
  t.deepEquals(parse('"foo" === "bar" ? a : b'), [{
    condition: {
      '===': [
        { var: 'foo' },
        { var: 'bar' }
      ]
    },
    trueExpr: { var: 'a' },
    falseExpr: { var: 'b' }
  }]);
  t.deepEquals(parse('1 ? 2 ? a : b : c'), [{
    condition: 1,
    trueExpr: {
      condition: 2,
      trueExpr: { var: 'a' },
      falseExpr: { var: 'b' }
    },
    falseExpr: { var: 'c' }
  }]);
  t.end();
});

test('parser:logicalOR', function (t) {
  t.deepEquals(parse('1 || 2'), [{
    '||': [1, 2]
  }]);
  t.deepEquals(parse('1 || 3 || 2'), [{
    '||': [1,
      {
        '||': [3, 2]
      }
    ]
  }]);
  t.end();
});

test('parser:logicalXOR', function (t) {
  t.deepEquals(parse('1 xor 2'), [{
    'xor': [1, 2]
  }]);
  t.deepEquals(parse('1 xor 3 xor 2'), [{
    'xor': [
      1,
      {
        'xor': [3, 2]
      }
    ]
  }]);
  t.end();
});

test('parser:logicalAND', function (t) {
  t.deepEquals(parse('1 && 2'), [{
    '&&': [1, 2]
  }]);
  t.deepEquals(parse('1 && 3 && 2'), [{
    '&&': [
      1, {
        '&&': [3, 2]
      }
    ]
  }]);
  t.end();
});

test('parser:bitwiseOR', function (t) {
  t.deepEquals(parse('1 | 2'), [{
    '|': [1, 2]
  }]);
  t.deepEquals(parse('1 | 3 | 2'), [{
    '|': [
      1,
      {
        '|': [3, 2]
      }
    ]
  }]);
  t.end();
});

test('parser:bitwiseXOR', function (t) {
  t.deepEquals(parse('1 ^| 2'), [{
    '^|': [1, 2]
  }]);
  t.deepEquals(parse('1 ^| 3 ^| 2'), [{
    '^|': [
      1,
      {
        '^|': [3, 2]
      }
    ]
  }]);
  t.end();
});

test('parser:bitwiseAND', function (t) {
  t.deepEquals(parse('1 & 2'), [{
    '&':[1, 2]
  }]);
  t.deepEquals(parse('1 & 3 & 2'), [{
    '&': [
      1,{
        '&': [3, 2]
      }
    ]
  }]);
  t.end();
});

test('parser:relational', function (t) {
  t.deepEquals(parse('1 != 2'), [{
    '!=': [1, 2]
  }]);
  t.end();
});

test('parser:shift', function (t) {
  t.deepEquals(parse('1 << 2'), [{
    '<<': [1, 2]
  }]);
  t.deepEquals(parse('1 << 3 >> 2'), [{
    '<<': [
      1,
      {
        '>>': [3, 2]
      }
    ]
  }]);
  t.end();
});

test('parser:additive', function (t) {
  t.deepEquals(parse('32 + 3'), [{
    '+': [32, 3]
  }]);
  t.deepEquals(parse('1 + 2 - 3'), [{
    '-': [{
      '+': [1, 2]
    }, 3]
  }]);
  t.throws(function () { parse('1 + 2 -') });
  t.throws(function () { parse('1 + 2 - *') });
  t.end();
});

test('parser:multiplicative', function (t) {
  t.deepEquals(parse('32 * 3'), [{
    '*': [32, 3]
  }]);
  t.deepEquals(parse('1 * 2 * 3'), [{
    '*': [{
      '*': [1, 2]
    }, 3]
  }]);
  t.deepEquals(parse('1 * 2 + 3'), [{
    '+': [{
      '*': [1, 2]
    }, 3]
  }]);
  t.deepEquals(parse('1 + 2 * 3'), [{
    '+': [
      1, {
      '*': [2, 3]
    }]
  }]);
  t.deepEquals(parse('1 / 2 * 3 / 4 * 5'), [{
    '*': [{
      '/': [{
        '*': [{
          '/': [ 1, 2]
        }, 3]
      }, 4]
    }, 5]
  }]);
  t.deepEquals(parse('1 * 2 + 3 * 4'), [{
    '+': [{
      '*': [1, 2]
    }, {
      '*': [3, 4]
    }]
  }]);
  t.deepEquals(parse('1 % 2 + 3 / 4 + 5'), [{
    '+': [{
      '+': [{
        '%': [1, 2]
      }, {
        '/': [3, 4]
      }]
    }, 5]
  }]);
  t.deepEquals(parse('2x'), [{
    '*': [2, { var: 'x' }]
  }]);
  t.deepEquals(parse('2 x'), [{
    '*': [2, { var: 'x' }]
  }]);
  t.deepEquals(parse('2(x)'), [{
    '*': [2, { var: 'x' }]
  }]);
  t.deepEquals(parse('(2)(x)'), [{
    '*': [ 2, { var: 'x' }]
  }]);
  t.deepEquals(parse('(2)2'), [{
    '*': [2, 2]
  }]);
  t.deepEquals(parse('2 x y'), [{
    '*': [
      2, {
        '*': [
          { var: 'x' },
          { var: 'y' }
        ]
      }
    ]
  }]);
  // xor is a reserved words
  t.throws(function () { parse('2xor') });
  t.end();
});

test('parser:unary', function (t) {
  t.deepEquals(parse('1 + -2'), [{
    '+': [1, {
      '-': 2}]
  }]);
  t.deepEquals(parse('+-+2'), [{
    '+': {
      '-': {
        '+': 2
      }
    }
  }]);
  t.deepEquals(parse('-1 - -2'), [{
    '-': [{
      '-': 1
    }, {
      '-': 2
    }]
  }]);
  t.deepEquals(parse('-(3 - -2)'), [{
    '-': {
      '-': [
        3,
        {
          '-': 2
        }
      ]
    }
  }]);
  t.end();
});

test('parser:pow', function (t) {
  t.deepEquals(parse('2^3'), [{
    '^': [2, 3]
  }]);
  t.deepEquals(parse('2 ^ 3 ^ 4'), [{
    '^': [2, {
      '^': [3,4]
    }]
  }]);
  t.deepEquals(parse('1 ^ -2'), [{
    '^': [1, {
      '-': 2
    }]
  }]);
  t.end();
});

test('parser:factorial', function (t) {
  t.deepEquals(parse('2!'), [{
    '!': [2]
  }]);
  t.end();
});

test('parser:symbol', function (t) {
  t.deepEquals(parse('asd'), [{
    var: 'asd'
  }]);
  t.deepEquals(parse('$3'), [{
    var: '$3'
  }]);
  t.deepEquals(parse('_4$'), [{
    var: '_4$'
  }]);
  t.end()
});

test('parser:functionCall', function (t) {
  t.deepEquals(parse('f()'), [{
    'f': []
  }]);
  t.deepEquals(parse('f(x)'), [{
    'f': [
      { var: 'x' }
    ]
  }]);
  t.deepEquals(parse('f((x, y))'), [{
    'f': [
      { var: 'x' },
      { var: 'y' }
    ]
  }]);
  t.throws(function () {
    parse('f(x, y')
  });
  t.end()
});

test('parser:string', function (t) {
  t.deepEquals(parse('"asd"'), [{
    var: 'asd'
  }]);
  t.deepEquals(parse('\'asd\''), [{
    var: 'asd'
  }]);
  t.end()
});

test('parser:array', function (t) {
  t.deepEquals(parse('[]'), [[]]);
  t.deepEquals(parse('[2, 3]'), [[
      2,
      3
    ]]);
  t.throws(function () { parse('[') });
  t.throws(function () { parse('[2, 2[]') });
  t.throws(function () { parse(']') });
  t.end();
});

test('parser:parentheses', function (t) {
  t.deepEquals(parse('(32)'), [32]);
  t.deepEquals(parse('(1 + 2 - 3)'), [{
    '-': [{
      '+': [1, 2]
    }, 3]
  }]);
  t.deepEquals(parse('(1 + 2) - 3'), [{
    '-': [{
      '+': [1, 2]
    }, 3]
  }]);
  t.deepEquals(parse('1 * (2 + 3) * 4'), [{
    '*': [{
      '*': [ 1, {
        '+': [2, 3]
      }]
    }, 4]
  }]);
  t.throws(function () {
    parse('1 + (2 + 3')
  });
  t.throws(function () {
    parse('1 + 2 + 3)')
  });
  t.end();
});

test('parser:complex', function (t) {
  t.deepEquals(parse('sin(exp(x))'), [{
    'sin': [{
      'exp': [{
        var: 'x'
      }]
    }]
  }]);
  t.deepEquals(parse('tan(x)'), [{
    'tan': [{
      var: 'x'
    }]
  }]);
  t.deepEquals(parse('1/cos(PI)'), [{
    '/': [1, {
      'cos': [{
        var: 'PI'
      }]
    }]
  }]);
  t.deepEquals(parse('sin(exp(x)) + tan(x) - 1 / cos(PI) * (1 + 3)^2'), [{
    '-': [{
      '+': [{
        'sin': [{
          'exp': [{
            var: 'x'
          }]
        }]
      }, {
        'tan': [{
          var: 'x'
        }]
      }]
    }, {
      '*': [{
        '/': [1, {
          'cos': [{
            var: 'PI'
          }]
        }]
      }, {
        '^': [{
          '+': [1, 3]
        }, 2]
      }]
    }]
  }]);
  t.end();
});
