(() => {
  window.CSRevision = window.CSRevision || {};
function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function init() {
  const keywordPattern = [
    "AND",
    "ASC",
    "BY",
    "CALL",
    "CASE",
    "CLOSEFILE",
    "DESC",
    "DIV",
    "DO",
    "ELSE",
    "ENDCASE",
    "ENDFOR",
    "ENDFUNCTION",
    "ENDIF",
    "ENDPROCEDURE",
    "ENDREPEAT",
    "ENDWHILE",
    "FALSE",
    "FOR",
    "FROM",
    "FUNCTION",
    "IF",
    "IN",
    "INPUT",
    "LIKE",
    "MOD",
    "NEXT",
    "NOT",
    "OPENFILE",
    "OR",
    "OUTPUT",
    "PROCEDURE",
    "READFILE",
    "REPEAT",
    "RETURN",
    "SELECT",
    "SORTBY",
    "THEN",
    "TO",
    "TRUE",
    "UNTIL",
    "WHERE",
    "WHILE",
    "WRITEFILE"
  ].join("|");

  const tokenPattern = new RegExp(
    `(".*?"|'.*?'|//.*$|#.*$|\\b(?:TRUE|FALSE)\\b|\\b(?:${keywordPattern})\\b|\\b\\d+(?:\\.\\d+)?\\b|==|!=|<=|>=|[+\\-*/=<>]|\\b[A-Za-z_][A-Za-z0-9_]*(?=\\())`,
    "gm"
  );

  document.querySelectorAll(".algorithm-code code").forEach((codeBlock) => {
    const source = codeBlock.textContent;
    let highlighted = "";
    let lastIndex = 0;
    let match = tokenPattern.exec(source);

    while (match) {
      const token = match[0];
      const offset = match.index;
      let className = "code-operator";

      highlighted += escapeHtml(source.slice(lastIndex, offset));

      if (token.startsWith("\"") || token.startsWith("'")) {
        className = "code-string";
      } else if (token.startsWith("#") || token.startsWith("//")) {
        className = "code-comment";
      } else if (/^(TRUE|FALSE)$/.test(token)) {
        className = "code-boolean";
      } else if (/^\d/.test(token)) {
        className = "code-number";
      } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(token) && source[offset + token.length] === "(") {
        className = "code-function";
      } else if (/^[A-Za-z_]+$/.test(token)) {
        className = "code-keyword";
      }

      highlighted += `<span class="${className}">${escapeHtml(token)}</span>`;
      lastIndex = offset + token.length;
      match = tokenPattern.exec(source);
    }

    highlighted += escapeHtml(source.slice(lastIndex));
    codeBlock.innerHTML = highlighted;
    tokenPattern.lastIndex = 0;
  });
}

  window.CSRevision.codeDisplay = { init };
})();
