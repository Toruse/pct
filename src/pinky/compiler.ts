import {
    Integer,
    Float,
    Bool,
    StringLiteral,
    BinOp,
    UnOp,
    LogicalOp,
    Grouping,
    PrintStmt,
    IfStmt,
    WhileStmt,
    Stmts,
    Assignment,
    LocalAssignment,
    Identifier,
    FuncDecl,
    FuncCall,
    RetStmt,
    FuncCallStmt,
    Param
} from "./model.ts";
import {
    TOK_PLUS,
    TOK_MINUS,
    TOK_STAR,
    TOK_SLASH,
    TOK_CARET,
    TOK_MOD,
    TOK_LT,
    TOK_GT,
    TOK_LE,
    TOK_GE,
    TOK_EQEQ,
    TOK_NE,
    TOK_AND,
    TOK_OR,
    TOK_NOT
} from './tokens';
import {
    TYPE_NUMBER,
    TYPE_STRING,
    TYPE_BOOL
} from "../defs.ts";
import {compileError, stringify} from "../utils.ts";

const SYM_VAR = 'SYM_VAR';
const SYM_FUNC = 'SYM_FUNC';

export type Instruction = [string, ...any[]];
type ASTNode = any;

export class CompilerSymbol {
    name: string;
    depth: number;
    symtype: string;
    arity: number;

    constructor(name: string, symtype = SYM_VAR, depth = 0, arity = 0) {
        this.name = name;
        this.depth = depth;
        this.symtype = symtype;
        this.arity = arity;
    }
}

export class Compiler {
    code: Instruction[] = [];
    locals: CompilerSymbol[] = [];
    globals: CompilerSymbol[] = [];
    functions: CompilerSymbol[] = [];
    scopeDepth = 0;
    labelCounter = 0;

    makeLabel(): string {
        this.labelCounter += 1;
        return `LBL${this.labelCounter}`;
    }

    emit(instruction: Instruction): void {
        this.code.push(instruction);
    }

    getFuncSymbol(name: string): CompilerSymbol | null {
        for (let i = this.functions.length - 1; i >= 0; i--) {
            const symbol = this.functions[i];
            if (symbol.name === name) return symbol;
        }
        return null;
    }

    getVarSymbol(name: string): [CompilerSymbol, number] | null {
        for (let i = this.locals.length - 1; i >= 0; i--) {
            const symbol = this.locals[i];
            if (symbol.name === name) return [symbol, i];
        }
        for (let i = this.globals.length - 1; i >= 0; i--) {
            const symbol = this.globals[i];
            if (symbol.name === name) return [symbol, i];
        }
        return null;
    }

    beginBlock(): void {
        this.scopeDepth += 1;
    }

    endBlock(): void {
        this.scopeDepth -= 1;
        // pop locals deeper than current depth
        let i = this.locals.length - 1;
        while (this.locals.length > 0 && this.locals[i].depth > this.scopeDepth) {
            this.emit(['POP']);
            this.locals.pop();
            i -= 1;
        }
        // remove functions declared in deeper scope
        i = this.functions.length - 1;
        while (this.functions.length > 0 && this.functions[i].depth > this.scopeDepth) {
            this.functions.pop();
            i -= 1;
        }
    }

