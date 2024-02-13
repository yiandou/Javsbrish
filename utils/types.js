const keywords = ["if", "else", "do", ":=", ";", "while", "mov", "true", "false", "cmp", "include", "struct", "sys"];

function isKeywords(x) {
    return keywords.includes(x);
}
function isDigit(ch) {
    return /[0-9]/i.test(ch);
}
function isIdStart(ch) {
    return /[a-z_]/i.test(ch);
}
function isId(ch) {
    return isIdStart(ch) || "?!-<>=0123456789".includes(ch);
}
function isOpChar(ch) {
    return "+-*/%=&|<>!".includes(ch);
}
function isPunc(ch) {
    return ",(){}[]".includes(ch);
}
function isWhitespace(ch) {
    return ' \t\n'.includes(ch);
}
module.exports = {
    isKeywords,
    isDigit,
    isIdStart,
    isId,
    isOpChar,
    isPunc,
    isWhitespace,
    keywords
}