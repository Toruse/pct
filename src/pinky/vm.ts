// vm.ts
import {
    TYPE_BOOL,
    TYPE_NUMBER,
    TYPE_STRING
} from "../defs.ts";
import {stringify, vmError} from "../utils.ts";

/**
 * Простая стековая виртуальная машина (VM)
 * Перевод вашей JS-версии в TypeScript.
 */

export type ValueType =
    | typeof TYPE_NUMBER
    | typeof TYPE_STRING
    | typeof TYPE_BOOL;

export type VMValue = [ValueType, number | string | boolean];


class Frame {
    name: string;
    ret_pc: number;
    fp: number;

    constructor(name: string, ret_pc: number, fp: number) {
        this.name = name;
        this.ret_pc = ret_pc;
        this.fp = fp;
    }
}

export class VM {
    stack: VMValue[] = [];
    frames: Frame[] = [];
    labels: Record<string, number> = {};
    globals: Record<number, VMValue> = {};
    pc = 0;
    sp = 0;
    isRunning = false;

    /** Сканирует инструкции и создаёт таблицу меток */
    createLabelTable(instructions: (string | VMValue)[][]): void {
        this.labels = {};
        let pc = 0;
        for (const instr of instructions) {
            const [opcode, ...args] = instr;
            if (opcode === "LABEL") {
                this.labels[String(args[0])] = pc;
            }
            pc++;
        }
    }

    /** Основной цикл исполнения */
    run(instructions: (string | VMValue)[][]): void {
        this.pc = 0;
        this.sp = 0;
        this.isRunning = true;
        this.createLabelTable(instructions);

        while (this.isRunning && this.pc < instructions.length) {
            const [opcode, ...args] = instructions[this.pc];
            this.pc++;

            const fn = (this as any)[opcode];
            if (typeof fn !== "function") {
                throw new Error(`Unknown opcode: ${opcode}`);
            }

            fn.apply(this, args);
        }
    }

    // === Операции со стеком ===
    PUSH(value: VMValue): void {
        this.stack.push(value);
        this.sp++;
    }

    POP(): VMValue {
        this.sp--;
        return this.stack.pop() as VMValue;
    }

    // === Арифметические операции ===
    ADD(): void {
        const [rt, rv] = this.POP();
        const [lt, lv] = this.POP();

        if (lt === TYPE_NUMBER && rt === TYPE_NUMBER) {
            this.PUSH([TYPE_NUMBER, (lv as number) + (rv as number)]);
        } else if (lt === TYPE_STRING || rt === TYPE_STRING) {
            this.PUSH([TYPE_STRING, stringify(lv) + stringify(rv)]);
        } else {
            vmError(`ADD between ${lt} and ${rt}`, this.pc - 1);
        }
    }

    SUB(): void {
        const [rt, rv] = this.POP();
        const [lt, lv] = this.POP();
        if (lt === TYPE_NUMBER && rt === TYPE_NUMBER) {
            this.PUSH([TYPE_NUMBER, (lv as number) - (rv as number)]);
        } else {
            vmError(`SUB between ${lt} and ${rt}`, this.pc - 1);
        }
    }

    MUL(): void {
        const [rt, rv] = this.POP();
        const [lt, lv] = this.POP();
        if (lt === TYPE_NUMBER && rt === TYPE_NUMBER) {
            this.PUSH([TYPE_NUMBER, (lv as number) * (rv as number)]);
        } else {
            vmError(`MUL between ${lt} and ${rt}`, this.pc - 1);
        }
    }

    DIV(): void {
        const [rt, rv] = this.POP();
        const [lt, lv] = this.POP();
        if (lt === TYPE_NUMBER && rt === TYPE_NUMBER) {
            this.PUSH([TYPE_NUMBER, (lv as number) / (rv as number)]);
        } else {
            vmError(`DIV between ${lt} and ${rt}`, this.pc - 1);
        }
    }

    EXP(): void {
        const [rt, rv] = this.POP();
        const [lt, lv] = this.POP();
        if (lt === TYPE_NUMBER && rt === TYPE_NUMBER) {
            this.PUSH([TYPE_NUMBER, Math.pow(lv as number, rv as number)]);
        } else {
            vmError(`EXP between ${lt} and ${rt}`, this.pc - 1);
        }
    }

    MOD(): void {
        const [rt, rv] = this.POP();
        const [lt, lv] = this.POP();
        if (lt === TYPE_NUMBER && rt === TYPE_NUMBER) {
            this.PUSH([TYPE_NUMBER, (lv as number) % (rv as number)]);
        } else {
            vmError(`MOD between ${lt} and ${rt}`, this.pc - 1);
        }
    }

