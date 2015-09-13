import { parser, lexer, ABT_GRAMMAR } from './parse';

export default () => new Promise((resolve, reject) => {
  console.log(lexer("let{s(s(z))}(s(z); x. plus(x; x))"));
  resolve();
});