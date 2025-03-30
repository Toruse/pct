import {
    Assignment,
    BinOp,
    Bool,
    Expr,
    Float, ForStmt, FuncCall,
    FuncCallStmt, FuncDecl,
    Grouping,
    Identifier, IfStmt,
    Integer, LogicalOp, PrintStmt,
    RetStmt, Stmts,
    StringLiteral, UnOp, WhileStmt
} from "./model.ts";
import {runtimeError, stringify} from "../utils.ts";
import Environment, {Return} from "./state.ts";
import {
    TOK_AND,
    TOK_CARET, TOK_EQEQ,
    TOK_GE,
    TOK_GT,
    TOK_LE,
    TOK_LT,
    TOK_MINUS,
    TOK_MOD, TOK_NE, TOK_OR,
    TOK_PLUS,
    TOK_SLASH,
    TOK_STAR
} from "./tokens.ts";

const TYPE_NUMBER = 'TYPE_NUMBER'
const TYPE_STRING = 'TYPE_STRING'
const TYPE_BOOL   = 'TYPE_BOOL'

export default class Interpreter {
    interpret(node: Expr, env: Environment): any {
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
            env.setVar((node.left as Identifier).name, [type, value]);
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
                        return [TYPE_NUMBER, leftVal - rightVal]
                    }
                    break
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
                    if ((leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) || (leftType === TYPE_STRING && rightType === TYPE_STRING) || (leftType === TYPE_BOOL && rightType === TYPE_BOOL)) {
                        return [TYPE_BOOL, leftVal === rightVal]
                    }
                    break
                case TOK_NE:
                    if ((leftType === TYPE_NUMBER && rightType === TYPE_NUMBER) || (leftType === TYPE_STRING && rightType === TYPE_STRING) || (leftType === TYPE_BOOL && rightType === TYPE_BOOL)) {
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
            const [, value] = this.interpret(node.value, env);
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
            const varName: string = (node.identifier as Identifier).name
            const [, startValue] = this.interpret(node.start, env)
            const [, endValue] = this.interpret(node.end, env)
            const blockNewEnv = env.newEnv()

            let step;
            if (startValue < endValue) {
                step = node.step ? this.interpret(node.step, env)[1] : 1
                for (let i = startValue; i <= endValue; i += step) {
                    env.setVar(varName, [TYPE_NUMBER, i])
                    this.interpret(node.bodyStatements, blockNewEnv)
                }
            } else {
                step = node.step ? this.interpret(node.step, env)[1] : -1
                for (let i = startValue; i >= endValue; i += step) {
                    env.setVar(varName, [TYPE_NUMBER, i])
                    this.interpret(node.bodyStatements, blockNewEnv)
                }
            }
        }

        if (node instanceof FuncDecl) {
            env.setFunc(node.name, [node, env])
        }

        if (node instanceof FuncCall) {
            const func: any = env.getFunc(node.name)
            if (!func) runtimeError(`Function '${node.name}' not declared.`, node.line)

            const [funcDecl, funcEnv] = func

            if (node.args.length !== funcDecl.params.length) {
                runtimeError(
                    `Function '${funcDecl.name}' expected ${funcDecl.params.length} arguments but got ${node.args.length}.`,
                    node.line
                );
            }

            const newEnv: Environment = funcEnv.newEnv()
            funcDecl.params.forEach((param: any, index: number) => {
                newEnv.setVar(param.name, this.interpret(node.args[index], env))
            })

            try {
                this.interpret(funcDecl.bodyStatements, newEnv)
            } catch (e) {
                if (e instanceof Return) {
                    return e.value;
                }
                throw e;
            }
        }

        if (node instanceof FuncCallStmt) {
            this.interpret(node.expression, env)
        }

        if (node instanceof RetStmt) {
            throw new Return(this.interpret(node.value, env))
        }
    }

    interpretAst(node: Expr): void {
        const globalEnv = new Environment();
        this.interpret(node, globalEnv);
    }
}