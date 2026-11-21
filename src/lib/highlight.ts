/**
 * A small TypeScript highlighter for lesson code. It is deliberately simple: it
 * knows keywords, strings, numbers and comments, which is all a beginner's code needs.
 */
export type TokenKind = "keyword" | "string" | "number" | "comment" | "plain";

export interface Token {
  kind: TokenKind;
  text: string;
}

const KEYWORDS = new Set([
  "let", "const", "var", "if", "else", "for", "while", "do", "break", "continue", "return",
  "function", "true", "false", "null", "undefined", "typeof", "new", "class", "interface",
  "type", "import", "export", "from", "of", "in", "this", "switch", "case", "default",
  "async", "await", "number", "string", "boolean", "void",
]);

const PATTERN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/gm;

export function highlightLine(line: string): Token[] {
  const tokens: Token[] = [];
  const push = (kind: TokenKind, text: string) => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind) last.text += text;
    else tokens.push({ kind, text });
  };
  for (const match of line.matchAll(PATTERN)) {
    const [text, comment, str, num, word] = match;
    if (comment) push("comment", text);
    else if (str) push("string", text);
    else if (num) push("number", text);
    else if (word) push(KEYWORDS.has(word) ? "keyword" : "plain", text);
    else push("plain", text);
  }
  return tokens;
}
