import Token, {
    keywords,
    TOK_ASSIGN,
    TOK_CARET,
    TOK_COMMA,
    TOK_DOT, TOK_EQEQ, TOK_FLOAT, TOK_GE, TOK_GT, TOK_IDENTIFIER, TOK_INTEGER,
    TOK_LCURLY, TOK_LE,
    TOK_LPAREN,
    TOK_LSQUAR, TOK_LT,
    TOK_MINUS, TOK_MOD, TOK_NE, TOK_NOT,
    TOK_PLUS, TOK_QUESTION,
    TOK_RCURLY,
    TOK_RPAREN, TOK_RSQUAR, TOK_SEMICOLON, TOK_SLASH,
    TOK_STAR, TOK_STRING
} from "./tokens.ts";
import {lexingError} from "../utils.ts";
import {TOK_AND, TOK_OR} from "../pinky/tokens.ts";

export default class Lexer {
    public tokens: Token[];
    public source: string;
    public start: number;
    public curr: number;
    public line: number;

    constructor(source: string) {
        this.source = source;
        this.start = 0;
        this.curr = 0;
        this.line = 1;
        this.tokens = [];
    }

    advance(): string {
        const ch: string = this.source[this.curr];
        this.curr++;
        return ch;
    }

    peek(): string {
        return this.curr >= this.source.length ? '\0' : this.source[this.curr];
    }

    lookahead(n: number = 1): string {
        return this.curr + n >= this.source.length ? '\0' : this.source[this.curr + n];
    }

    match(expected:string): boolean {
        if (this.curr >= this.source.length || this.source[this.curr] !== expected) {
            return false;
        }
        this.curr++;
        return true;
    }

    handleNumber():void {
        while (/\d/.test(this.peek())) {
            this.advance();
        }
        if (this.peek() === '.' && /\d/.test(this.lookahead())) {
            this.advance();
            while (/\d/.test(this.peek())) {
                this.advance();
            }
            this.addToken(TOK_FLOAT);
        } else {
            this.addToken(TOK_INTEGER);
        }
    }

    handleString(startQuote: string):void {
        while (this.peek() !== startQuote && this.curr < this.source.length) {
            this.advance();
        }
        if (this.curr >= this.source.length) {
            lexingError('Unterminated string.', this.line);
        }
        this.advance();
        this.addToken(TOK_STRING);
    }

    handleIdentifier(): void {
        while (/\w/.test(this.peek())) {
            this.advance();
        }
        const text: string = this.source.substring(this.start, this.curr);
        const tokenType: string = keywords[text] || TOK_IDENTIFIER;
        this.addToken(tokenType);
    }

    addToken(tokenType: string): void {
        const text: string = this.source.substring(this.start, this.curr);
        this.tokens.push(new Token(tokenType, text, this.line));
    }

    tokenize(): Token[] {
        while (this.curr < this.source.length) {
            this.start = this.curr;
            const ch: string = this.advance();
            switch (ch) {
                case '\n': this.line++; break;
                case ' ': case '\t': case '\r': break;
                case '(': this.addToken(TOK_LPAREN); break;
                case ')': this.addToken(TOK_RPAREN); break;
                case '{': this.addToken(TOK_LCURLY); break;
                case '}': this.addToken(TOK_RCURLY); break;
                case '[': this.addToken(TOK_LSQUAR); break;
                case ']': this.addToken(TOK_RSQUAR); break;
                case '.': this.addToken(TOK_DOT); break;
                case ',': this.addToken(TOK_COMMA); break;
                case '+': this.addToken(TOK_PLUS); break;
                case '*': this.addToken(TOK_STAR); break;
                case '^': this.addToken(TOK_CARET); break;
                case '/':
                    if (this.match('/')) {
                        while (this.peek() !== '\n' && this.curr < this.source.length) {
                            this.advance();
                        }
                    } else {
                        this.addToken(TOK_SLASH);
                    }
                    break;
                case ';': this.addToken(TOK_SEMICOLON); break;
                case '?': this.addToken(TOK_QUESTION); break;
                case '%': this.addToken(TOK_MOD); break;
                case '-': this.addToken(TOK_MINUS); break;
                case '=': this.addToken(this.match('=') ? TOK_EQEQ : TOK_ASSIGN); break;
                case '!': this.addToken(this.match('=') ? TOK_NE : TOK_NOT); break;
                case '<': this.addToken(this.match('=') ? TOK_LE : TOK_LT); break;
                case '>': this.addToken(this.match('=') ? TOK_GE : TOK_GT); break;
                case '|':
                    if (this.match('|')) {
                        this.addToken(TOK_OR);
                    }  else {
                        lexingError(`Error at '${ch}': Unexpected character.`, this.line);
                    }
                    break
                case '&':
                    if (this.match('&')) {
                        this.addToken(TOK_AND);
                    }  else {
                        lexingError(`Error at '${ch}': Unexpected character.`, this.line);
                    }
                    break
                case '"': case '\'':
                    this.handleString(ch);
                    break;
                default:
                    if (/\d/.test(ch)) {
                        this.handleNumber();
                    } else if (/\w/.test(ch)) {
                        this.handleIdentifier();
                    } else {
                        lexingError(`Error at '${ch}': Unexpected character.`, this.line);
                    }
            }
        }
        return this.tokens;
    }
}