// const { Lexer } = require('./lexer'); // Assume equivalent JS lexer module
// lexer.js
// Constants for different token types
const TOK_LPAREN = 'TOK_LPAREN';       // (
const TOK_RPAREN = 'TOK_RPAREN';       // )
const TOK_LCURLY = 'TOK_LCURLY';       // {
const TOK_RCURLY = 'TOK_RCURLY';       // }
const TOK_LSQUAR = 'TOK_LSQUAR';       // [
const TOK_RSQUAR = 'TOK_RSQUAR';       // ]
const TOK_COMMA = 'TOK_COMMA';         // ,
const TOK_DOT = 'TOK_DOT';             // .
const TOK_PLUS = 'TOK_PLUS';           // +
const TOK_MINUS = 'TOK_MINUS';         // -
const TOK_STAR = 'TOK_STAR';           // *
const TOK_SLASH = 'TOK_SLASH';         // /
const TOK_CARET = 'TOK_CARET';         // ^
const TOK_MOD = 'TOK_MOD';             // %
const TOK_COLON = 'TOK_COLON';         // :
const TOK_SEMICOLON = 'TOK_SEMICOLON'; // ;
const TOK_QUESTION = 'TOK_QUESTION';   // ?
const TOK_NOT = 'TOK_NOT';             // ~
const TOK_GT = 'TOK_GT';               // >
const TOK_LT = 'TOK_LT';               // <
const TOK_EQ = 'TOK_EQ';               // =
const TOK_GE = 'TOK_GE';               // >=
const TOK_LE = 'TOK_LE';               // <=
const TOK_NE = 'TOK_NE';               // ~=
const TOK_EQEQ = 'TOK_EQEQ';           // ==
const TOK_ASSIGN = 'TOK_ASSIGN';       // :=
const TOK_GTGT = 'TOK_GTGT';           // >>
const TOK_LTLT = 'TOK_LTLT';           // <<
const TOK_IDENTIFIER = 'TOK_IDENTIFIER';
const TOK_STRING = 'TOK_STRING';
const TOK_INTEGER = 'TOK_INTEGER';
const TOK_FLOAT = 'TOK_FLOAT';
const TOK_IF = 'TOK_IF';
const TOK_THEN = 'TOK_THEN';
const TOK_ELSE = 'TOK_ELSE';
const TOK_TRUE = 'TOK_TRUE';
const TOK_FALSE = 'TOK_FALSE';
const TOK_AND = 'TOK_AND';
const TOK_OR = 'TOK_OR';
const TOK_WHILE = 'TOK_WHILE';
const TOK_DO = 'TOK_DO';
const TOK_FOR = 'TOK_FOR';
const TOK_FUNC = 'TOK_FUNC';
const TOK_NULL = 'TOK_NULL';
const TOK_END = 'TOK_END';
const TOK_PRINT = 'TOK_PRINT';
const TOK_PRINTLN = 'TOK_PRINTLN';
const TOK_RET = 'TOK_RET';