    // Main compile entry (node is AST root or subnode)
    compile(node: ASTNode): void {
        if (node == null) return;

        // Integer
        if (node instanceof Integer) {
            const value: [string, number] = [TYPE_NUMBER, Number(node.value)];
            this.emit(['PUSH', value]);
            return;
        }

        // Float
        if (node instanceof Float) {
            const value: [string, number] = [TYPE_NUMBER, Number(node.value)];
            this.emit(['PUSH', value]);
            return;
        }

        // Bool
        if (node instanceof Bool) {
            const val = node.value === true;
            const value: [string, boolean] = [TYPE_BOOL, val];
            this.emit(['PUSH', value]);
            return;
        }

        // String
        if (node instanceof StringLiteral) {
            const value: [string, string] = [TYPE_STRING, stringify(node.value)];
            this.emit(['PUSH', value]);
            return;
        }

        // BinOp
        if (node instanceof BinOp) {
            this.compile(node.left);
            this.compile(node.right);
            // tolerate different token property namings
            const t = node.op.tokenType ?? node.op.tokenType ?? (node.op as any).token;
            if (t === TOK_PLUS) this.emit(['ADD']);
            else if (t === TOK_MINUS) this.emit(['SUB']);
            else if (t === TOK_STAR) this.emit(['MUL']);
            else if (t === TOK_SLASH) this.emit(['DIV']);
            else if (t === TOK_CARET) this.emit(['EXP']);
            else if (t === TOK_MOD) this.emit(['MOD']);
            else if (t === TOK_LT) this.emit(['LT']);
            else if (t === TOK_GT) this.emit(['GT']);
            else if (t === TOK_LE) this.emit(['LE']);
            else if (t === TOK_GE) this.emit(['GE']);
            else if (t === TOK_EQEQ) this.emit(['EQ']);
            else if (t === TOK_NE) this.emit(['NE']);
            return;
        }

        // UnOp
        if (node instanceof UnOp) {
            this.compile(node.operand);
            const t = node.op.tokenType ?? node.op.tokenType;
            if (t === TOK_MINUS) this.emit(['NEG']);
            else if (t === TOK_NOT) {
                this.emit(['PUSH', [TYPE_BOOL, true]]);
                this.emit(['XOR']);
            }
            return;
        }

        // LogicalOp
        if (node instanceof LogicalOp) {
            this.compile(node.left);
            this.compile(node.right);
            const t = node.op.tokenType ?? node.op.tokenType;
            if (t === TOK_AND) this.emit(['AND']);
            else if (t === TOK_OR) this.emit(['OR']);
            return;
        }

        // Grouping
        if (node instanceof Grouping) {
            this.compile(node.value);
            return;
        }

        // PrintStmt
        if (node instanceof PrintStmt) {
            this.compile(node.value);
            if (node.end === '') this.emit(['PRINT']);
            else this.emit(['PRINTLN']);
            return;
        }

        // IfStmt
        if (node instanceof IfStmt) {
            this.compile(node.test);
            const thenLabel = this.makeLabel();
            const elseLabel = this.makeLabel();
            const exitLabel = this.makeLabel();
            this.emit(['JMPZ', elseLabel]);
            this.emit(['LABEL', thenLabel]);
            this.beginBlock();
            this.compile(node.thenStatements);
            this.endBlock();
            this.emit(['JMP', exitLabel]);
            this.emit(['LABEL', elseLabel]);
            if (node.elseStatements) {
                this.beginBlock();
                this.compile(node.elseStatements);
                this.endBlock();
            }
            this.emit(['LABEL', exitLabel]);
            return;
        }

        // WhileStmt
        if (node instanceof WhileStmt) {
            const testLabel = this.makeLabel();
            const bodyLabel = this.makeLabel();
            const exitLabel = this.makeLabel();
            this.emit(['LABEL', testLabel]);
            this.compile(node.test);
            this.emit(['JMPZ', exitLabel]);
            this.emit(['LABEL', bodyLabel]);
            this.beginBlock();
            this.compile(node.bodyStatements);
            this.endBlock();
            this.emit(['JMP', testLabel]);
            this.emit(['LABEL', exitLabel]);
            return;
        }

        // Stmts
        if (node instanceof Stmts) {
            for (const stmt of node.statements) {
                this.compile(stmt);
            }
            return;
        }

        // Assignment
        if (node instanceof Assignment) {
            this.compile(node.right);
            const symbol = this.getVarSymbol((node.left as Identifier).name);
            if (!symbol) {
                const newSymbol = new CompilerSymbol((node.left as Identifier).name, SYM_VAR, this.scopeDepth);
                if (this.scopeDepth === 0) {
                    this.globals.push(newSymbol);
                    const newGlobalSlot = this.globals.length - 1;
                    this.emit(['STORE_GLOBAL', newGlobalSlot]);
                } else {
                    this.locals.push(newSymbol);
                    this.emit(['SET_SLOT', `${this.locals.length - 1} (${newSymbol.name})`]);
                }
            } else {
                const [sym, slot] = symbol;
                if (sym.depth === 0) this.emit(['STORE_GLOBAL', slot]);
                else this.emit(['STORE_LOCAL', slot]);
            }
            return;
        }

        // LocalAssignment
        if (node instanceof LocalAssignment) {
            this.compile(node.right);
            const newSymbol = new CompilerSymbol((node.left as Identifier).name, SYM_VAR, this.scopeDepth);
            this.locals.push(newSymbol);
            this.emit(['SET_SLOT', `${this.locals.length - 1} (${newSymbol.name})`]);
            return;
        }

        // Identifier (load)
        if (node instanceof Identifier) {
            const symbol = this.getVarSymbol(node.name);
            if (!symbol) {
                compileError(`Variable ${node.name} is not defined.`, node.line);
            } else {
                const [sym, slot] = symbol;
                if (sym.depth === 0) this.emit(['LOAD_GLOBAL', slot]);
                else this.emit(['LOAD_LOCAL', slot]);
            }
            return;
        }

        // FuncDecl
        if (node instanceof FuncDecl) {
            const varSym = this.getVarSymbol(node.name);
            const funcSym = this.getFuncSymbol(node.name);
            if (funcSym) compileError(`A function with the name ${node.name} was already declared.`, node.line);
            if (varSym) compileError(`A variable with the name ${node.name} was already defined in this scope.`, node.line);

            const newFunc = new CompilerSymbol(node.name, SYM_FUNC, this.scopeDepth, node.params.length);
            this.functions.push(newFunc);

            const endLabel = this.makeLabel();
            this.emit(['JMP', endLabel]);
            this.emit(['LABEL', newFunc.name]);

            this.beginBlock();
            // params as local variables
            for (const param of node.params as Param[]) {
                const newSymbol = new CompilerSymbol(param.name, SYM_VAR, this.scopeDepth);
                this.locals.push(newSymbol);
                this.emit(['SET_SLOT', `${this.locals.length - 1} (${newSymbol.name})`]);
            }
            this.compile(node.bodyStatements);
            this.endBlock();

            this.emit(['PUSH', [TYPE_NUMBER, 0]]);
            this.emit(['RTS']);
            this.emit(['LABEL', endLabel]);
            return;
        }

        // FuncCall
        if (node instanceof FuncCall) {
            const func = this.getFuncSymbol(node.name);
            if (!func) compileError(`Not found declaration for function ${node.name}`, node.line);
            if (func.arity !== node.args.length) {
                compileError(`Function expected ${func.arity} params but ${node.args.length} args were passed`, node.line);
            }
            // Evaluate args
            for (const arg of node.args) {
                this.compile(arg);
            }
            const numargs: [string, number] = [TYPE_NUMBER, node.args.length];
            this.emit(['PUSH', numargs]);
            this.emit(['JSR', node.name]);
            return;
        }

        // RetStmt
        if (node instanceof RetStmt) {
            this.compile(node.value);
            this.emit(['RTS']);
            return;
        }

        // FuncCallStmt
        if (node instanceof FuncCallStmt) {
            this.compile(node.expression);
            this.emit(['POP']); // discard return value
            return;
        }

        // fallback: unknown node
        compileError(`Unknown node type in compiler: ${node}`, node && node.line ? node.line : -1);
    }

    printCode(): void {
        let i = 0;
        for (const instruction of this.code) {
            const op = instruction[0];
            if (op === 'LABEL') {
                console.log(`${i.toString().padStart(8, ' ')} ${instruction[1]}:`);
                i += 1;
                continue;
            }
            if (op === 'PUSH') {
                const val = instruction[1][1];
                console.log(`${i.toString().padStart(8, ' ')}     ${op} ${stringify(val)}`);
                i += 1;
                continue;
            }
            if (instruction.length === 1) {
                console.log(`${i.toString().padStart(8, ' ')}     ${instruction[0]}`);
            } else if (instruction.length === 2) {
                console.log(`${i.toString().padStart(8, ' ')}     ${instruction[0]} ${instruction[1]}`);
            } else {
                console.log(`${i.toString().padStart(8, ' ')}     ${instruction.join(' ')}`);
            }
            i += 1;
        }
    }

    generateCode(node: ASTNode): Instruction[] {
        this.emit(['LABEL', 'START']);
        this.compile(node);
        this.emit(['HALT']);
        return this.code;
    }
}

export {
    SYM_VAR,
    SYM_FUNC
};