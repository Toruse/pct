export const TOK_LPAREN = 'TOK_LPAREN';       // (
export const TOK_RPAREN = 'TOK_RPAREN';       // )
export const TOK_LCURLY = 'TOK_LCURLY';       // {
export const TOK_RCURLY = 'TOK_RCURLY';       // }
export const TOK_LSQUAR = 'TOK_LSQUAR';       // [
export const TOK_RSQUAR = 'TOK_RSQUAR';       // ]
export const TOK_COMMA = 'TOK_COMMA';         // ,
export const TOK_DOT = 'TOK_DOT';             // .
export const TOK_PLUS = 'TOK_PLUS';           // +
export const TOK_MINUS = 'TOK_MINUS';         // -
export const TOK_STAR = 'TOK_STAR';           // *
export const TOK_SLASH = 'TOK_SLASH';         // /
export const TOK_CARET = 'TOK_CARET';         // ^
export const TOK_MOD = 'TOK_MOD';             // %
export const TOK_COLON = 'TOK_COLON';         // :
export const TOK_SEMICOLON = 'TOK_SEMICOLON'; // ;
export const TOK_QUESTION = 'TOK_QUESTION';   // ?
export const TOK_NOT = 'TOK_NOT';             // ~
export const TOK_GT = 'TOK_GT';               // >
export const TOK_LT = 'TOK_LT';               // <
export const TOK_EQ = 'TOK_EQ';               // =
export const TOK_GE = 'TOK_GE';               // >=
export const TOK_LE = 'TOK_LE';               // <=
export const TOK_NE = 'TOK_NE';               // ~=
export const TOK_EQEQ = 'TOK_EQEQ';           // ==
export const TOK_ASSIGN = 'TOK_ASSIGN';       // :=
export const TOK_GTGT = 'TOK_GTGT';           // >>
export const TOK_LTLT = 'TOK_LTLT';           // <<
export const TOK_IDENTIFIER = 'TOK_IDENTIFIER';
export const TOK_STRING = 'TOK_STRING';
export const TOK_INTEGER = 'TOK_INTEGER';
export const TOK_FLOAT = 'TOK_FLOAT';
export const TOK_IF = 'TOK_IF';
export const TOK_THEN = 'TOK_THEN';
export const TOK_ELSE = 'TOK_ELSE';
export const TOK_TRUE = 'TOK_TRUE';
export const TOK_FALSE = 'TOK_FALSE';
export const TOK_AND = 'TOK_AND';
export const TOK_OR = 'TOK_OR';
export const TOK_LOCAL = 'TOK_LOCAL';
export const TOK_WHILE = 'TOK_WHILE';
export const TOK_DO = 'TOK_DO';
export const TOK_FOR = 'TOK_FOR';
export const TOK_FUNC = 'TOK_FUNC';
export const TOK_NULL = 'TOK_NULL';
export const TOK_END = 'TOK_END';
export const TOK_PRINT = 'TOK_PRINT';
export const TOK_PRINTLN = 'TOK_PRINTLN';
export const TOK_RET = 'TOK_RET';

export const keywords: {[key: string]: string} = {
    'if': TOK_IF,
    'else': TOK_ELSE,
    'then': TOK_THEN,
    'true': TOK_TRUE,
    'false': TOK_FALSE,
    'and': TOK_AND,
    'or': TOK_OR,
    'local': TOK_LOCAL,
    'while': TOK_WHILE,
    'do': TOK_DO,
    'for': TOK_FOR,
    'func': TOK_FUNC,
    'null': TOK_NULL,
    'end': TOK_END,
    'print': TOK_PRINT,
    'println': TOK_PRINTLN,
    'ret': TOK_RET,
};

export default class Token {
    public tokenType: string;
    public lexeme: string
    public line: number

    constructor(tokenType: string, lexeme: string, line: number) {
        this.tokenType = tokenType;
        this.lexeme = lexeme;
        this.line = line;
    }

    toString() {
        return `(${this.tokenType}, '${this.lexeme}', ${this.line})`;
    }
}