// Dictionary mapping keywords and their token types
const keywords = {
    'if': TOK_IF,
    'else': TOK_ELSE,
    'then': TOK_THEN,
    'true': TOK_TRUE,
    'false': TOK_FALSE,
    'and': TOK_AND,
    'or': TOK_OR,
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

// Token class definition
class Token {
    constructor(tokenType, lexeme, line) {
        this.tokenType = tokenType;
        this.lexeme = lexeme;
        this.line = line;
    }

    toString() {
        return `(${this.tokenType}, '${this.lexeme}', ${this.line})`;
    }
}

class Lexer {
    constructor(source) {
        this.source = source;
        this.start = 0;
        this.curr = 0;
        this.line = 1;
        this.tokens = [];
    }

    advance() {
        const ch = this.source[this.curr];
        this.curr++;
        return ch;
    }

    peek() {
        return this.curr >= this.source.length ? '\0' : this.source[this.curr];
    }

    lookahead(n = 1) {
        return this.curr + n >= this.source.length ? '\0' : this.source[this.curr + n];
    }

    match(expected) {
        if (this.curr >= this.source.length || this.source[this.curr] !== expected) {
            return false;
        }
        this.curr++; // Consume the character if it matches
        return true;
    }

    handleNumber() {
        while (/\d/.test(this.peek())) {
            this.advance();
        }
        if (this.peek() === '.' && /\d/.test(this.lookahead())) {
            this.advance(); // Consume the '.'
            while (/\d/.test(this.peek())) {
                this.advance();
            }
            this.addToken(TOK_FLOAT);
        } else {
            this.addToken(TOK_INTEGER);
        }
    }

    handleString(startQuote) {
        while (this.peek() !== startQuote && this.curr < this.source.length) {
            this.advance();
        }
        if (this.curr >= this.source.length) {
            lexingError('Unterminated string.', this.line);
        }
        this.advance(); // Consume the closing quote
        this.addToken(TOK_STRING);
    }

    handleIdentifier() {
        while (/\w/.test(this.peek())) {
            this.advance();
        }
        const text = this.source.substring(this.start, this.curr);
        const tokenType = keywords[text] || TOK_IDENTIFIER;
        this.addToken(tokenType);
    }

    addToken(tokenType) {
        const text = this.source.substring(this.start, this.curr);
        this.tokens.push(new Token(tokenType, text, this.line));
    }

    tokenize() {
        while (this.curr < this.source.length) {
            this.start = this.curr;
            const ch = this.advance();
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
                case '/': this.addToken(TOK_SLASH); break;
                case ';': this.addToken(TOK_SEMICOLON); break;
                case '?': this.addToken(TOK_QUESTION); break;
                case '%': this.addToken(TOK_MOD); break;
                case '-':
                    if (this.match('-')) {
                        while (this.peek() !== '\n' && this.curr < this.source.length) {
                            this.advance();
                        }
                    } else {
                        this.addToken(TOK_MINUS);
                    }
                    break;
                case '=': this.addToken(this.match('=') ? TOK_EQEQ : TOK_EQ); break;
                case '~': this.addToken(this.match('=') ? TOK_NE : TOK_NOT); break;
                case '<': this.addToken(this.match('=') ? TOK_LE : TOK_LT); break;
                case '>': this.addToken(this.match('=') ? TOK_GE : TOK_GT); break;
                case ':': this.addToken(this.match('=') ? TOK_ASSIGN : TOK_COLON); break;
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



// const { Parser } = require('./parser'); // Assume equivalent JS parser module
class Node {
    // Represents the base class for all AST nodes
}

// Base Expression Class
class Expr extends Node {
    // Represents expressions that evaluate to a value
}

// Base Statement Class
class Stmt extends Node {
    // Represents statements that perform an action
}

// Base Declaration Class
class Decl extends Stmt {
    // Represents declarations, such as function declarations
}

// Integer Literal
class Integer extends Expr {
    constructor(value, line) {
        super();
        if (typeof value !== 'number' || !Number.isInteger(value)) {
            throw new Error(`Invalid Integer value: ${value}`);
        }
        this.value = value;
        this.line = line;
    }
    toString() {
        return `Integer[${this.value}]`;
    }
}

// Float Literal
class Float extends Expr {
    constructor(value, line) {
        super();
        if (typeof value !== 'number') {
            throw new Error(`Invalid Float value: ${value}`);
        }
        this.value = value;
        this.line = line;
    }
    toString() {
        return `Float[${this.value}]`;
    }
}

// Boolean Literal
class Bool extends Expr {
    constructor(value, line) {
        super();
        if (typeof value !== 'boolean') {
            throw new Error(`Invalid Bool value: ${value}`);
        }
        this.value = value;
        this.line = line;
    }
    toString() {
        return `Bool[${this.value}]`;
    }
}

// String Literal
class StringLiteral extends Expr {
    constructor(value, line) {
        super();
        if (typeof value !== 'string') {
            throw new Error(`Invalid String value: ${value}`);
        }
        this.value = value;
        this.line = line;
    }
    toString() {
        return `String[${this.value}]`;
    }
}

// Unary Operation
class UnOp extends Expr {
    constructor(op, operand, line) {
        super();
        if (!(op instanceof Token)) throw new Error(`Invalid operator: ${op}`);
        if (!(operand instanceof Expr)) throw new Error(`Invalid operand: ${operand}`);
        this.op = op;
        this.operand = operand;
        this.line = line;
    }
    toString() {
        return `UnOp(${this.op.lexeme}, ${this.operand})`;
    }
}

// Binary Operation
class BinOp extends Expr {
    constructor(op, left, right, line) {
        super();
        if (!(op instanceof Token)) throw new Error(`Invalid operator: ${op}`);
        if (!(left instanceof Expr)) throw new Error(`Invalid left operand: ${left}`);
        if (!(right instanceof Expr)) throw new Error(`Invalid right operand: ${right}`);
        this.op = op;
        this.left = left;
        this.right = right;
        this.line = line;
    }
    toString() {
        return `BinOp(${this.op.lexeme}, ${this.left}, ${this.right})`;
    }
}

// Logical Operation
class LogicalOp extends Expr {
    constructor(op, left, right, line) {
        super();
        if (!(op instanceof Token)) throw new Error(`Invalid operator: ${op}`);
        if (!(left instanceof Expr)) throw new Error(`Invalid left operand: ${left}`);
        if (!(right instanceof Expr)) throw new Error(`Invalid right operand: ${right}`);
        this.op = op;
        this.left = left;
        this.right = right;
        this.line = line;
    }
    toString() {
        return `LogicalOp(${this.op.lexeme}, ${this.left}, ${this.right})`;
    }
}

// Grouping
class Grouping extends Expr {
    constructor(value, line) {
        super();
        if (!(value instanceof Expr)) throw new Error(`Invalid value: ${value}`);
        this.value = value;
        this.line = line;
    }
    toString() {
        return `Grouping(${this.value})`;
    }
}

// Identifier
class Identifier extends Expr {
    constructor(name, line) {
        super();
        if (typeof name !== 'string') throw new Error(`Invalid Identifier name: ${name}`);
        this.name = name;
        this.line = line;
    }
    toString() {
        return `Identifier[${this.name}]`;
    }
}

// Statements List
class Stmts extends Node {
    constructor(statements, line) {
        super();
        if (!statements.every(stmt => stmt instanceof Stmt)) {
            throw new Error(`Invalid statements list: ${statements}`);
        }
        this.statements = statements;
        this.line = line;
    }
    toString() {
        return `Stmts(${this.statements})`;
    }
}

// Print Statement
class PrintStmt extends Stmt {
    constructor(value, end, line) {
        super();
        if (!(value instanceof Expr)) throw new Error(`Invalid Print value: ${value}`);
        this.value = value;
        this.end = end;
        this.line = line;
    }
    toString() {
        return `PrintStmt(${this.value}, end=${this.end})`;
    }
}

// If Statement
class IfStmt extends Stmt {
    constructor(test, thenStatements, elseStatements, line) {
        super();
        if (!(test instanceof Expr)) throw new Error(`Invalid test expression: ${test}`);
        if (!(thenStatements instanceof Stmts)) throw new Error(`Invalid thenStatements: ${thenStatements}`);
        if (elseStatements && !(elseStatements instanceof Stmts)) {
            throw new Error(`Invalid elseStatements: ${elseStatements}`);
        }
        this.test = test;
        this.thenStatements = thenStatements;
        this.elseStatements = elseStatements;
        this.line = line;
    }
    toString() {
        return `IfStmt(${this.test}, then: ${this.thenStatements}, else: ${this.elseStatements})`;
    }
}

// While Statement
class WhileStmt extends Stmt {
    constructor(test, bodyStatements, line) {
        super();
        if (!(test instanceof Expr)) throw new Error(`Invalid test expression: ${test}`);
        if (!(bodyStatements instanceof Stmts)) throw new Error(`Invalid bodyStatements: ${bodyStatements}`);
        this.test = test;
        this.bodyStatements = bodyStatements;
        this.line = line;
    }
    toString() {
        return `WhileStmt(${this.test}, ${this.bodyStatements})`;
    }
}

// Assignment Statement
class Assignment extends Stmt {
    constructor(left, right, line) {
        super()
        if (!(left instanceof Expr)) throw new Error(`Invalid left-hand expression: ${left}`);
        if (!(right instanceof Expr)) throw new Error(`Invalid right-hand expression: ${right}`);
        this.left = left;
        this.right = right;
        this.line = line;
    }
    toString() {
        return `Assignment(${this.left}, ${this.right})`;
    }
}

// For Statement
class ForStmt extends Stmt {
    constructor(identifier, start, end, step, bodyStatements, line) {
        super()
        if (!(identifier instanceof Identifier)) throw new Error(`Invalid identifier: ${identifier}`);
        if (!(start instanceof Expr)) throw new Error(`Invalid start expression: ${start}`);
        if (!(end instanceof Expr)) throw new Error(`Invalid end expression: ${end}`);
        if (step && !(step instanceof Expr)) throw new Error(`Invalid step expression: ${step}`);
        if (!(bodyStatements instanceof Stmts)) throw new Error(`Invalid bodyStatements: ${bodyStatements}`);
        this.identifier = identifier;
        this.start = start;
        this.end = end;
        this.step = step;
        this.bodyStatements = bodyStatements;
        this.line = line;
    }
    toString() {
        return `ForStmt(${this.identifier}, ${this.start}, ${this.end}, ${this.step}, ${this.bodyStatements})`;
    }
}

// Function Declaration
class FuncDecl extends Decl {
    constructor(name, params, bodyStatements, line) {
        super()
        if (typeof name !== 'string') throw new Error(`Invalid function name: ${name}`);
        if (!params.every(param => param instanceof Param)) {
            throw new Error(`Invalid parameters list: ${params}`);
        }
        this.name = name;
        this.params = params;
        this.bodyStatements = bodyStatements;
        this.line = line;
    }
    toString() {
        return `FuncDecl(${this.name}, ${this.params}, ${this.bodyStatements})`;
    }
}

// Function Parameter
class Param extends Decl {
    constructor(name, line) {
        super()
        if (typeof name !== 'string') throw new Error(`Invalid parameter name: ${name}`);
        this.name = name;
        this.line = line;
    }
    toString() {
        return `Param(${this.name})`;
    }
}

// Function Call Expression
class FuncCall extends Expr {
    constructor(name, args, line) {
        super()
        if (typeof name !== 'string') throw new Error(`Invalid function name: ${name}`);
        if (!args.every(arg => arg instanceof Expr)) {
            throw new Error(`Invalid arguments list: ${args}`);
        }
        this.name = name;
        this.args = args;
        this.line = line;
    }
    toString() {
        return `FuncCall(${this.name}, ${this.args})`;
    }
}

// Function Call Statement
class FuncCallStmt extends Stmt {
    constructor(expression) {
        super()
        if (!(expression instanceof FuncCall)) throw new Error(`Invalid FuncCall expression: ${expression}`);
        this.expression = expression;
    }
    toString() {
        return `FuncCallStmt(${this.expression})`;
    }
}

// Return Statement
class RetStmt extends Stmt {
    constructor(value, line) {
        super()
        if (!(value instanceof Expr)) throw new Error(`Invalid return value: ${value}`);
        this.value = value;
        this.line = line;
    }
    toString() {
        return `RetStmt(${this.value})`;
    }
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.curr = 0;
    }

    advance() {
        const token = this.tokens[this.curr];
        this.curr++;
        return token;
    }

    peek() {
        return this.tokens[this.curr];
    }

    isNext(expectedType) {
        return this.curr < this.tokens.length && this.peek().tokenType === expectedType;
    }

    expect(expectedType) {
        if (this.curr >= this.tokens.length) {
            parseError(`Unexpected end of input`, this.previousToken().line);
        } else if (this.peek().tokenType === expectedType) {
            return this.advance();
        } else {
            parseError(`Expected ${expectedType}, but found ${this.peek().lexeme}.`, this.peek().line);
        }
    }

    previousToken() {
        return this.tokens[this.curr - 1];
    }

    match(expectedType) {
        if (this.curr < this.tokens.length && this.peek().tokenType === expectedType) {
            this.curr++;
            return true;
        }
        return false;
    }

    primary() {
        if (this.match(TOK_INTEGER)) {
            return new Integer(parseInt(this.previousToken().lexeme), this.previousToken().line);
        } else if (this.match(TOK_FLOAT)) {
            return new Float(parseFloat(this.previousToken().lexeme), this.previousToken().line);
        } else if (this.match(TOK_TRUE)) {
            return new Bool(true, this.previousToken().line);
        } else if (this.match(TOK_FALSE)) {
            return new Bool(false, this.previousToken().line);
        } else if (this.match(TOK_STRING)) {
            return new StringLiteral(this.previousToken().lexeme.slice(1, -1), this.previousToken().line); // Remove quotes
        } else if (this.match(TOK_LPAREN)) {
            const expr = this.expr();
            this.expect(TOK_RPAREN);
            return new Grouping(expr, this.previousToken().line);
        } else {
            const identifier = this.expect(TOK_IDENTIFIER);
            if (this.match(TOK_LPAREN)) {
                const args = this.args();
                this.expect(TOK_RPAREN);
                return new FuncCall(identifier.lexeme, args, this.previousToken().line);
            }
            return new Identifier(identifier.lexeme, this.previousToken().line);
        }
    }

    unary() {
        if (this.match(TOK_NOT) || this.match(TOK_MINUS) || this.match(TOK_PLUS)) {
            const op = this.previousToken();
            const operand = this.unary();
            return new UnOp(op, operand, op.line);
        }
        return this.primary();
    }

    exponent() {
        let expr = this.unary();
        while (this.match(TOK_CARET)) {
            const op = this.previousToken();
            const right = this.exponent();
            expr = new BinOp(op, expr, right, op.line);
        }
        return expr;
    }

    modulo() {
        let expr = this.exponent();
        while (this.match(TOK_MOD)) {
            const op = this.previousToken();
            const right = this.exponent();
            expr = new BinOp(op, expr, right, op.line);
        }
        return expr;
    }

    multiplication() {
        let expr = this.modulo();
        while (this.match(TOK_STAR) || this.match(TOK_SLASH)) {
            const op = this.previousToken();
            const right = this.modulo();
            expr = new BinOp(op, expr, right, op.line);
        }
        return expr;
    }

    addition() {
        let expr = this.multiplication();
        while (this.match(TOK_PLUS) || this.match(TOK_MINUS)) {
            const op = this.previousToken();
            const right = this.multiplication();
            expr = new BinOp(op, expr, right, op.line);
        }
        return expr;
    }

    comparison() {
        let expr = this.addition();
        while (this.match(TOK_GT) || this.match(TOK_GE) || this.match(TOK_LT) || this.match(TOK_LE)) {
            const op = this.previousToken();
            const right = this.addition();
            expr = new BinOp(op, expr, right, op.line);
        }
        return expr;
    }

    equality() {
        let expr = this.comparison();
        while (this.match(TOK_NE) || this.match(TOK_EQEQ)) {
            const op = this.previousToken();
            const right = this.comparison();
            expr = new BinOp(op, expr, right, op.line);
        }
        return expr;
    }

    logicalAnd() {
        let expr = this.equality();
        while (this.match(TOK_AND)) {
            const op = this.previousToken();
            const right = this.equality();
            expr = new LogicalOp(op, expr, right, op.line);
        }
        return expr;
    }

    logicalOr() {
        let expr = this.logicalAnd();
        while (this.match(TOK_OR)) {
            const op = this.previousToken();
            const right = this.logicalAnd();
            expr = new LogicalOp(op, expr, right, op.line);
        }
        return expr;
    }

    expr() {
        return this.logicalOr();
    }

    // # <print_stmt>  ::=  ( "print" | "println" ) <expr>
    printStmt(end) {
        if (this.match(TOK_PRINT) || this.match(TOK_PRINTLN)) {
            const val = this.expr()
            return new PrintStmt(val, end, this.previousToken().line)
        }
        return null;
    }

    // # <if_stmt>  ::=  "if" <expr> "then" <stmts> ( "else" <stmts> )? "end"
    ifStmt() {
        this.expect(TOK_IF)
        const test = this.expr()
        this.expect(TOK_THEN)
        const thenStmts = this.stmts()
        let elseStmts = null;
        if (this.isNext(TOK_ELSE)) {
            this.advance() // consume the else
            elseStmts = this.stmts()
        }
        this.expect(TOK_END)
        return new IfStmt(test, thenStmts, elseStmts, this.previousToken().line)
    }

    // # <while_stmt>  ::=  "while" <expr> "do" <stmts> "end"
    whileStmt() {
        this.expect(TOK_WHILE)
        const test = this.expr()
        this.expect(TOK_DO)
        const bodyStmts = this.stmts()
        this.expect(TOK_END)
        return new WhileStmt(test, bodyStmts, this.previousToken().line)
    }

    // # <for_stmt>  ::=  "for" <identifier> ":=" <start> "," <end> ("," <step>)? "do" <body_stmts> "end"
    forStmt() {
        this.expect(TOK_FOR); // Expect the "for" keyword
        const identifier = this.primary(); // Parse the identifier (loop variable)
        this.expect(TOK_ASSIGN); // Expect the ":=" token
        const start = this.expr(); // Parse the start expression
        this.expect(TOK_COMMA); // Expect the first comma
        const end = this.expr(); // Parse the end expression

        let step = null; // Default step is null
        if (this.isNext(TOK_COMMA)) { // Check for optional step
            this.advance(); // Consume the comma
            step = this.expr(); // Parse the step expression
        }

        this.expect(TOK_DO); // Expect the "do" keyword
        const bodyStmts = this.stmts(); // Parse the body statements
        this.expect(TOK_END); // Expect the "end" keyword

        return new ForStmt(identifier, start, end, step, bodyStmts, this.previousToken().line); // Return a ForStmt node
    }

    // # <args> ::= <expr> ( ',' <expr> )*
    args() {
        let args = []
        while (!this.isNext(TOK_RPAREN)) {
            args.push(this.expr())
            if (!this.isNext(TOK_RPAREN)) {
                this.expect(TOK_COMMA)
            }
        }
        return args
    }

    // # <params>  ::=  <identifier> ("," <identifier> )*
    params() {
        const params = [];
        let numParams = 0;

        while (!this.isNext(TOK_RPAREN)) { // Check if the next token is not ')'
            const name = this.expect(TOK_IDENTIFIER); // Expect an identifier for the parameter name
            numParams++;

            if (numParams > 255) {
                parseError('Functions cannot have more than 255 parameters.', name.line); // Error for too many parameters
            }

            params.push(new Param(name.lexeme, this.previousToken().line)); // Add the parameter to the list

            if (!this.isNext(TOK_RPAREN)) { // If not followed by ')', expect a comma
                this.expect(TOK_COMMA);
            }
        }

        return params; // Return the list of parameters
    }

    // # <func_decl>  ::=  "func" <name> "(" <params>? ")" <body_stmts> "end"
    funcDecl() {
        this.expect(TOK_FUNC); // Expect the "func" token
        const name = this.expect(TOK_IDENTIFIER); // Expect the function name (identifier)
        this.expect(TOK_LPAREN); // Expect the opening parenthesis '('
        const params = this.params(); // Parse the function parameters
        this.expect(TOK_RPAREN); // Expect the closing parenthesis ')'
        const bodyStmts = this.stmts(); // Parse the function body statements
        this.expect(TOK_END); // Expect the "end" token
        return new FuncDecl(name.lexeme, params, bodyStmts, name.line); // Create and return a FuncDecl node
    }

    // # <ret_stmt>  ::=  "ret" <expr>
    retStmt() {
        this.expect(TOK_RET)
        const value = this.expr()
        return new RetStmt(value, this.previousToken().line)
    }

    stmt() {
        // Predictive parsing based on lookahead tokens
        const tokenType = this.peek().tokenType;
        if (tokenType === TOK_PRINT) return this.printStmt('');
        if (tokenType === TOK_PRINTLN) return this.printStmt('\n');
        if (tokenType === TOK_IF) return this.ifStmt();
        if (tokenType === TOK_WHILE) return this.whileStmt();
        if (tokenType === TOK_FOR) return this.forStmt();
        if (tokenType === TOK_FUNC) return this.funcDecl();
        if (tokenType === TOK_RET) return this.retStmt();
        const left = this.expr();
        if (this.match(TOK_ASSIGN)) {
            const right = this.expr();
            return new Assignment(left, right, this.previousToken().line);
        }
        return new FuncCallStmt(left);
    }

    stmts() {
        const stmts = [];
        while (this.curr < this.tokens.length && !this.isNext(TOK_ELSE) && !this.isNext(TOK_END)) {
            stmts.push(this.stmt());
        }
        return new Stmts(stmts, this.previousToken().line);
    }

    program() {
        return this.stmts();
    }

    parse() {
        return this.program();
    }
}



// const { Interpreter } = require('./interpreter'); // Assume equivalent JS interpreter module
class Environment {
    constructor(parent = null) {
        this.vars = {};    // A dictionary to store variable names and their values
        this.funcs = {};   // A dictionary to store the functions
        this.parent = parent; // Parent environment (optional)
    }

    getVar(name) {
        /**
         * Search the current environment and all parent environments for a variable name.
         * Returns `undefined` if the variable is not found.
         */
        let currentEnv = this;
        while (currentEnv) {
            if (name in currentEnv.vars) {
                return currentEnv.vars[name];
            }
            currentEnv = currentEnv.parent; // Look in parent environments
        }
        return undefined;
    }

    setVar(name, value) {
        /**
         * Store a value in the environment. If the variable already exists in the current
         * or parent environment, update it. Otherwise, create it in the current environment.
         */
        let currentEnv = this;
        while (currentEnv) {
            if (name in currentEnv.vars) {
                currentEnv.vars[name] = value;
                return value;
            }
            currentEnv = currentEnv.parent;
        }
        // If the variable does not exist in any parent environment, create it in the current one
        this.vars[name] = value;
        return value;
    }

    getFunc(name) {
        /**
         * Search the current environment and all parent environments for a function name.
         * Returns `undefined` if the function is not found.
         */
        let currentEnv = this;
        while (currentEnv) {
            if (name in currentEnv.funcs) {
                return currentEnv.funcs[name];
            }
            currentEnv = currentEnv.parent; // Look in parent environments
        }
        return undefined;
    }

    setFunc(name, value) {
        /**
         * Declares a function in the current environment.
         */
        this.funcs[name] = value;
    }

    newEnv() {
        /**
         * Create a new child environment. This is used to create nested scopes.
         */
        return new Environment(this);
    }
}

class Return extends Error {
    constructor(value) {
        super('Return statement');
        this.value = value; // Holds the return value
    }
}

// ###############################################################################
// # Constants for different runtime value types
// ###############################################################################
const TYPE_NUMBER = 'TYPE_NUMBER'  // # Default to 64-bit float
const TYPE_STRING = 'TYPE_STRING'  // # String managed by the host language
const TYPE_BOOL   = 'TYPE_BOOL'    // # true | false

class Interpreter {
    interpret(node, env) {
        if (node instanceof Integer) {
            return [TYPE_NUMBER, node.value];
        }

        if (node instanceof Float) {
            return [TYPE_NUMBER, node.value];
        }

        if (node instanceof StringLiteral) {
            return [TYPE_STRING, node.value];
        }

        if (node instanceof Bool) {
            return [TYPE_BOOL, node.value];
        }

        if (node instanceof Grouping) {
            return this.interpret(node.value, env);
        }

        if (node instanceof Identifier) {
            const value = env.getVar(node.name);
            if (!value) runtimeError(`Undeclared identifier '${node.name}'`, node.line);
            if (value[1] === null) runtimeError(`Uninitialized identifier '${node.name}'`, node.line);
            return value;
        }

        if (node instanceof Assignment) {
            const [type, value] = this.interpret(node.right, env);
            env.setVar(node.left.name, [type, value]);
        }

        if (node instanceof BinOp) {
            const [leftType, leftVal] = this.interpret(node.left, env);
            const [rightType, rightVal] = this.interpret(node.right, env);
            switch (node.op.tokenType) {
                case TOK_PLUS:
                    if (leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) {
                        return [TYPE_NUMBER, leftVal + rightVal];
                    } else if (leftType === TYPE_STRING || rightType === TYPE_STRING) {
                        return [TYPE_STRING, stringify(leftVal) + stringify(rightVal)];
                    }
                    break;
                case TOK_MINUS:
                    if (leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) {
                        return [TYPE_NUMBER, leftVal - rightVal];
                    }
                    break;
                case TOK_STAR:
                    if (leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) {
                        return [TYPE_NUMBER, leftVal * rightVal]
                    }
                    break
                case TOK_SLASH:
                    if (rightType === 0) {
                        runtimeError('Division by zero.', node.line)
                    }
                    if (leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) {
                        return [TYPE_NUMBER, leftVal / rightVal]
                    }
                    break
                case TOK_MOD:
                    if (leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) {
                        return [TYPE_NUMBER, leftVal % rightVal]
                    }
                    break
                case TOK_CARET:
                    if (leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) {
                        return [TYPE_NUMBER, leftVal ** rightVal]
                    }
                    break
                case TOK_GT:
                    if ((leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) || (leftType === TYPE_STRING && rightType === TYPE_STRING)) {
                        return [TYPE_BOOL, leftVal > rightVal]
                    }
                    break
                case TOK_GE:
                    if ((leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) || (leftType === TYPE_STRING && rightType === TYPE_STRING)) {
                        return [TYPE_BOOL, leftVal >= rightVal]
                    }
                    break
                case TOK_LT:
                    if ((leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) || (leftType === TYPE_STRING && rightType === TYPE_STRING)) {
                        return [TYPE_BOOL, leftVal < rightVal]
                    }
                    break
                case TOK_LE:
                    if ((leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) || (leftType === TYPE_STRING && rightType === TYPE_STRING)) {
                        return [TYPE_BOOL, leftVal <= rightVal]
                    }
                    break
                case TOK_EQEQ:
                    if ((leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) || (leftType === TYPE_STRING && rightType === TYPE_STRING) || (leftType === TYPE_BOOL && righttype === TYPE_BOOL)) {
                        return [TYPE_BOOL, leftVal === rightVal]
                    }
                    break
                case TOK_NE:
                    if ((leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) || (leftType === TYPE_STRING && rightType === TYPE_STRING) || (leftType === TYPE_BOOL && righttype === TYPE_BOOL)) {
                        return [TYPE_BOOL, leftVal !== rightVal]
                    }
                    break
                default:
                    runtimeError(`Unsupported operator '${node.op.lexeme}'`, node.line);
            }
        }

        if (node instanceof UnOp) {
            const [operandType, operandVal] = this.interpret(node.operand, env);
            switch (node.op.tokenType) {
                case 'TOK_MINUS':
                    if (operandType === TYPE_NUMBER) {
                        return [TYPE_NUMBER, -operandVal];
                    }
                    break;
                case 'TOK_PLUS':
                    if (operandType === TYPE_NUMBER) {
                        return [TYPE_NUMBER, operandVal];
                    }
                    break;
                case 'TOK_NOT':
                    if (operandType === TYPE_BOOL) {
                        return [TYPE_BOOL, !operandVal];
                    }
                    break;
                default:
                    runtimeError(`Unsupported operator '${node.op.lexeme}'`, node.line);
            }
        }

        if (node instanceof LogicalOp) {
            const [leftType, leftVal] = this.interpret(node.left, env);
            switch (node.op.tokenType) {
                case TOK_OR:
                    if (leftVal) {
                        return [leftType, leftVal]
                    }
                    break
                case TOK_AND:
                    if (!leftVal) {
                        return [leftType, leftVal]
                    }
                    break
            }
            return this.interpret(node.right, env)
        }

        if (node instanceof Stmts) {
            for (const stmt of node.statements) {
                this.interpret(stmt, env);
            }
        }

        if (node instanceof PrintStmt) {
            const [type, value] = this.interpret(node.value, env);
            console.log(stringify(value), node.end === '\n' ? '\n' : '');
        }

        if (node instanceof IfStmt) {
            const [testType, testVal] = this.interpret(node.test, env);
            if (testType !== TYPE_BOOL) {
                runtimeError('Condition test is not a boolean expression.', node.line);
            }
            if (testVal) {
                this.interpret(node.thenStatements, env.newEnv());
            } else if (node.elseStatements) {
                this.interpret(node.elseStatements, env.newEnv());
            }
        }

        if (node instanceof WhileStmt) {
            while (true) {
                const [testType, testVal] = this.interpret(node.test, env);
                if (testType !== TYPE_BOOL) runtimeError('While test is not a boolean expression.', node.line);
                if (!testVal) break;
                this.interpret(node.bodyStatements, env.newEnv());
            }
        }

        if (node instanceof ForStmt) {
            const varName = node.identifier.name; // The loop variable
            const [startType, startValue] = this.interpret(node.start, env); // Interpret the start value
            const [endType, endValue] = this.interpret(node.end, env); // Interpret the end value
            const blockNewEnv = env.newEnv(); // Create a new nested environment for the loop body

            let step;
            if (startValue < endValue) { // Incrementing loop
                step = node.step ? this.interpret(node.step, env)[1] : 1; // Default step is 1
                for (let i = startValue; i <= endValue; i += step) {
                    env.setVar(varName, [TYPE_NUMBER, i]); // Update the loop variable in the environment
                    this.interpret(node.bodyStatements, blockNewEnv); // Interpret the loop body with the new environment
                }
            } else { // Decrementing loop
                step = node.step ? this.interpret(node.step, env)[1] : -1; // Default step is -1
                for (let i = startValue; i >= endValue; i += step) {
                    env.setVar(varName, [TYPE_NUMBER, i]); // Update the loop variable in the environment
                    this.interpret(node.bodyStatements, blockNewEnv); // Interpret the loop body with the new environment
                }
            }
        }

        if (node instanceof FuncDecl) {
            env.setFunc(node.name, [node, env]);
        }

        if (node instanceof FuncCall) {
            const func = env.getFunc(node.name);
            if (!func) runtimeError(`Function '${node.name}' not declared.`, node.line);

            const [funcDecl, funcEnv] = func;

            if (node.args.length !== funcDecl.params.length) {
                runtimeError(
                    `Function '${funcDecl.name}' expected ${funcDecl.params.length} arguments but got ${node.args.length}.`,
                    node.line
                );
            }

            const newEnv = funcEnv.newEnv();
            funcDecl.params.forEach((param, index) => {
                newEnv.setVar(param.name, this.interpret(node.args[index], env));
            });

            try {
                this.interpret(funcDecl.bodyStatements, newEnv);
            } catch (e) {
                if (e instanceof Return) {
                    return e.value;
                }
                throw e;
            }
        }

        if (node instanceof FuncCallStmt) {
            this.interpret(node.expression, env);
        }

        if (node instanceof RetStmt) {
            throw new Return(this.interpret(node.value, env));
        }
    }

    interpretAst(node) {
        const globalEnv = new Environment();
        this.interpret(node, globalEnv);
    }
}

// const { Colors, printPrettyAst } = require('./utils'); // Equivalent JS utilities module
// utils.js
function printPrettyAst(astText) {
    let write = '';
    let i = 0;
    let newline = false;
    for (let ch of String(astText)) {
        if (ch === '(') {
            if (!newline) {
                //process.stdout.write('');
                write += ''
            }

            //console.log(ch);
            write += ch + '\n'
            i += 2;
            newline = true;
        } else if (ch === ')') {
            if (!newline) {
                //console.log();
                write += '\n'
            }

            i -= 2;
            newline = true;
            //console.log(' '.repeat(i) + ch);
            write += ' '.repeat(i) + ch + '\n'
        } else {
            if (newline) {
                //process.stdout.write(' '.repeat(i));
                write += ' '.repeat(i)
            }

            //process.stdout.write(ch);
            write += ch
            newline = false;
        }
    }
    console.log(write)
}

function stringify(val) {
    if (typeof val === 'boolean') {
        return val ? "true" : "false";
    }
    if (typeof val === 'number' && Number.isInteger(val)) {
        return val.toString();
    }
    return String(val);
}

function lexingError(message, lineno) {
    console.error(`${Colors.RED}[Line ${lineno}]: ${message} ${Colors.WHITE}`);
    process.exit(1);
}

function parseError(message, lineno) {
    console.error(`${Colors.RED}[Line ${lineno}]: ${message} ${Colors.WHITE}`);
    process.exit(1);
}

function runtimeError(message, lineno) {
    console.error(`${Colors.RED}[Line ${lineno}]: ${message} ${Colors.WHITE}`);
    process.exit(1);
}

class Colors {
    static WHITE = '\x1b[0m';
    static BLUE = '\x1b[94m';
    static CYAN = '\x1b[96m';
    static GREEN = '\x1b[92m';
    static YELLOW = '\x1b[93m';
    static RED = '\x1b[91m';
}

document.addEventListener('DOMContentLoaded', function() {
    const scripts = document.scripts
    for(let i = 0; i < scripts.length; i++){
        const script = scripts[i]
        if (script.type === 'text/pinky') {
            pinky(script.text)
        }
    }
});

function pinky(source) {
    try {
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        console.log(`${Colors.GREEN}SOURCE:${Colors.WHITE}`);
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        console.log(source);

        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        console.log(`${Colors.GREEN}TOKENS:${Colors.WHITE}`);
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        const lexer = new Lexer(source);
        const tokens = lexer.tokenize();
        tokens.forEach(tok => console.log(tok));

        console.log();
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        console.log(`${Colors.GREEN}AST:${Colors.WHITE}`);
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        const parser = new Parser(tokens);
        const ast = parser.parse();
        printPrettyAst(ast);

        console.log();
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        console.log(`${Colors.GREEN}INTERPRETER:${Colors.WHITE}`);
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        const interpreter = new Interpreter();
        interpreter.interpretAst(ast);

    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}