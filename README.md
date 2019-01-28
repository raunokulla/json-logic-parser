# json-logic-parser 


> Parses infix mathematical expressions and outputs an json rule object


- [Description](#description)
- [Usage](#usage)
- [API](#api)

## Description

`json-logic-parser` is a lightweight mathematical parser that creates JsonLogic rule objects out of mathematical expressions in infix notation

Based on [Mauricio Poppe]'s [mr-parser]


## Usage

```js
var Parser = require('json-logic-parser').Parser;
Parser.parse('1 - (2 + 3) * 4')

// returns
[
  {
    "-": [
      "1",
      {
        "*": [
          {
            "+": [
              "2",
              "3"
            ]
          },
          "4"
        ]
      }
    ]
  }
]
```

## API

### `Parser = require('json-logic-parser').Parser`

#### `Parser.parse(expression)`

**params**
* `expression` {string} the expression to be parsed

**returns**
* Returns a JsonLogic rule object.

[mr-parser]: https://github.com/mauriciopoppe/mr-parser
[Mauricio Poppe]: https://github.com/mauriciopoppe
[Rauno Kulla]: https://github.com/raunokulla

2018 MIT © [Rauno Kulla]()
