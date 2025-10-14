import Token from "./tokens.ts";

class Node {
}

export class Expr extends Node {
}

export class Stmt extends Node {
}

class Decl extends Stmt {
}

export class Integer extends Expr {
    public value: number
    public line: number

    constructor(value: number, line: number) {
        super();
        if (!Number.isInteger(value)) {
            throw new Error(`Invalid Integer value: ${value}`)
        }
        this.value = value
        this.line = line
    }
    toString(): string {
        return `Integer[${this.value}]`
    }
}

export class Float extends Expr {
    public value: number
    public line: number

    constructor(value: number, line: number) {
        super();
        this.value = value;
        this.line = line;
    }
    toString(): string {
        return `Float[${this.value}]`;
    }
}

export class Bool extends Expr {
    public value: boolean
    public line: number

    constructor(value: boolean, line: number) {
        super();
        this.value = value;
        this.line = line;
    }
    toString(): string {
        return `Bool[${this.value}]`;
    }
}

export class StringLiteral extends Expr {
    public value: string
    public line: number

    constructor(value: string, line: number) {
        super();
        this.value = value;
        this.line = line;
    }
    toString(): string {
        return `String[${this.value}]`;
    }
}

export class UnOp extends Expr {
    public op: Token
    public operand: Expr
    public line: number

    constructor(op:Token, operand: Expr, line: number) {
        super();
        this.op = op;
        this.operand = operand;
        this.line = line;
    }
    toString(): string {
        return `UnOp(${this.op.lexeme}, ${this.operand})`;
    }
}

export class BinOp extends Expr {
    public op: Token
    public left: Expr
    public right: Expr
    public line: number

    constructor(op: Token, left: Expr, right: Expr, line: number) {
        super()
        this.op = op
        this.left = left
        this.right = right
        this.line = line
    }

    toString(): string {
        return `BinOp(${this.op.lexeme}, ${this.left}, ${this.right})`
    }
}

export class LogicalOp extends Expr {
    public op: Token
    public left: Expr
    public right: Expr
    public line: number

    constructor(op: Token, left: Expr, right: Expr, line: number) {
        super();
        this.op = op;
        this.left = left;
        this.right = right;
        this.line = line;
    }

    toString() {
        return `LogicalOp(${this.op.lexeme}, ${this.left}, ${this.right})`;
    }
}

export class Grouping extends Expr {
    public value: Expr
    public line: number

    constructor(value: Expr, line: number) {
        super();
        this.value = value;
        this.line = line;
    }
    toString() {
        return `Grouping(${this.value})`;
    }
}

export class Identifier extends Expr {
    public name: string
    public line: number

    constructor(name: string, line: number) {
        super();
        this.name = name;
        this.line = line;
    }
    toString(): string {
        return `Identifier[${this.name}]`;
    }
}

export class Stmts extends Node {
    public statements: Array<Stmt>
    public line: number

    constructor(statements: Array<Stmt>, line: number) {
        super();
        this.statements = statements;
        this.line = line;
    }

    toString() {
        return `Stmts(${this.statements})`;
    }
}

export class PrintStmt extends Stmt {
    public value: Expr
    public end: string
    public line: number

    constructor(value: Expr, end: string , line: number) {
        super()
        this.value = value
        this.end = end
        this.line = line
    }

    toString(): string {
        return `PrintStmt(${this.value}, end=${this.end})`;
    }
}

export class IfStmt extends Stmt {
    test: Expr
    thenStatements: Stmts;
    elseStatements: null | Stmts;
    line: number

    constructor(test: Expr, thenStatements: Stmts, elseStatements: Stmts | null, line: number) {
        super();
        this.test = test;
        this.thenStatements = thenStatements;
        this.elseStatements = elseStatements;
        this.line = line;
    }
    toString(): string {
        return `IfStmt(${this.test}, then: ${this.thenStatements}, else: ${this.elseStatements})`;
    }
}

export class WhileStmt extends Stmt {
    public test: Expr
    public bodyStatements: Stmts;
    public line: number

    constructor(test: Expr, bodyStatements: Stmts, line: number) {
        super();
        this.test = test;
        this.bodyStatements = bodyStatements;
        this.line = line;
    }
    toString(): string {
        return `WhileStmt(${this.test}, ${this.bodyStatements})`;
    }
}

export class Assignment extends Stmt {
    public left: Expr
    public right: Expr;
    public line: number

    constructor(left: Expr, right: Expr, line: number) {
        super()
        this.left = left;
        this.right = right;
        this.line = line;
    }

    toString(): string {
        return `Assignment(${this.left}, ${this.right})`;
    }
}

export class LocalAssignment extends Stmt {
    public left: Expr;
    public right: Expr;
    public line: number;

    constructor(left: Expr, right: Expr, line: number) {
        super();
        this.left = left;
        this.right = right;
        this.line = line;
    }

    toString(): string {
        return `LocalAssignment(${this.left}, ${this.right})`;
    }
}

export class ForStmt extends Stmt {
    public identifier: Expr
    public start: Expr
    public end: Expr
    public step: Expr | null
    public bodyStatements: Stmts
    public line: number

    constructor(identifier: Expr, start: Expr, end: Expr, step: Expr | null, bodyStatements: Stmts, line: number) {
        super()
        this.identifier = identifier;
        this.start = start;
        this.end = end;
        this.step = step;
        this.bodyStatements = bodyStatements;
        this.line = line;
    }
    toString(): string {
        return `ForStmt(${this.identifier}, ${this.start}, ${this.end}, ${this.step}, ${this.bodyStatements})`;
    }
}

export class FuncDecl extends Decl {
    public name: string
    public params: Expr[]
    public bodyStatements: Stmts
    public line: number

    constructor(name: string, params:Expr[], bodyStatements: Stmts, line: number) {
        super()
        this.name = name;
        this.params = params;
        this.bodyStatements = bodyStatements;
        this.line = line;
    }
    toString(): string {
        return `FuncDecl(${this.name}, ${this.params}, ${this.bodyStatements})`;
    }
}

export class Param extends Decl {
    public name: string
    public line: number

    constructor(name: string, line: number) {
        super()
        this.name = name;
        this.line = line;
    }
    toString(): string {
        return `Param(${this.name})`;
    }
}

export class FuncCall extends Expr {
    public name: string
    public args: Array<Expr>
    public line: number

    constructor(name: string, args: Array<Expr>, line: number) {
        super()
        this.name = name;
        this.args = args;
        this.line = line;
    }
    toString(): string {
        return `FuncCall(${this.name}, ${this.args})`;
    }
}

export class FuncCallStmt extends Stmt {
    public expression: Expr

    constructor(expression: Expr) {
        super()
        this.expression = expression;
    }
    toString(): string {
        return `FuncCallStmt(${this.expression})`;
    }
}

export class RetStmt extends Stmt {
    public value: Expr
    public line: number

    constructor(value: Expr, line: number) {
        super()
        this.value = value;
        this.line = line;
    }
    toString(): string {
        return `RetStmt(${this.value})`;
    }
}