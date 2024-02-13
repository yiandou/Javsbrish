const { isDigit, isId, isIdStart, isKeywords, isOpChar, isPunc, isWhitespace, keywords } = require('../utils/types.js');
module.exports = class tokenStream {
    constructor(input) {
        let current = null;
        next = () => {
            let tok = current;
            current = null;
            return tok || readNext();
        }
        peek = () => {
            return current || (current = readNext());
        }
        eof = () => {
            return peek() === null;
        }
        readWhile = (predicate) => {
            let str = '';
            while (!input.eof() && predicate(input.peek())) {
                str += input.next();
            }
            return str;
        }
        readNumber = () => {
            let hasDot = false;
            let number = readWhile((ch) => {
                if (ch === ".") {
                    if (hasDot) return false;
                    hasDot = true;
                    return true;
                }
                return isDigit(ch);
            });
            return { type: "num", value: parseFloat(number) };
        }
        readIdent = () => {
            let id = readWhile(isId);
            return {
                type: isKeywords(id) ? "kw" : "var",
                value: id
            };
        }
        readEscaped = (end) => {
            let escaped = false, str = '';
            input.next();
            while (!input.eof()) {
                let ch = input.next();
                if (escaped) {
                    str += ch;
                    escaped = false;
                } else if (ch === "\\") {
                    escaped = true;
                } else if (ch === end) {
                    break;
                } else {
                    str += ch;
                }
            }
            return str;
        }
        readString = () => {
            return { type: "str", value: readEscaped('"') };
        }
        skipComment = () => {
            readWhile((ch) => {
                return ch !== "\n";
            });
            input.next();
        }
        readNext = () => {
            readWhile(isWhitespace(isWhitespace));
            if (input.eof()) return null;
            let ch = input.peek();
            if (ch === ";") {
                skipComment();
                return readNext();
            }
            if (ch === '"' || ch === "'") return readString();
            if (isDigit(ch)) return readNumber();
            if (isIdStart(ch)) return readIdent();
            if (isPunc(ch)) return {
                type: "punc",
                value: input.next()
            };
            if (isOpChar(ch)) return {
                type: "op",
                value: readWhile(isOpChar)
            };
            input.issue(`Can't handle character: ${ch}`);
        }
    }
}