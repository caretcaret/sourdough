let TokenType = {
  OPERATOR: 'OPERATOR',
  IDENT: 'IDENT',
  DOT: 'DOT',
  SEMICOLON: 'SEMICOLON',
  LEFT_BRACE: 'LEFT_BRACE',
  RIGHT_BRACE: 'RIGHT_BRACE',
  LEFT_PAREN: 'LEFT_PAREN',
  RIGHT_PAREN: 'RIGHT_PAREN',
  WHITESPACE: 'WHITESPACE',
};

let Operator = {};

// constructor for tokens
function Token(position, type, source, data={}) {
  return {
    position: position,
    type: type,
    source: source,
    data: data,
  };
}

// Matchers take in a position and text and output a token if it matches, or null otherwise.
// creates a matcher that is based on regex pattern matches.
function regex_pattern(pattern, type, extract_data=()=>{}) {
  let regex = new RegExp('^' + pattern);
  return (position, text) => {
    let result = regex.exec(text);
    if (result === null) {
      return null;
    }
    return Token(position, type, result[0], extract_data(result));
  };
}

let ident_extractor = (result) => { return {name: result[0]}; };

// try matchers in sequence.
function matcher_or(...matchers) {
  return (position, text) => {
    for (let matcher of matchers) {
      let token = matcher(position, text);
      if (token !== null) {
        return token;
      }
    }
    return null;
  };
}

let ABT_GRAMMAR = matcher_or(
  regex_pattern('\\.', TokenType.DOT),
  regex_pattern(';', TokenType.SEMICOLON),
  regex_pattern('{', TokenType.LEFT_BRACE),
  regex_pattern('}', TokenType.RIGHT_BRACE),
  regex_pattern('\\\(', TokenType.LEFT_PAREN),
  regex_pattern('\\\)', TokenType.RIGHT_PAREN),
  regex_pattern('\\s+', TokenType.WHITESPACE),
  regex_pattern('[^.;{}()\\s]+', TokenType.IDENT, ident_extractor)
);

// the lexer applies a matcher multiple times until the input string is exhausted.
// takes in a lexical grammar, which is a matcher, and the text to lex.
function generic_lexer(grammar, text) {
  let tokens = [];
  let position = 0;
  while (position < text.length) {
    let token = grammar(position, text.substr(position));

    if (token === null) {
      // unable to be lexed; grammar is not exhaustive
      return null;
    }

    tokens.push(token);
    position += token.source.length;
  }

  return tokens;
}

export function lexer(text) {
  let tokens = generic_lexer(ABT_GRAMMAR, text);
  if (tokens === null) {
    return null;
  }

  // filter out whitespace because they're irrelevant
  return tokens.filter((token) => token.type !== TokenType.WHITESPACE);

}

export function parser(tokens) {

}
