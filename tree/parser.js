module.exports = function parse(input) {
    const OPERORDER = {
        "=": 1,
        "||": 2,
        "&&": 3,
        "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
        "+": 10, "-": 10,
        "*": 20, "/": 20, "%": 20
    };
    function isPunc(ch) {
        let tok = input.peek();
        return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
    }
    function isKw(kw) {
        let tok = input.peek();
        return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
    }
    function isOp(op) {
        let tok = input.peek();
        return tok && tok.type == "op" && (!op || tok.value == op) && tok;
    }
    function skipPunc(ch) {
        if (isPunc(ch)) input.next();
        else input.issue("Expecting punctuation: \"" + ch + "\"");
    }
    function skipKw(kw) {
        if (isKw(kw)) input.next();
        else input.issue("Expecting keyword: \"" + kw + "\"");
    }
    function skipOp(op) {
        if (isOp(op)) input.next();
        else input.issue("Expecting operator: \"" + op + "\"");
    }
    function unexpected() {
        input.issue("Unexpected token: " + JSON.stringify(input.peek()));
    }
    function maybeBinary(left, my_prec) {
        let tok = isOp();
        if (tok) {
            const his_prec = PRECEDENCE[tok.value];
            if (his_prec > my_prec) {
                input.next();
                return maybeBinary({
                    type     : "binary",
                    operator : tok.value,
                    left     : left,
                    right    : maybeBinary(parseIf(), his_prec)
                }, my_prec);
            }
        }
        return left;
    }
    function delimited(start, stop, separator, parser) {
        let a = [], first = true;
        skipPunc(start);
        while (!input.eof()) {
            if (isPunc(stop)) break;
            if (first) first = false; else skipPunc(separator);
            if (isPunc(stop)) break;
            a.push(parser());
        }
        skipPunc(stop);
        return a;
    }
    function parseCall(label) {
        return {
            type: "call",
            label: label,
            args: delimited("(", ")", ",", parseExpression)
        };
    }
    function parseVarname() {
        let name = input.next();
        if (name.type != "var") input.issue("Expecting variable name");
        return name.value;
    }
    function parseIf() {
        skipKw("if");
        let cond = delimited("(", ")", ",", parseExpression);
        let then = parseExpression();
        let ret = {
            type: "if",
            cond: cond,
            then: then
        };
        if (isKw("else")) {
            input.next();
            ret.else = parseExpression();
        }
        return ret;
    }
    function parseLabel() {
        let label = input.next();
        if (label.type != "var") input.issue("Expecting label");
        return label.value;
    }
    function parseBool() {
        return {
            type: "bool",
            value: input.next().value == "true"
        };
    }
    function maybeCall(expr) {
        expr = expr();
        return isPunc("(") ? parseCall(expr) : expr;
    }
    function parseBite() {
        return maybeCall(function() {
            if (isPunc("(")) {
                input.next();
                let exp = parseExpression();
                skipPunc(")");
                return exp;
            }
            if (isPunc("{")) return parseBlock();
            if (isKw("if")) return parseIf();
            if (isKw("true") || isKw("false")) return parseBool();
            if (isKw("label")) {
                input.next();
                return parseLabel();
            }
            let tok = input.next();
            if (tok.type == "var" || tok.type == "num" || tok.type == "str") return tok;
            unexpected();
        });
    }
    function parseExpression() {
        return maybeCall(function() {
            return maybeBinary(parseBite(), 0);
        });
    }
    function parseTop() {
        let prog = [];
        while (!input.eof()) {
            prog.push(parseExpression());
            if (!input.eof()) skipPunc(";");
        }
        return { type: "prog", prog: prog };
    }
    function parseBlock() {
        let block = delimited("{", "}", ";", parseExpression);
        if (block.length == 0) return false;
        if (block.length == 1) return block[0];
        return { type: "block", block: block };
    }
    return parseTop();
};