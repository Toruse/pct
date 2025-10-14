import Lexer from "./pinky/lexer.ts";
import Token from "./pinky/tokens.ts";
import {Colors, printPrettyAst} from "./utils.ts";
import Parser from "./pinky/parser.ts";
import {Stmts} from "./pinky/model.ts";
import Interpreter from "./pinky/interpreter.ts";
import {Compiler, Instruction} from "./pinky/compiler.ts";
import {VM} from "./pinky/vm.ts";

export default function pinky(source:string):void {
    try {
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        console.log(`${Colors.GREEN}SOURCE:${Colors.WHITE}`);
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        console.log(source);

        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        console.log(`${Colors.GREEN}TOKENS:${Colors.WHITE}`);
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        const lexer = new Lexer(source);
        let tokens: Token[];
        tokens = lexer.tokenize();
        tokens.forEach(tok => console.log(tok));

        console.log();
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        console.log(`${Colors.GREEN}AST:${Colors.WHITE}`);
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        const parser = new Parser(tokens);
        const ast: Stmts = parser.parse();
        printPrettyAst(ast.toString());

        console.log();
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        console.log(`${Colors.GREEN}INTERPRETER:${Colors.WHITE}`);
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        const interpreter = new Interpreter();
        interpreter.interpretAst(ast);

        console.log();
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);
        console.log(`${Colors.GREEN}CODE GENERATION:${Colors.WHITE}`);
        console.log(`${Colors.GREEN}***************************************${Colors.WHITE}`);

        const compiler = new Compiler();
        const code: Instruction[] = compiler.generateCode(ast);
        compiler.printCode();

        const vm = new VM()
        vm.run(code)

    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(`Error: ${err.message}`);
        } else {
            console.error("An unknown error occurred:", err);
        }
    }
}