    AND(): void {
        const [rt, rv] = this.POP();
        const [lt, lv] = this.POP();

        if (lt === TYPE_NUMBER && rt === TYPE_NUMBER) {
            this.PUSH([TYPE_NUMBER, (lv as number) & (rv as number)]);
        } else if (lt === TYPE_BOOL && rt === TYPE_BOOL) {
            this.PUSH([TYPE_BOOL, Boolean(lv && rv)]);
        } else {
            vmError(`AND between ${lt} and ${rt}`, this.pc - 1);
        }
    }

    OR(): void {
        const [rt, rv] = this.POP();
        const [lt, lv] = this.POP();

        if (lt === TYPE_NUMBER && rt === TYPE_NUMBER) {
            this.PUSH([TYPE_NUMBER, (lv as number) | (rv as number)]);
        } else if (lt === TYPE_BOOL && rt === TYPE_BOOL) {
            this.PUSH([TYPE_BOOL, Boolean(lv || rv)]);
        } else {
            vmError(`OR between ${lt} and ${rt}`, this.pc - 1);
        }
    }

    XOR(): void {
        const [rt, rv] = this.POP();
        const [lt, lv] = this.POP();

        if (lt === TYPE_NUMBER && rt === TYPE_NUMBER) {
            this.PUSH([TYPE_NUMBER, (lv as number) ^ (rv as number)]);
        } else if (lt === TYPE_BOOL && rt === TYPE_BOOL) {
            this.PUSH([TYPE_BOOL, lv !== rv]);
        } else {
            vmError(`XOR between ${lt} and ${rt}`, this.pc - 1);
        }
    }

    NEG(): void {
        const [t, v] = this.POP();
        if (t === TYPE_NUMBER) {
            this.PUSH([TYPE_NUMBER, -(v as number)]);
        } else {
            vmError(`NEG on ${t}`, this.pc - 1);
        }
    }

    // === Сравнения ===
    private _compare(fn: (a: any, b: any) => boolean, op: string): void {
        const [rt, rv] = this.POP();
        const [lt, lv] = this.POP();
        if (lt === rt && (lt === TYPE_NUMBER || lt === TYPE_STRING || lt === TYPE_BOOL)) {
            this.PUSH([TYPE_BOOL, fn(lv, rv)]);
        } else {
            vmError(`${op} between ${lt} and ${rt}`, this.pc - 1);
        }
    }

    LT(): void { this._compare((a, b) => a < b, "LT"); }
    GT(): void { this._compare((a, b) => a > b, "GT"); }
    LE(): void { this._compare((a, b) => a <= b, "LE"); }
    GE(): void { this._compare((a, b) => a >= b, "GE"); }
    EQ(): void { this._compare((a, b) => a === b, "EQ"); }
    NE(): void { this._compare((a, b) => a !== b, "NE"); }

    // === Ввод/вывод ===
    PRINT(): void {
        const [, val] = this.POP();
        console.log(String(val));
    }

    PRINTLN(): void {
        const [, val] = this.POP();
        console.log(String(val));
    }

    LABEL(_name: string): void { /* no-op */ }

    // === Переходы ===
    JMP(label: string): void {
        this.pc = this.labels[label];
    }

    JMPZ(label: string): void {
        const [, val] = this.POP();
        if (val === 0 || val === false) {
            this.pc = this.labels[label];
        }
    }

    // === Вызовы функций ===
    JSR(label: string): void {
        const [, numArgs] = this.POP();
        const basePointer = this.sp - (numArgs as number);
        const newFrame = new Frame(label, this.pc, basePointer);
        this.frames.push(newFrame);
        this.pc = this.labels[label];
    }

    RTS(): void {
        const result = this.stack[this.sp - 1];
        const frame = this.frames[this.frames.length - 1];

        while (this.sp > frame.fp) {
            this.POP();
        }
        this.PUSH(result);
        this.pc = frame.ret_pc;
        this.frames.pop();
    }

    // === Глобальные / локальные переменные ===
    LOAD_GLOBAL(slot: number): void {
        this.PUSH(this.globals[slot]);
    }

    STORE_GLOBAL(slot: number): void {
        this.globals[slot] = this.POP();
    }

    LOAD_LOCAL(slot: number): void {
        if (this.frames.length > 0) {
            slot += this.frames[this.frames.length - 1].fp;
        }
        this.PUSH(this.stack[slot]);
    }

    STORE_LOCAL(slot: number): void {
        if (this.frames.length > 0) {
            slot += this.frames[this.frames.length - 1].fp;
        }
        this.stack[slot] = this.POP();
    }

    SET_SLOT(_slot: string): void {
        // используется для локальных деклараций
    }

    HALT(): void {
        this.isRunning = false;
    }
}
