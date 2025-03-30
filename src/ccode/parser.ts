import Token, {
    TOK_AND, TOK_ASSIGN, TOK_CARET, TOK_COMMA,
    TOK_ELSE,
    TOK_EQEQ, TOK_FALSE, TOK_FLOAT, TOK_FOR, TOK_FUNC, TOK_GE, TOK_GT, TOK_IDENTIFIER,
    TOK_IF, TOK_INTEGER, TOK_LCURLY, TOK_LE, TOK_LPAREN, TOK_LT, TOK_MINUS, TOK_MOD, TOK_NE, TOK_NOT,
    TOK_OR, TOK_PLUS,
    TOK_PRINT,
    TOK_PRINTLN, TOK_RCURLY, TOK_RET, TOK_RPAREN, TOK_SEMICOLON, TOK_SLASH, TOK_STAR, TOK_STRING,
    TOK_TRUE,
    TOK_WHILE
} from "./tokens.ts";
import {
    Assignment,
    BinOp,
    Bool,
    Expr,
    Float, ForStmt, FuncCall, FuncCallStmt, FuncDecl, Grouping, Identifier,
    IfStmt,
    Integer,
    LogicalOp, Param,
    PrintStmt, RetStmt,
    Stmt,
    Stmts,
    StringLiteral,
    UnOp,
    WhileStmt
} from "./model.ts"
import {parseError} from "../utils.ts";

