var Fe = Object.defineProperty;
var Ge = (r, t, e) => t in r ? Fe(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var i = (r, t, e) => Ge(r, typeof t != "symbol" ? t + "" : t, e);
const U = "TOK_LPAREN", d = "TOK_RPAREN", Pe = "TOK_LCURLY", De = "TOK_RCURLY", We = "TOK_LSQUAR", He = "TOK_RSQUAR", L = "TOK_COMMA", Ce = "TOK_DOT", G = "TOK_PLUS", P = "TOK_MINUS", ft = "TOK_STAR", mt = "TOK_SLASH", kt = "TOK_CARET", Ot = "TOK_MOD", Ve = "TOK_COLON", Me = "TOK_SEMICOLON", Be = "TOK_QUESTION", Dt = "TOK_NOT", Et = "TOK_GT", $t = "TOK_LT", Qe = "TOK_EQ", xt = "TOK_GE", dt = "TOK_LE", gt = "TOK_NE", St = "TOK_EQEQ", V = "TOK_ASSIGN", A = "TOK_IDENTIFIER", Wt = "TOK_STRING", Ht = "TOK_INTEGER", Ct = "TOK_FLOAT", M = "TOK_IF", Vt = "TOK_THEN", B = "TOK_ELSE", Mt = "TOK_TRUE", Bt = "TOK_FALSE", H = "TOK_AND", C = "TOK_OR", Q = "TOK_WHILE", Y = "TOK_DO", z = "TOK_FOR", q = "TOK_FUNC", Ye = "TOK_NULL", b = "TOK_END", j = "TOK_PRINT", J = "TOK_PRINTLN", X = "TOK_RET", ze = {
  if: M,
  else: B,
  then: Vt,
  true: Mt,
  false: Bt,
  and: H,
  or: C,
  while: Q,
  do: Y,
  for: z,
  func: q,
  null: Ye,
  end: b,
  print: j,
  println: J,
  ret: X
};
let qe = class {
  constructor(t, e, s) {
    i(this, "tokenType");
    i(this, "lexeme");
    i(this, "line");
    this.tokenType = t, this.lexeme = e, this.line = s;
  }
  toString() {
    return `(${this.tokenType}, '${this.lexeme}', ${this.line})`;
  }
};
function Qt(r) {
  let t = "", e = 0, s = !1;
  for (let n of String(r))
    n === "(" ? (s || (t += ""), t += n + `
`, e += 2, s = !0) : n === ")" ? (s || (t += `
`), e -= 2, s = !0, t += " ".repeat(e) + n + `
`) : (s && (t += " ".repeat(e)), t += n, s = !1);
  console.log(t);
}
function I(r) {
  return typeof r == "boolean" ? r ? "true" : "false" : typeof r == "number" && Number.isInteger(r) ? r.toString() : String(r);
}
function R(r, t) {
  throw console.error(`${o.RED}[Line ${t}]: ${r} ${o.WHITE}`), new Error(`[Line ${t}]: ${r}`);
}
function y(r, t) {
  throw console.error(`${o.RED}[Line ${t}]: ${r} ${o.WHITE}`), new Error(`[Line ${t}]: ${r}`);
}
function T(r, t) {
  throw console.error(`${o.RED}[Line ${t}]: ${r} ${o.WHITE}`), new Error(`[Line ${t}]: ${r}`);
}
class o {
}
i(o, "WHITE", "\x1B[0m"), i(o, "BLUE", "\x1B[94m"), i(o, "CYAN", "\x1B[96m"), i(o, "GREEN", "\x1B[92m"), i(o, "YELLOW", "\x1B[93m"), i(o, "RED", "\x1B[91m");
let je = class {
  constructor(t) {
    i(this, "tokens");
    i(this, "source");
    i(this, "start");
    i(this, "curr");
    i(this, "line");
    this.source = t, this.start = 0, this.curr = 0, this.line = 1, this.tokens = [];
  }
  advance() {
    const t = this.source[this.curr];
    return this.curr++, t;
  }
  peek() {
    return this.curr >= this.source.length ? "\0" : this.source[this.curr];
  }
  lookahead(t = 1) {
    return this.curr + t >= this.source.length ? "\0" : this.source[this.curr + t];
  }
  match(t) {
    return this.curr >= this.source.length || this.source[this.curr] !== t ? !1 : (this.curr++, !0);
  }
  handleNumber() {
    for (; /\d/.test(this.peek()); )
      this.advance();
    if (this.peek() === "." && /\d/.test(this.lookahead())) {
      for (this.advance(); /\d/.test(this.peek()); )
        this.advance();
      this.addToken(Ct);
    } else
      this.addToken(Ht);
  }
  handleString(t) {
    for (; this.peek() !== t && this.curr < this.source.length; )
      this.advance();
    this.curr >= this.source.length && R("Unterminated string.", this.line), this.advance(), this.addToken(Wt);
  }
  handleIdentifier() {
    for (; /\w/.test(this.peek()); )
      this.advance();
    const t = this.source.substring(this.start, this.curr), e = ze[t] || A;
    this.addToken(e);
  }
  addToken(t) {
    const e = this.source.substring(this.start, this.curr);
    this.tokens.push(new qe(t, e, this.line));
  }
  tokenize() {
    for (; this.curr < this.source.length; ) {
      this.start = this.curr;
      const t = this.advance();
      switch (t) {
        case `
`:
          this.line++;
          break;
        case " ":
        case "	":
        case "\r":
          break;
        case "(":
          this.addToken(U);
          break;
        case ")":
          this.addToken(d);
          break;
        case "{":
          this.addToken(Pe);
          break;
        case "}":
          this.addToken(De);
          break;
        case "[":
          this.addToken(We);
          break;
        case "]":
          this.addToken(He);
          break;
        case ".":
          this.addToken(Ce);
          break;
        case ",":
          this.addToken(L);
          break;
        case "+":
          this.addToken(G);
          break;
        case "*":
          this.addToken(ft);
          break;
        case "^":
          this.addToken(kt);
          break;
        case "/":
          this.addToken(mt);
          break;
        case ";":
          this.addToken(Me);
          break;
        case "?":
          this.addToken(Be);
          break;
        case "%":
          this.addToken(Ot);
          break;
        case "-":
          if (this.match("-"))
            for (; this.peek() !== `
` && this.curr < this.source.length; )
              this.advance();
          else
            this.addToken(P);
          break;
        case "#":
          for (; this.peek() !== `
` && this.curr < this.source.length; )
            this.advance();
          break;
        case "=":
          this.addToken(this.match("=") ? St : Qe);
          break;
        case "~":
          this.addToken(this.match("=") ? gt : Dt);
          break;
        case "<":
          this.addToken(this.match("=") ? dt : $t);
          break;
        case ">":
          this.addToken(this.match("=") ? xt : Et);
          break;
        case ":":
          this.addToken(this.match("=") ? V : Ve);
          break;
        case '"':
        case "'":
          this.handleString(t);
          break;
        default:
          /\d/.test(t) ? this.handleNumber() : /\w/.test(t) ? this.handleIdentifier() : R(`Error at '${t}': Unexpected character.`, this.line);
      }
    }
    return this.tokens;
  }
}, _t = class {
}, $ = class extends _t {
}, g = class extends _t {
}, Yt = class extends g {
}, zt = class extends $ {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    if (!Number.isInteger(e))
      throw new Error(`Invalid Integer value: ${e}`);
    this.value = e, this.line = s;
  }
  toString() {
    return `Integer[${this.value}]`;
  }
}, qt = class extends $ {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    if (typeof e != "number")
      throw new Error(`Invalid Float value: ${e}`);
    this.value = e, this.line = s;
  }
  toString() {
    return `Float[${this.value}]`;
  }
}, Z = class extends $ {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    this.value = e, this.line = s;
  }
  toString() {
    return `Bool[${this.value}]`;
  }
}, jt = class extends $ {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    this.value = e, this.line = s;
  }
  toString() {
    return `String[${this.value}]`;
  }
}, Jt = class extends $ {
  constructor(e, s, n) {
    super();
    i(this, "op");
    i(this, "operand");
    i(this, "line");
    this.op = e, this.operand = s, this.line = n;
  }
  toString() {
    return `UnOp(${this.op.lexeme}, ${this.operand})`;
  }
}, _ = class extends $ {
  constructor(e, s, n, h) {
    super();
    i(this, "op");
    i(this, "left");
    i(this, "right");
    i(this, "line");
    this.op = e, this.left = s, this.right = n, this.line = h;
  }
  toString() {
    return `BinOp(${this.op.lexeme}, ${this.left}, ${this.right})`;
  }
}, tt = class extends $ {
  constructor(e, s, n, h) {
    super();
    i(this, "op");
    i(this, "left");
    i(this, "right");
    i(this, "line");
    this.op = e, this.left = s, this.right = n, this.line = h;
  }
  toString() {
    return `LogicalOp(${this.op.lexeme}, ${this.left}, ${this.right})`;
  }
}, Xt = class extends $ {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    this.value = e, this.line = s;
  }
  toString() {
    return `Grouping(${this.value})`;
  }
}, Zt = class extends $ {
  constructor(e, s) {
    super();
    i(this, "name");
    i(this, "line");
    this.name = e, this.line = s;
  }
  toString() {
    return `Identifier[${this.name}]`;
  }
}, te = class extends _t {
  constructor(e, s) {
    super();
    i(this, "statements");
    i(this, "line");
    this.statements = e, this.line = s;
  }
  toString() {
    return `Stmts(${this.statements})`;
  }
}, ee = class extends g {
  constructor(e, s, n) {
    super();
    i(this, "value");
    i(this, "end");
    i(this, "line");
    this.value = e, this.end = s, this.line = n;
  }
  toString() {
    return `PrintStmt(${this.value}, end=${this.end})`;
  }
}, se = class extends g {
  constructor(e, s, n, h) {
    super();
    i(this, "test");
    i(this, "thenStatements");
    i(this, "elseStatements");
    i(this, "line");
    this.test = e, this.thenStatements = s, this.elseStatements = n, this.line = h;
  }
  toString() {
    return `IfStmt(${this.test}, then: ${this.thenStatements}, else: ${this.elseStatements})`;
  }
}, ie = class extends g {
  constructor(e, s, n) {
    super();
    i(this, "test");
    i(this, "bodyStatements");
    i(this, "line");
    this.test = e, this.bodyStatements = s, this.line = n;
  }
  toString() {
    return `WhileStmt(${this.test}, ${this.bodyStatements})`;
  }
}, ne = class extends g {
  constructor(e, s, n) {
    super();
    i(this, "left");
    i(this, "right");
    i(this, "line");
    this.left = e, this.right = s, this.line = n;
  }
  toString() {
    return `Assignment(${this.left}, ${this.right})`;
  }
}, re = class extends g {
  constructor(e, s, n, h, c, u) {
    super();
    i(this, "identifier");
    i(this, "start");
    i(this, "end");
    i(this, "step");
    i(this, "bodyStatements");
    i(this, "line");
    this.identifier = e, this.start = s, this.end = n, this.step = h, this.bodyStatements = c, this.line = u;
  }
  toString() {
    return `ForStmt(${this.identifier}, ${this.start}, ${this.end}, ${this.step}, ${this.bodyStatements})`;
  }
}, he = class extends Yt {
  constructor(e, s, n, h) {
    super();
    i(this, "name");
    i(this, "params");
    i(this, "bodyStatements");
    i(this, "line");
    this.name = e, this.params = s, this.bodyStatements = n, this.line = h;
  }
  toString() {
    return `FuncDecl(${this.name}, ${this.params}, ${this.bodyStatements})`;
  }
}, Je = class extends Yt {
  constructor(e, s) {
    super();
    i(this, "name");
    i(this, "line");
    this.name = e, this.line = s;
  }
  toString() {
    return `Param(${this.name})`;
  }
}, oe = class extends $ {
  constructor(e, s, n) {
    super();
    i(this, "name");
    i(this, "args");
    i(this, "line");
    this.name = e, this.args = s, this.line = n;
  }
  toString() {
    return `FuncCall(${this.name}, ${this.args})`;
  }
}, ce = class extends g {
  constructor(e) {
    super();
    i(this, "expression");
    this.expression = e;
  }
  toString() {
    return `FuncCallStmt(${this.expression})`;
  }
}, ae = class extends g {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    this.value = e, this.line = s;
  }
  toString() {
    return `RetStmt(${this.value})`;
  }
}, Xe = class {
  constructor(t) {
    i(this, "tokens");
    i(this, "curr");
    this.tokens = t, this.curr = 0;
  }
  advance() {
    const t = this.tokens[this.curr];
    return this.curr++, t;
  }
  peek() {
    return this.tokens[this.curr];
  }
  isNext(t) {
    return this.curr < this.tokens.length && this.peek().tokenType === t;
  }
  expect(t) {
    if (this.curr >= this.tokens.length)
      y("Unexpected end of input", this.previousToken().line);
    else {
      if (this.peek().tokenType === t)
        return this.advance();
      y(`Expected ${t}, but found ${this.peek().lexeme}.`, this.peek().line);
    }
  }
  previousToken() {
    return this.tokens[this.curr - 1];
  }
  match(t) {
    return this.curr < this.tokens.length && this.peek().tokenType === t ? (this.curr++, !0) : !1;
  }
  primary() {
    if (this.match(Ht))
      return new zt(parseInt(this.previousToken().lexeme), this.previousToken().line);
    if (this.match(Ct))
      return new qt(parseFloat(this.previousToken().lexeme), this.previousToken().line);
    if (this.match(Mt))
      return new Z(!0, this.previousToken().line);
    if (this.match(Bt))
      return new Z(!1, this.previousToken().line);
    if (this.match(Wt))
      return new jt(this.previousToken().lexeme.slice(1, -1), this.previousToken().line);
    if (this.match(U)) {
      const t = this.expr();
      return this.expect(d), t ? new Xt(t, this.previousToken().line) : null;
    } else {
      const t = this.expect(A);
      if (typeof t < "u") {
        if (this.match(U)) {
          const e = this.args();
          return this.expect(d), new oe(t.lexeme, e, this.previousToken().line);
        }
        return new Zt(t.lexeme, this.previousToken().line);
      }
      return null;
    }
  }
  unary() {
    if (this.match(Dt) || this.match(P) || this.match(G)) {
      const t = this.previousToken(), e = this.unary();
      return e ? new Jt(t, e, t.line) : null;
    }
    return this.primary();
  }
  exponent() {
    let t = this.unary();
    for (; this.match(kt); ) {
      const e = this.previousToken(), s = this.exponent();
      t && s && (t = new _(e, t, s, e.line));
    }
    return t;
  }
  modulo() {
    let t = this.exponent();
    for (; this.match(Ot); ) {
      const e = this.previousToken(), s = this.exponent();
      t && s && (t = new _(e, t, s, e.line));
    }
    return t;
  }
  multiplication() {
    let t = this.modulo();
    for (; this.match(ft) || this.match(mt); ) {
      const e = this.previousToken(), s = this.modulo();
      t && s && (t = new _(e, t, s, e.line));
    }
    return t;
  }
  addition() {
    let t = this.multiplication();
    for (; this.match(G) || this.match(P); ) {
      const e = this.previousToken(), s = this.multiplication();
      t && s && (t = new _(e, t, s, e.line));
    }
    return t;
  }
  comparison() {
    let t = this.addition();
    for (; this.match(Et) || this.match(xt) || this.match($t) || this.match(dt); ) {
      const e = this.previousToken(), s = this.addition();
      t && s && (t = new _(e, t, s, e.line));
    }
    return t;
  }
  equality() {
    let t = this.comparison();
    for (; this.match(gt) || this.match(St); ) {
      const e = this.previousToken(), s = this.comparison();
      t && s && (t = new _(e, t, s, e.line));
    }
    return t;
  }
  logicalAnd() {
    let t = this.equality();
    for (; this.match(H); ) {
      const e = this.previousToken(), s = this.equality();
      t && s && (t = new tt(e, t, s, e.line));
    }
    return t;
  }
  logicalOr() {
    let t = this.logicalAnd();
    for (; this.match(C); ) {
      const e = this.previousToken(), s = this.logicalAnd();
      t && s && (t = new tt(e, t, s, e.line));
    }
    return t;
  }
  expr() {
    return this.logicalOr();
  }
  printStmt(t) {
    if (this.match(j) || this.match(J)) {
      const e = this.expr();
      return e ? new ee(e, t, this.previousToken().line) : null;
    }
    return null;
  }
  ifStmt() {
    this.expect(M);
    const t = this.expr();
    this.expect(Vt);
    const e = this.stmts();
    let s = null;
    return this.isNext(B) && (this.advance(), s = this.stmts()), this.expect(b), t ? new se(t, e, s, this.previousToken().line) : null;
  }
  whileStmt() {
    this.expect(Q);
    const t = this.expr();
    this.expect(Y);
    const e = this.stmts();
    return this.expect(b), t ? new ie(t, e, this.previousToken().line) : null;
  }
  forStmt() {
    this.expect(z);
    const t = this.primary();
    this.expect(V);
    const e = this.expr();
    this.expect(L);
    const s = this.expr();
    let n = null;
    this.isNext(L) && (this.advance(), n = this.expr()), this.expect(Y);
    const h = this.stmts();
    return this.expect(b), t && e && s ? new re(t, e, s, n, h, this.previousToken().line) : null;
  }
  args() {
    let t = [];
    for (; !this.isNext(d); ) {
      let e = this.expr();
      e && (t.push(e), this.isNext(d) || this.expect(L));
    }
    return t;
  }
  params() {
    const t = [];
    let e = 0;
    for (; !this.isNext(d); ) {
      const s = this.expect(A);
      typeof s > "u" || (e++, e > 255 && y("Functions cannot have more than 255 parameters.", s ? s.line : 0), t.push(new Je(s.lexeme, this.previousToken().line)), this.isNext(d) || this.expect(L));
    }
    return t;
  }
  funcDecl() {
    this.expect(q);
    const t = this.expect(A);
    if (typeof t > "u") return null;
    this.expect(U);
    const e = this.params();
    this.expect(d);
    const s = this.stmts();
    return this.expect(b), new he(t.lexeme, e, s, t.line);
  }
  retStmt() {
    this.expect(X);
    const t = this.expr();
    return t ? new ae(t, this.previousToken().line) : null;
  }
  stmt() {
    const t = this.peek().tokenType;
    if (t === j) return this.printStmt("");
    if (t === J) return this.printStmt(`
`);
    if (t === M) return this.ifStmt();
    if (t === Q) return this.whileStmt();
    if (t === z) return this.forStmt();
    if (t === q) return this.funcDecl();
    if (t === X) return this.retStmt();
    const e = this.expr();
    if (!e) return null;
    if (this.match(V)) {
      const s = this.expr();
      return s ? new ne(e, s, this.previousToken().line) : null;
    }
    return new ce(e);
  }
  stmts() {
    const t = [];
    for (; this.curr < this.tokens.length && !this.isNext(B) && !this.isNext(b); ) {
      let e = this.stmt();
      e && t.push(e);
    }
    return new te(t, this.previousToken().line);
  }
  program() {
    return this.stmts();
  }
  parse() {
    return this.program();
  }
}, Ze = class le {
  constructor(t = null) {
    i(this, "vars");
    i(this, "funcs");
    i(this, "parent");
    this.vars = {}, this.funcs = {}, this.parent = t;
  }
  getVar(t) {
    let e = this;
    for (; e; ) {
      if (t in e.vars)
        return e.vars[t];
      e = e.parent;
    }
  }
  setVar(t, e) {
    let s = this;
    for (; s; ) {
      if (t in s.vars)
        return s.vars[t] = e, e;
      s = s.parent;
    }
    return this.vars[t] = e, e;
  }
  getFunc(t) {
    let e = this;
    for (; e; ) {
      if (t in e.funcs)
        return e.funcs[t];
      e = e.parent;
    }
  }
  setFunc(t, e) {
    this.funcs[t] = e;
  }
  newEnv() {
    return new le(this);
  }
}, Gt = class extends Error {
  constructor(e) {
    super("Return statement");
    i(this, "value");
    this.value = e;
  }
};
const a = "TYPE_NUMBER", f = "TYPE_STRING", k = "TYPE_BOOL";
let ts = class {
  interpret(t, e) {
    if (t instanceof zt)
      return [a, t.value];
    if (t instanceof qt)
      return [a, t.value];
    if (t instanceof jt)
      return [f, t.value];
    if (t instanceof Z)
      return [k, t.value];
    if (t instanceof Xt)
      return this.interpret(t.value, e);
    if (t instanceof Zt) {
      const s = e.getVar(t.name);
      return s || T(`Undeclared identifier '${t.name}'`, t.line), s[1] === null && T(`Uninitialized identifier '${t.name}'`, t.line), s;
    }
    if (t instanceof ne) {
      const [s, n] = this.interpret(t.right, e);
      e.setVar(t.left.name, [s, n]);
    }
    if (t instanceof _) {
      const [s, n] = this.interpret(t.left, e), [h, c] = this.interpret(t.right, e);
      switch (t.op.tokenType) {
        case G:
          if (s === a && h === a)
            return [a, n + c];
          if (s === f || h === f)
            return [f, I(n) + I(c)];
          break;
        case P:
          if (s === a && h === a)
            return [a, n - c];
          break;
        case ft:
          if (s === a && h === a)
            return [a, n * c];
          break;
        case mt:
          if (h === 0 && T("Division by zero.", t.line), s === a && h === a)
            return [a, n / c];
          break;
        case Ot:
          if (s === a && h === a)
            return [a, n % c];
          break;
        case kt:
          if (s === a && h === a)
            return [a, n ** c];
          break;
        case Et:
          if (s === a && h === a || s === f && h === f)
            return [k, n > c];
          break;
        case xt:
          if (s === a && h === a || s === f && h === f)
            return [k, n >= c];
          break;
        case $t:
          if (s === a && h === a || s === f && h === f)
            return [k, n < c];
          break;
        case dt:
          if (s === a && h === a || s === f && h === f)
            return [k, n <= c];
          break;
        case St:
          if (s === a && h === a || s === f && h === f || s === k && h === k)
            return [k, n === c];
          break;
        case gt:
          if (s === a && h === a || s === f && h === f || s === k && h === k)
            return [k, n !== c];
          break;
        default:
          T(`Unsupported operator '${t.op.lexeme}'`, t.line);
      }
    }
    if (t instanceof Jt) {
      const [s, n] = this.interpret(t.operand, e);
      switch (t.op.tokenType) {
        case "TOK_MINUS":
          if (s === a)
            return [a, -n];
          break;
        case "TOK_PLUS":
          if (s === a)
            return [a, n];
          break;
        case "TOK_NOT":
          if (s === k)
            return [k, !n];
          break;
        default:
          T(`Unsupported operator '${t.op.lexeme}'`, t.line);
      }
    }
    if (t instanceof tt) {
      const [s, n] = this.interpret(t.left, e);
      switch (t.op.tokenType) {
        case C:
          if (n)
            return [s, n];
          break;
        case H:
          if (!n)
            return [s, n];
          break;
      }
      return this.interpret(t.right, e);
    }
    if (t instanceof te)
      for (const s of t.statements)
        this.interpret(s, e);
    if (t instanceof ee) {
      const [, s] = this.interpret(t.value, e);
      console.log(I(s), t.end === `
` ? `
` : "");
    }
    if (t instanceof se) {
      const [s, n] = this.interpret(t.test, e);
      s !== k && T("Condition test is not a boolean expression.", t.line), n ? this.interpret(t.thenStatements, e.newEnv()) : t.elseStatements && this.interpret(t.elseStatements, e.newEnv());
    }
    if (t instanceof ie)
      for (; ; ) {
        const [s, n] = this.interpret(t.test, e);
        if (s !== k && T("While test is not a boolean expression.", t.line), !n) break;
        this.interpret(t.bodyStatements, e.newEnv());
      }
    if (t instanceof re) {
      const s = t.identifier.name, [, n] = this.interpret(t.start, e), [, h] = this.interpret(t.end, e), c = e.newEnv();
      let u;
      if (n < h) {
        u = t.step ? this.interpret(t.step, e)[1] : 1;
        for (let p = n; p <= h; p += u)
          e.setVar(s, [a, p]), this.interpret(t.bodyStatements, c);
      } else {
        u = t.step ? this.interpret(t.step, e)[1] : -1;
        for (let p = n; p >= h; p += u)
          e.setVar(s, [a, p]), this.interpret(t.bodyStatements, c);
      }
    }
    if (t instanceof he && e.setFunc(t.name, [t, e]), t instanceof oe) {
      const s = e.getFunc(t.name);
      s || T(`Function '${t.name}' not declared.`, t.line);
      const [n, h] = s;
      t.args.length !== n.params.length && T(
        `Function '${n.name}' expected ${n.params.length} arguments but got ${t.args.length}.`,
        t.line
      );
      const c = h.newEnv();
      n.params.forEach((u, p) => {
        c.setVar(u.name, this.interpret(t.args[p], e));
      });
      try {
        this.interpret(n.bodyStatements, c);
      } catch (u) {
        if (u instanceof Gt)
          return u.value;
        throw u;
      }
    }
    if (t instanceof ce && this.interpret(t.expression, e), t instanceof ae)
      throw new Gt(this.interpret(t.value, e));
  }
  interpretAst(t) {
    const e = new Ze();
    this.interpret(t, e);
  }
};
function es(r) {
  try {
    console.log(`${o.GREEN}***************************************${o.WHITE}`), console.log(`${o.GREEN}SOURCE:${o.WHITE}`), console.log(`${o.GREEN}***************************************${o.WHITE}`), console.log(r), console.log(`${o.GREEN}***************************************${o.WHITE}`), console.log(`${o.GREEN}TOKENS:${o.WHITE}`), console.log(`${o.GREEN}***************************************${o.WHITE}`);
    const t = new je(r);
    let e;
    e = t.tokenize(), e.forEach((c) => console.log(c)), console.log(), console.log(`${o.GREEN}***************************************${o.WHITE}`), console.log(`${o.GREEN}AST:${o.WHITE}`), console.log(`${o.GREEN}***************************************${o.WHITE}`);
    const n = new Xe(e).parse();
    Qt(n.toString()), console.log(), console.log(`${o.GREEN}***************************************${o.WHITE}`), console.log(`${o.GREEN}INTERPRETER:${o.WHITE}`), console.log(`${o.GREEN}***************************************${o.WHITE}`), new ts().interpretAst(n);
  } catch (t) {
    t instanceof Error ? console.error(`Error: ${t.message}`) : console.error("An unknown error occurred:", t);
  }
}
const K = "TOK_LPAREN", E = "TOK_RPAREN", v = "TOK_LCURLY", w = "TOK_RCURLY", ss = "TOK_LSQUAR", is = "TOK_RSQUAR", et = "TOK_COMMA", ns = "TOK_DOT", D = "TOK_PLUS", W = "TOK_MINUS", Kt = "TOK_STAR", wt = "TOK_SLASH", Nt = "TOK_CARET", bt = "TOK_MOD", st = "TOK_SEMICOLON", rs = "TOK_QUESTION", ue = "TOK_NOT", vt = "TOK_GT", Rt = "TOK_LT", It = "TOK_GE", yt = "TOK_LE", Lt = "TOK_NE", Ut = "TOK_EQEQ", it = "TOK_ASSIGN", F = "TOK_IDENTIFIER", pe = "TOK_STRING", Te = "TOK_INTEGER", fe = "TOK_FLOAT", nt = "TOK_IF", rt = "TOK_ELSE", me = "TOK_TRUE", ke = "TOK_FALSE", Oe = "TOK_AND", Ee = "TOK_OR", ht = "TOK_WHILE", hs = "TOK_DO", ot = "TOK_FOR", ct = "TOK_FUNC", os = "TOK_NULL", at = "TOK_PRINT", lt = "TOK_PRINTLN", ut = "TOK_RET", cs = {
  if: nt,
  else: rt,
  true: me,
  false: ke,
  while: ht,
  do: hs,
  for: ot,
  function: ct,
  null: os,
  print: at,
  println: lt,
  return: ut
};
class as {
  constructor(t, e, s) {
    i(this, "tokenType");
    i(this, "lexeme");
    i(this, "line");
    this.tokenType = t, this.lexeme = e, this.line = s;
  }
  toString() {
    return `(${this.tokenType}, '${this.lexeme}', ${this.line})`;
  }
}
class ls {
  constructor(t) {
    i(this, "tokens");
    i(this, "source");
    i(this, "start");
    i(this, "curr");
    i(this, "line");
    this.source = t, this.start = 0, this.curr = 0, this.line = 1, this.tokens = [];
  }
  advance() {
    const t = this.source[this.curr];
    return this.curr++, t;
  }
  peek() {
    return this.curr >= this.source.length ? "\0" : this.source[this.curr];
  }
  lookahead(t = 1) {
    return this.curr + t >= this.source.length ? "\0" : this.source[this.curr + t];
  }
  match(t) {
    return this.curr >= this.source.length || this.source[this.curr] !== t ? !1 : (this.curr++, !0);
  }
  handleNumber() {
    for (; /\d/.test(this.peek()); )
      this.advance();
    if (this.peek() === "." && /\d/.test(this.lookahead())) {
      for (this.advance(); /\d/.test(this.peek()); )
        this.advance();
      this.addToken(fe);
    } else
      this.addToken(Te);
  }
  handleString(t) {
    for (; this.peek() !== t && this.curr < this.source.length; )
      this.advance();
    this.curr >= this.source.length && R("Unterminated string.", this.line), this.advance(), this.addToken(pe);
  }
  handleIdentifier() {
    for (; /\w/.test(this.peek()); )
      this.advance();
    const t = this.source.substring(this.start, this.curr), e = cs[t] || F;
    this.addToken(e);
  }
  addToken(t) {
    const e = this.source.substring(this.start, this.curr);
    this.tokens.push(new as(t, e, this.line));
  }
  tokenize() {
    for (; this.curr < this.source.length; ) {
      this.start = this.curr;
      const t = this.advance();
      switch (t) {
        case `
`:
          this.line++;
          break;
        case " ":
        case "	":
        case "\r":
          break;
        case "(":
          this.addToken(K);
          break;
        case ")":
          this.addToken(E);
          break;
        case "{":
          this.addToken(v);
          break;
        case "}":
          this.addToken(w);
          break;
        case "[":
          this.addToken(ss);
          break;
        case "]":
          this.addToken(is);
          break;
        case ".":
          this.addToken(ns);
          break;
        case ",":
          this.addToken(et);
          break;
        case "+":
          this.addToken(D);
          break;
        case "*":
          this.addToken(Kt);
          break;
        case "^":
          this.addToken(Nt);
          break;
        case "/":
          if (this.match("/"))
            for (; this.peek() !== `
` && this.curr < this.source.length; )
              this.advance();
          else
            this.addToken(wt);
          break;
        case ";":
          this.addToken(st);
          break;
        case "?":
          this.addToken(rs);
          break;
        case "%":
          this.addToken(bt);
          break;
        case "-":
          this.addToken(W);
          break;
        case "=":
          this.addToken(this.match("=") ? Ut : it);
          break;
        case "!":
          this.addToken(this.match("=") ? Lt : ue);
          break;
        case "<":
          this.addToken(this.match("=") ? yt : Rt);
          break;
        case ">":
          this.addToken(this.match("=") ? It : vt);
          break;
        case "|":
          this.match("|") ? this.addToken(C) : R(`Error at '${t}': Unexpected character.`, this.line);
          break;
        case "&":
          this.match("&") ? this.addToken(H) : R(`Error at '${t}': Unexpected character.`, this.line);
          break;
        case '"':
        case "'":
          this.handleString(t);
          break;
        default:
          /\d/.test(t) ? this.handleNumber() : /\w/.test(t) ? this.handleIdentifier() : R(`Error at '${t}': Unexpected character.`, this.line);
      }
    }
    return this.tokens;
  }
}
class At {
}
class x extends At {
}
class S extends At {
}
class $e extends S {
}
class xe extends x {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    if (!Number.isInteger(e))
      throw new Error(`Invalid Integer value: ${e}`);
    this.value = e, this.line = s;
  }
  toString() {
    return `Integer[${this.value}]`;
  }
}
class de extends x {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    if (typeof e != "number")
      throw new Error(`Invalid Float value: ${e}`);
    this.value = e, this.line = s;
  }
  toString() {
    return `Float[${this.value}]`;
  }
}
class pt extends x {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    this.value = e, this.line = s;
  }
  toString() {
    return `Bool[${this.value}]`;
  }
}
class ge extends x {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    this.value = e, this.line = s;
  }
  toString() {
    return `String[${this.value}]`;
  }
}
class Se extends x {
  constructor(e, s, n) {
    super();
    i(this, "op");
    i(this, "operand");
    i(this, "line");
    this.op = e, this.operand = s, this.line = n;
  }
  toString() {
    return `UnOp(${this.op.lexeme}, ${this.operand})`;
  }
}
class N extends x {
  constructor(e, s, n, h) {
    super();
    i(this, "op");
    i(this, "left");
    i(this, "right");
    i(this, "line");
    this.op = e, this.left = s, this.right = n, this.line = h;
  }
  toString() {
    return `BinOp(${this.op.lexeme}, ${this.left}, ${this.right})`;
  }
}
class Tt extends x {
  constructor(e, s, n, h) {
    super();
    i(this, "op");
    i(this, "left");
    i(this, "right");
    i(this, "line");
    this.op = e, this.left = s, this.right = n, this.line = h;
  }
  toString() {
    return `LogicalOp(${this.op.lexeme}, ${this.left}, ${this.right})`;
  }
}
class _e extends x {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    this.value = e, this.line = s;
  }
  toString() {
    return `Grouping(${this.value})`;
  }
}
class Ke extends x {
  constructor(e, s) {
    super();
    i(this, "name");
    i(this, "line");
    this.name = e, this.line = s;
  }
  toString() {
    return `Identifier[${this.name}]`;
  }
}
class we extends At {
  constructor(e, s) {
    super();
    i(this, "statements");
    i(this, "line");
    this.statements = e, this.line = s;
  }
  toString() {
    return `Stmts(${this.statements})`;
  }
}
class Ne extends S {
  constructor(e, s, n) {
    super();
    i(this, "value");
    i(this, "end");
    i(this, "line");
    this.value = e, this.end = s, this.line = n;
  }
  toString() {
    return `PrintStmt(${this.value}, end=${this.end})`;
  }
}
class be extends S {
  constructor(e, s, n, h) {
    super();
    i(this, "test");
    i(this, "thenStatements");
    i(this, "elseStatements");
    i(this, "line");
    this.test = e, this.thenStatements = s, this.elseStatements = n, this.line = h;
  }
  toString() {
    return `IfStmt(${this.test}, then: ${this.thenStatements}, else: ${this.elseStatements})`;
  }
}
class ve extends S {
  constructor(e, s, n) {
    super();
    i(this, "test");
    i(this, "bodyStatements");
    i(this, "line");
    this.test = e, this.bodyStatements = s, this.line = n;
  }
  toString() {
    return `WhileStmt(${this.test}, ${this.bodyStatements})`;
  }
}
class Re extends S {
  constructor(e, s, n) {
    super();
    i(this, "left");
    i(this, "right");
    i(this, "line");
    this.left = e, this.right = s, this.line = n;
  }
  toString() {
    return `Assignment(${this.left}, ${this.right})`;
  }
}
class Ie extends S {
  constructor(e, s, n, h, c, u) {
    super();
    i(this, "identifier");
    i(this, "start");
    i(this, "end");
    i(this, "step");
    i(this, "bodyStatements");
    i(this, "line");
    this.identifier = e, this.start = s, this.end = n, this.step = h, this.bodyStatements = c, this.line = u;
  }
  toString() {
    return `ForStmt(${this.identifier}, ${this.start}, ${this.end}, ${this.step}, ${this.bodyStatements})`;
  }
}
class ye extends $e {
  constructor(e, s, n, h) {
    super();
    i(this, "name");
    i(this, "params");
    i(this, "bodyStatements");
    i(this, "line");
    this.name = e, this.params = s, this.bodyStatements = n, this.line = h;
  }
  toString() {
    return `FuncDecl(${this.name}, ${this.params}, ${this.bodyStatements})`;
  }
}
class us extends $e {
  constructor(e, s) {
    super();
    i(this, "name");
    i(this, "line");
    this.name = e, this.line = s;
  }
  toString() {
    return `Param(${this.name})`;
  }
}
class Le extends x {
  constructor(e, s, n) {
    super();
    i(this, "name");
    i(this, "args");
    i(this, "line");
    this.name = e, this.args = s, this.line = n;
  }
  toString() {
    return `FuncCall(${this.name}, ${this.args})`;
  }
}
class Ue extends S {
  constructor(e) {
    super();
    i(this, "expression");
    this.expression = e;
  }
  toString() {
    return `FuncCallStmt(${this.expression})`;
  }
}
class Ae extends S {
  constructor(e, s) {
    super();
    i(this, "value");
    i(this, "line");
    this.value = e, this.line = s;
  }
  toString() {
    return `RetStmt(${this.value})`;
  }
}
class ps {
  constructor(t) {
    i(this, "tokens");
    i(this, "curr");
    this.tokens = t, this.curr = 0;
  }
  advance() {
    const t = this.tokens[this.curr];
    return this.curr++, t;
  }
  peek() {
    return this.tokens[this.curr];
  }
  isNext(t) {
    return this.curr < this.tokens.length && this.peek().tokenType === t;
  }
  expect(t) {
    if (this.curr >= this.tokens.length)
      y("Unexpected end of input", this.previousToken().line);
    else {
      if (this.peek().tokenType === t)
        return this.advance();
      y(`Expected ${t}, but found ${this.peek().lexeme}.`, this.peek().line);
    }
  }
  previousToken() {
    return this.tokens[this.curr - 1];
  }
  match(t) {
    return this.curr < this.tokens.length && this.peek().tokenType === t ? (this.curr++, !0) : !1;
  }
  primary() {
    if (this.match(Te))
      return new xe(parseInt(this.previousToken().lexeme), this.previousToken().line);
    if (this.match(fe))
      return new de(parseFloat(this.previousToken().lexeme), this.previousToken().line);
    if (this.match(me))
      return new pt(!0, this.previousToken().line);
    if (this.match(ke))
      return new pt(!1, this.previousToken().line);
    if (this.match(pe))
      return new ge(this.previousToken().lexeme.slice(1, -1), this.previousToken().line);
    if (this.match(K)) {
      const t = this.expr();
      return this.expect(E), t ? new _e(t, this.previousToken().line) : null;
    } else {
      const t = this.expect(F);
      if (typeof t < "u") {
        if (this.match(K)) {
          const e = this.args();
          return this.expect(E), new Le(t.lexeme, e, this.previousToken().line);
        }
        return new Ke(t.lexeme, this.previousToken().line);
      }
      return null;
    }
  }
  unary() {
    if (this.match(ue) || this.match(W) || this.match(D)) {
      const t = this.previousToken(), e = this.unary();
      return e ? new Se(t, e, t.line) : null;
    }
    return this.primary();
  }
  exponent() {
    let t = this.unary();
    for (; this.match(Nt); ) {
      const e = this.previousToken(), s = this.exponent();
      t && s && (t = new N(e, t, s, e.line));
    }
    return t;
  }
  modulo() {
    let t = this.exponent();
    for (; this.match(bt); ) {
      const e = this.previousToken(), s = this.exponent();
      t && s && (t = new N(e, t, s, e.line));
    }
    return t;
  }
  multiplication() {
    let t = this.modulo();
    for (; this.match(Kt) || this.match(wt); ) {
      const e = this.previousToken(), s = this.modulo();
      t && s && (t = new N(e, t, s, e.line));
    }
    return t;
  }
  addition() {
    let t = this.multiplication();
    for (; this.match(D) || this.match(W); ) {
      const e = this.previousToken(), s = this.multiplication();
      t && s && (t = new N(e, t, s, e.line));
    }
    return t;
  }
  comparison() {
    let t = this.addition();
    for (; this.match(vt) || this.match(It) || this.match(Rt) || this.match(yt); ) {
      const e = this.previousToken(), s = this.addition();
      t && s && (t = new N(e, t, s, e.line));
    }
    return t;
  }
  equality() {
    let t = this.comparison();
    for (; this.match(Lt) || this.match(Ut); ) {
      const e = this.previousToken(), s = this.comparison();
      t && s && (t = new N(e, t, s, e.line));
    }
    return t;
  }
  logicalAnd() {
    let t = this.equality();
    for (; this.match(Oe); ) {
      const e = this.previousToken(), s = this.equality();
      t && s && (t = new Tt(e, t, s, e.line));
    }
    return t;
  }
  logicalOr() {
    let t = this.logicalAnd();
    for (; this.match(Ee); ) {
      const e = this.previousToken(), s = this.logicalAnd();
      t && s && (t = new Tt(e, t, s, e.line));
    }
    return t;
  }
  expr() {
    return this.logicalOr();
  }
  printStmt(t) {
    if (this.match(at) || this.match(lt)) {
      const e = this.expr();
      return e ? new Ne(e, t, this.previousToken().line) : null;
    }
    return null;
  }
  ifStmt() {
    this.expect(nt), this.expect(K);
    const t = this.expr();
    this.expect(E), this.expect(v);
    const e = this.stmts();
    this.expect(w);
    let s = null;
    return this.isNext(rt) && (this.advance(), this.expect(v), s = this.stmts(), this.expect(w)), t ? new be(t, e, s, this.previousToken().line) : null;
  }
  whileStmt() {
    this.expect(ht), this.expect(K);
    const t = this.expr();
    this.expect(E), this.expect(v);
    const e = this.stmts();
    return this.expect(w), t ? new ve(t, e, this.previousToken().line) : null;
  }
  forStmt() {
    this.expect(ot), this.expect(K);
    const t = this.primary();
    this.expect(it);
    const e = this.expr();
    this.expect(st);
    const s = this.expr();
    let n = null;
    this.isNext(st) && (this.advance(), n = this.expr()), this.expect(E), this.expect(v);
    const h = this.stmts();
    return this.expect(w), t && e && s ? new Ie(t, e, s, n, h, this.previousToken().line) : null;
  }
  args() {
    let t = [];
    for (; !this.isNext(E); ) {
      let e = this.expr();
      e && (t.push(e), this.isNext(E) || this.expect(et));
    }
    return t;
  }
  params() {
    const t = [];
    let e = 0;
    for (; !this.isNext(E); ) {
      const s = this.expect(F);
      typeof s > "u" || (e++, e > 255 && y("Functions cannot have more than 255 parameters.", s ? s.line : 0), t.push(new us(s.lexeme, this.previousToken().line)), this.isNext(E) || this.expect(et));
    }
    return t;
  }
  funcDecl() {
    this.expect(ct);
    const t = this.expect(F);
    if (typeof t > "u") return null;
    this.expect(K);
    const e = this.params();
    this.expect(E), this.expect(v);
    const s = this.stmts();
    return this.expect(w), new ye(t.lexeme, e, s, t.line);
  }
  retStmt() {
    this.expect(ut);
    const t = this.expr();
    return t ? new Ae(t, this.previousToken().line) : null;
  }
  stmt() {
    const t = this.peek().tokenType;
    if (t === at) return this.printStmt("");
    if (t === lt) return this.printStmt(`
`);
    if (t === nt) return this.ifStmt();
    if (t === ht) return this.whileStmt();
    if (t === ot) return this.forStmt();
    if (t === ct) return this.funcDecl();
    if (t === ut) return this.retStmt();
    const e = this.expr();
    if (!e) return null;
    if (this.match(it)) {
      const s = this.expr();
      return s ? new Re(e, s, this.previousToken().line) : null;
    }
    return new Ue(e);
  }
  stmts() {
    const t = [];
    for (; this.curr < this.tokens.length && !this.isNext(rt) && !this.isNext(w); ) {
      let e = this.stmt();
      e && t.push(e);
    }
    return new we(t, this.previousToken().line);
  }
  program() {
    return this.stmts();
  }
  parse() {
    return this.program();
  }
}
class Ft {
  constructor(t = null) {
    i(this, "vars");
    i(this, "funcs");
    i(this, "parent");
    this.vars = {}, this.funcs = {}, this.parent = t;
  }
  getVar(t) {
    let e = this;
    for (; e; ) {
      if (t in e.vars)
        return e.vars[t];
      e = e.parent;
    }
  }
  setVar(t, e) {
    let s = this;
    for (; s; ) {
      if (t in s.vars)
        return s.vars[t] = e, e;
      s = s.parent;
    }
    return this.vars[t] = e, e;
  }
  getFunc(t) {
    let e = this;
    for (; e; ) {
      if (t in e.funcs)
        return e.funcs[t];
      e = e.parent;
    }
  }
  setFunc(t, e) {
    this.funcs[t] = e;
  }
  newEnv() {
    return new Ft(this);
  }
}
class Pt extends Error {
  constructor(e) {
    super("Return statement");
    i(this, "value");
    this.value = e;
  }
}
const l = "TYPE_NUMBER", m = "TYPE_STRING", O = "TYPE_BOOL";
class Ts {
  interpret(t, e) {
    if (t instanceof xe)
      return [l, t.value];
    if (t instanceof de)
      return [l, t.value];
    if (t instanceof ge)
      return [m, t.value];
    if (t instanceof pt)
      return [O, t.value];
    if (t instanceof _e)
      return this.interpret(t.value, e);
    if (t instanceof Ke) {
      const s = e.getVar(t.name);
      return s || T(`Undeclared identifier '${t.name}'`, t.line), s[1] === null && T(`Uninitialized identifier '${t.name}'`, t.line), s;
    }
    if (t instanceof Re) {
      const [s, n] = this.interpret(t.right, e);
      e.setVar(t.left.name, [s, n]);
    }
    if (t instanceof N) {
      const [s, n] = this.interpret(t.left, e), [h, c] = this.interpret(t.right, e);
      switch (t.op.tokenType) {
        case D:
          if (s === l && h === l)
            return [l, n + c];
          if (s === m || h === m)
            return [m, I(n) + I(c)];
          break;
        case W:
          if (s === l && h === l)
            return [l, n - c];
          break;
        case Kt:
          if (s === l && h === l)
            return [l, n * c];
          break;
        case wt:
          if (h === 0 && T("Division by zero.", t.line), s === l && h === l)
            return [l, n / c];
          break;
        case bt:
          if (s === l && h === l)
            return [l, n % c];
          break;
        case Nt:
          if (s === l && h === l)
            return [l, n ** c];
          break;
        case vt:
          if (s === l && h === l || s === m && h === m)
            return [O, n > c];
          break;
        case It:
          if (s === l && h === l || s === m && h === m)
            return [O, n >= c];
          break;
        case Rt:
          if (s === l && h === l || s === m && h === m)
            return [O, n < c];
          break;
        case yt:
          if (s === l && h === l || s === m && h === m)
            return [O, n <= c];
          break;
        case Ut:
          if (s === l && h === l || s === m && h === m || s === O && h === O)
            return [O, n === c];
          break;
        case Lt:
          if (s === l && h === l || s === m && h === m || s === O && h === O)
            return [O, n !== c];
          break;
        default:
          T(`Unsupported operator '${t.op.lexeme}'`, t.line);
      }
    }
    if (t instanceof Se) {
      const [s, n] = this.interpret(t.operand, e);
      switch (t.op.tokenType) {
        case "TOK_MINUS":
          if (s === l)
            return [l, -n];
          break;
        case "TOK_PLUS":
          if (s === l)
            return [l, n];
          break;
        case "TOK_NOT":
          if (s === O)
            return [O, !n];
          break;
        default:
          T(`Unsupported operator '${t.op.lexeme}'`, t.line);
      }
    }
    if (t instanceof Tt) {
      const [s, n] = this.interpret(t.left, e);
      switch (t.op.tokenType) {
        case Ee:
          if (n)
            return [s, n];
          break;
        case Oe:
          if (!n)
            return [s, n];
          break;
      }
      return this.interpret(t.right, e);
    }
    if (t instanceof we)
      for (const s of t.statements)
        this.interpret(s, e);
    if (t instanceof Ne) {
      const [, s] = this.interpret(t.value, e);
      console.log(I(s), t.end === `
` ? `
` : "");
    }
    if (t instanceof be) {
      const [s, n] = this.interpret(t.test, e);
      s !== O && T("Condition test is not a boolean expression.", t.line), n ? this.interpret(t.thenStatements, e.newEnv()) : t.elseStatements && this.interpret(t.elseStatements, e.newEnv());
    }
    if (t instanceof ve)
      for (; ; ) {
        const [s, n] = this.interpret(t.test, e);
        if (s !== O && T("While test is not a boolean expression.", t.line), !n) break;
        this.interpret(t.bodyStatements, e.newEnv());
      }
    if (t instanceof Ie) {
      const s = t.identifier.name, [, n] = this.interpret(t.start, e), [, h] = this.interpret(t.end, e), c = e.newEnv();
      let u;
      if (n < h) {
        u = t.step ? this.interpret(t.step, e)[1] : 1;
        for (let p = n; p <= h; p += u)
          e.setVar(s, [l, p]), this.interpret(t.bodyStatements, c);
      } else {
        u = t.step ? this.interpret(t.step, e)[1] : -1;
        for (let p = n; p >= h; p += u)
          e.setVar(s, [l, p]), this.interpret(t.bodyStatements, c);
      }
    }
    if (t instanceof ye && e.setFunc(t.name, [t, e]), t instanceof Le) {
      const s = e.getFunc(t.name);
      s || T(`Function '${t.name}' not declared.`, t.line);
      const [n, h] = s;
      t.args.length !== n.params.length && T(
        `Function '${n.name}' expected ${n.params.length} arguments but got ${t.args.length}.`,
        t.line
      );
      const c = h.newEnv();
      n.params.forEach((u, p) => {
        c.setVar(u.name, this.interpret(t.args[p], e));
      });
      try {
        this.interpret(n.bodyStatements, c);
      } catch (u) {
        if (u instanceof Pt)
          return u.value;
        throw u;
      }
    }
    if (t instanceof Ue && this.interpret(t.expression, e), t instanceof Ae)
      throw new Pt(this.interpret(t.value, e));
  }
  interpretAst(t) {
    const e = new Ft();
    this.interpret(t, e);
  }
}
function fs(r) {
  console.log(`${o.GREEN}***************************************${o.WHITE}`), console.log(`${o.GREEN}SOURCE:${o.WHITE}`), console.log(`${o.GREEN}***************************************${o.WHITE}`), console.log(r), console.log(`${o.GREEN}***************************************${o.WHITE}`), console.log(`${o.GREEN}TOKENS:${o.WHITE}`), console.log(`${o.GREEN}***************************************${o.WHITE}`);
  const t = new ls(r);
  let e;
  e = t.tokenize(), e.forEach((c) => console.log(c)), console.log(), console.log(`${o.GREEN}***************************************${o.WHITE}`), console.log(`${o.GREEN}AST:${o.WHITE}`), console.log(`${o.GREEN}***************************************${o.WHITE}`);
  const n = new ps(e).parse();
  Qt(n.toString()), console.log(), console.log(`${o.GREEN}***************************************${o.WHITE}`), console.log(`${o.GREEN}INTERPRETER:${o.WHITE}`), console.log(`${o.GREEN}***************************************${o.WHITE}`), new Ts().interpretAst(n);
}
document.addEventListener("DOMContentLoaded", function() {
  let r;
  r = document.scripts;
  for (let t = 0; t < r.length; t++) {
    const e = r[t];
    e.type === "text/pinky" ? es(e.text) : e.type === "text/ccode" && fs(e.text);
  }
});
