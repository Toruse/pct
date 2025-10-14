export function printPrettyAst(astText: string): void {
    let write: string = '';
    let i: number = 0;
    let newline: boolean = false;
    for (let ch of String(astText)) {
        if (ch === '(') {
            if (!newline) {
                write += ''
            }

            write += ch + '\n'
            i += 2;
            newline = true;
        } else if (ch === ')') {
            if (!newline) {
                write += '\n'
            }

            i -= 2;
            newline = true;
            write += ' '.repeat(i) + ch + '\n'
        } else {
            if (newline) {
                write += ' '.repeat(i)
            }

            write += ch
            newline = false;
        }
    }
    console.log(write)
}

export function stringify(val: unknown): string {
    if (typeof val === 'boolean') {
        return val ? "true" : "false";
    }
    if (typeof val === 'number' && Number.isInteger(val)) {
        return val.toString();
    }
    return String(val);
}

export function lexingError(message: string, lineno: number): void {
    console.error(`${Colors.RED}[Line ${lineno}]: ${message} ${Colors.WHITE}`);
    throw new Error(`[Line ${lineno}]: ${message}`);
}

export function parseError(message: string, lineno: number): void {
    console.error(`${Colors.RED}[Line ${lineno}]: ${message} ${Colors.WHITE}`);
    throw new Error(`[Line ${lineno}]: ${message}`);
}

export function runtimeError(message: string, lineno: number): void {
    console.error(`${Colors.RED}[Line ${lineno}]: ${message} ${Colors.WHITE}`);
    throw new Error(`[Line ${lineno}]: ${message}`);
}

export function compileError(message: string, lineno: number): void {
    console.error(`${Colors.RED}[Line ${lineno}]: ${message} ${Colors.WHITE}`);
    throw new Error(`[Line ${lineno}]: ${message}`);
}

export function vmError(message: string, pc: number): void {
    console.error(`${Colors.RED}[PC: ${pc}]: ${message} ${Colors.WHITE}`);
    throw new Error(`[PC: ${pc}]: ${message}`);
}

export class Colors {
    static WHITE: string = '\x1b[0m';
    static BLUE: string = '\x1b[94m';
    static CYAN: string = '\x1b[96m';
    static GREEN: string = '\x1b[92m';
    static YELLOW: string = '\x1b[93m';
    static RED: string = '\x1b[91m';
}