export default class Parser {
    public tokens: Token[];
    public curr: number;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.curr = 0;
    }

    advance(): Token {
        const token = this.tokens[this.curr];
        this.curr++;
        return token;
    }

    peek(): Token {
        return this.tokens[this.curr];
    }

    isNext(expectedType: string): boolean {
        return this.curr < this.tokens.length && this.peek().tokenType === expectedType;
    }

    expect(expectedType: string): Token | undefined {
        if (this.curr >= this.tokens.length) {
            parseError(`Unexpected end of input`, this.previousToken().line);
        } else if (this.peek().tokenType === expectedType) {
            return this.advance();
        } else {
            parseError(`Expected ${expectedType}, but found ${this.peek().lexeme}.`, this.peek().line);
        }
    }

    previousToken(): Token {
        return this.tokens[this.curr - 1];
    }

    match(expectedType: string): boolean {
        if (this.curr < this.tokens.length && this.peek().tokenType === expectedType) {
            this.curr++;
            return true;
        }
        return false;
    }

    primary(): Expr | null {
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
            const expr: Expr | null = this.expr();
            this.expect(TOK_RPAREN);
            if (expr) return new Grouping(expr, this.previousToken().line);
            return null
        } else {
            const identifier: Token | undefined = this.expect(TOK_IDENTIFIER);
            if (typeof identifier !== "undefined") {
                if (this.match(TOK_LPAREN)) {
                    const args = this.args();
                    this.expect(TOK_RPAREN);
                    return new FuncCall(identifier.lexeme, args, this.previousToken().line);
                }
                return new Identifier(identifier.lexeme, this.previousToken().line);
            }
            return null
        }
    }

    unary(): Expr | null {
        if (this.match(TOK_NOT) || this.match(TOK_MINUS) || this.match(TOK_PLUS)) {
            const op: Token = this.previousToken();
            const operand: Expr | null = this.unary();
            if (operand) {
                return new UnOp(op, operand, op.line);
            } else {
                return null
            }
        }
        return this.primary();
    }

    exponent(): Expr | null {
        let expr: Expr | null = this.unary();
        while (this.match(TOK_CARET)) {
            const op: Token = this.previousToken();
            const right: Expr | null = this.exponent();
            if (expr && right) {
                expr = new BinOp(op, expr, right, op.line);
            }
        }
        return expr;
    }

    modulo(): Expr | null {
        let expr: Expr | null = this.exponent();
        while (this.match(TOK_MOD)) {
            const op: Token = this.previousToken();
            const right: Expr | null = this.exponent();
            if (expr && right) {
                expr = new BinOp(op, expr, right, op.line);
            }
        }
        return expr;
    }

    multiplication(): Expr | null {
        let expr: Expr | null = this.modulo();
        while (this.match(TOK_STAR) || this.match(TOK_SLASH)) {
            const op: Token = this.previousToken();
            const right: Expr | null = this.modulo();
            if (expr && right) {
                expr = new BinOp(op, expr, right, op.line);
            }
        }
        return expr;
    }

    addition(): Expr | null {
        let expr: Expr | null = this.multiplication();
        while (this.match(TOK_PLUS) || this.match(TOK_MINUS)) {
            const op: Token = this.previousToken();
            const right: Expr | null = this.multiplication();
            if (expr && right) {
                expr = new BinOp(op, expr, right, op.line);
            }
        }
        return expr;
    }

    comparison(): Expr | null {
        let expr: Expr | null = this.addition();
        while (this.match(TOK_GT) || this.match(TOK_GE) || this.match(TOK_LT) || this.match(TOK_LE)) {
            const op: Token = this.previousToken();
            const right: Expr | null = this.addition();
            if (expr && right) {
                expr = new BinOp(op, expr, right, op.line);
            }
        }
        return expr;
    }

    equality(): Expr | null {
        let expr: Expr | null = this.comparison();
        while (this.match(TOK_NE) || this.match(TOK_EQEQ)) {
            const op: Token = this.previousToken();
            const right: Expr | null = this.comparison();
            if (expr && right) {
                expr = new BinOp(op, expr, right, op.line);
            }
        }
        return expr;
    }

    logicalAnd(): Expr | null {
        let expr: Expr | null = this.equality();
        while (this.match(TOK_AND)) {
            const op: Token = this.previousToken();
            const right: Expr | null = this.equality();
            if (expr && right) {
                expr = new LogicalOp(op, expr, right, op.line);
            }
        }
        return expr;
    }

    logicalOr(): Expr | null {
        let expr: Expr | null = this.logicalAnd();
        while (this.match(TOK_OR)) {
            const op: Token = this.previousToken();
            const right: Expr | null = this.logicalAnd();
            if (expr && right) {
                expr = new LogicalOp(op, expr, right, op.line);
            }
        }
        return expr;
    }

    expr(): Expr | null {
        return this.logicalOr();
    }

    printStmt(end: string): Stmt | null {
        if (this.match(TOK_PRINT) || this.match(TOK_PRINTLN)) {
            const val: Expr | null = this.expr()
            if (val) {
                return new PrintStmt(val, end, this.previousToken().line)
            } else {
                return null;
            }
        }
        return null;
    }

    ifStmt(): Stmt | null {
        this.expect(TOK_IF)
        this.expect(TOK_LPAREN)
        const test: Expr | null = this.expr()
        this.expect(TOK_RPAREN)
        this.expect(TOK_LCURLY)
        const thenStmts: Stmts = this.stmts()
        this.expect(TOK_RCURLY)
        let elseStmts: Stmts | null = null;
        if (this.isNext(TOK_ELSE)) {
            this.advance()
            this.expect(TOK_LCURLY)
            elseStmts = this.stmts()
            this.expect(TOK_RCURLY)
        }
        if (test) {
            return new IfStmt(test, thenStmts, elseStmts, this.previousToken().line)
        }
        return null
    }

    whileStmt(): Stmt | null {
        this.expect(TOK_WHILE)
        this.expect(TOK_LPAREN)
        const test: Expr | null = this.expr()
        this.expect(TOK_RPAREN)
        this.expect(TOK_LCURLY)
        const bodyStmts: Stmts = this.stmts()
        this.expect(TOK_RCURLY)
        if (test) {
            return new WhileStmt(test, bodyStmts, this.previousToken().line)
        }
        return null
    }

    forStmt(): Stmt | null {
        this.expect(TOK_FOR)
        this.expect(TOK_LPAREN)
        const identifier: Expr | null = this.primary()
        this.expect(TOK_ASSIGN)
        const start: Expr | null = this.expr()
        this.expect(TOK_SEMICOLON)
        const end: Expr | null = this.expr()

        let step: Expr | null = null
        if (this.isNext(TOK_SEMICOLON)) {
            this.advance()
            step = this.expr()
        }

        this.expect(TOK_RPAREN)
        this.expect(TOK_LCURLY)
        const bodyStmts: Stmts = this.stmts()
        this.expect(TOK_RCURLY)

        if (identifier && start && end) {
            return new ForStmt(identifier, start, end, step, bodyStmts, this.previousToken().line)
        }

        return null
    }

    args(): Expr[] {
        let args: Expr[] = []
        while (!this.isNext(TOK_RPAREN)) {
            let expr: Expr | null = this.expr()
            if (!expr) continue
            args.push(expr)
            if (!this.isNext(TOK_RPAREN)) {
                this.expect(TOK_COMMA)
            }
        }
        return args
    }

    params(): Stmt[] {
        const params: Stmt[] = []
        let numParams: number = 0;

        while (!this.isNext(TOK_RPAREN)) {
            const name: Token | undefined = this.expect(TOK_IDENTIFIER)
            if (typeof name === "undefined") continue;
            numParams++

            if (numParams > 255) {
                parseError('Functions cannot have more than 255 parameters.', name ? name.line : 0);
            }

            params.push(new Param(name.lexeme, this.previousToken().line));

            if (!this.isNext(TOK_RPAREN)) {
                this.expect(TOK_COMMA);
            }
        }

        return params;
    }

    funcDecl(): Stmt | null {
        this.expect(TOK_FUNC)
        const name: Token | undefined = this.expect(TOK_IDENTIFIER)
        if (typeof name === "undefined") return null
        this.expect(TOK_LPAREN)
        const params = this.params()
        this.expect(TOK_RPAREN)
        this.expect(TOK_LCURLY)
        const bodyStmts = this.stmts()
        this.expect(TOK_RCURLY)
        return new FuncDecl(name.lexeme, params, bodyStmts, name.line)
    }

    retStmt(): Stmt | null {
        this.expect(TOK_RET)
        const value: Expr | null = this.expr()
        if (value) return new RetStmt(value, this.previousToken().line)
        return null
    }

    stmt(): Stmt | null {
        const tokenType = this.peek().tokenType;
        if (tokenType === TOK_PRINT) return this.printStmt('');
        if (tokenType === TOK_PRINTLN) return this.printStmt('\n');
        if (tokenType === TOK_IF) return this.ifStmt();
        if (tokenType === TOK_WHILE) return this.whileStmt();
        if (tokenType === TOK_FOR) return this.forStmt();
        if (tokenType === TOK_FUNC) return this.funcDecl();
        if (tokenType === TOK_RET) return this.retStmt();
        const left: Expr | null = this.expr();
        if (!left) return null
        if (this.match(TOK_ASSIGN)) {
            const right: Expr | null = this.expr();
            if (!right) return null
            return new Assignment(left, right, this.previousToken().line);
        }
        return new FuncCallStmt(left);
    }

    stmts(): Stmts {
        const stmts = []
        while (this.curr < this.tokens.length && !this.isNext(TOK_ELSE) && !this.isNext(TOK_RCURLY)) {
            let stmt: Stmt | null = this.stmt()
            if (!stmt) continue
            stmts.push(stmt)
        }
        return new Stmts(stmts, this.previousToken().line)
    }

    program(): Stmts {
        return this.stmts();
    }

    parse(): Stmts {
        return this.program();
    }
}