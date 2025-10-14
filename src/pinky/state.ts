export default class Environment {
    public vars: {[key: string]: any}
    public funcs: {[key: string]: any}
    public parent: Environment | null

    constructor(parent: Environment | null = null) {
        this.vars = {}
        this.funcs = {}
        this.parent = parent
    }

    getVar(name: string): any {
        let currentEnv: Environment | null = this
        while (currentEnv) {
            if (name in currentEnv.vars) {
                return currentEnv.vars[name]
            }
            currentEnv = currentEnv.parent
        }
        return undefined
    }

    setVar(name: string, value: any): any {
        let currentEnv: Environment | null = this
        while (currentEnv) {
            if (name in currentEnv.vars) {
                currentEnv.vars[name] = value
                return value
            }
            currentEnv = currentEnv.parent
        }
        this.vars[name] = value
        return value
    }

    setLocal(name: string, value: any): any {
        this.vars[name] = value
    }

    getFunc(name: string): any {
        let currentEnv: Environment | null = this
        while (currentEnv) {
            if (name in currentEnv.funcs) {
                return currentEnv.funcs[name]
            }
            currentEnv = currentEnv.parent
        }
        return undefined
    }

    setFunc(name: string, value: any): void {
        this.funcs[name] = value
    }

    newEnv(): Environment {
        return new Environment(this);
    }
}

export class Return extends Error {
    public value: any

    constructor(value: any) {
        super('Return statement')
        this.value = value
    }
}