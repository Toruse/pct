import Lexer from "./ccode/lexer.ts";
import Token from "./ccode/tokens.ts";
import {Colors, printPrettyAst} from "./utils.ts";
import Parser from "./ccode/parser.ts";
import {Stmts} from "./ccode/model.ts";
import Interpreter from "./ccode/interpreter.ts";

export default function ccode(source:string):void {
    // try {
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

    // } catch (err: unknown) {
    //     if (err instanceof Error) {
    //         console.error(`Error: ${err.message}`);
    //     } else {
    //         console.error("An unknown error occurred:", err);
    //     }
    // }
}