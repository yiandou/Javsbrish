class inputStream {
    constructor(input) {
        let pos = 0, line = 1, col = 0;
        next = () => {
            let ch = input.charAt(pos++);
            if (ch === "\n") {
                line++;
                col = 0;
            } else {
                col++;
            }
        }
        peek = () => {
            return input.charAt(pos);
        }
        eof = () => {
            return peek() === "";
        }
        issue = (msg) => {
            throw new Error(`${msg} (${line}:${col})`);
        }
    }
}
module.exports = inputStream;