// Temporary helper to debug brace balance in Quiz.tsx (CommonJS)
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Quiz.tsx');
const src = fs.readFileSync(filePath, 'utf8');
const lines = src.split('\n');

let inSingle = false;
let inDouble = false;
let inTemplate = false;
let escape = false;
let depth = 0;

lines.forEach((line, idx) => {
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (ch === '\\') {
      escape = true;
      continue;
    }

    if (!inDouble && !inTemplate && ch === "'" && !inSingle) {
      inSingle = true;
      continue;
    }
    if (!inDouble && !inTemplate && ch === "'" && inSingle) {
      inSingle = false;
      continue;
    }

    if (!inSingle && !inTemplate && ch === '"' && !inDouble) {
      inDouble = true;
      continue;
    }
    if (!inSingle && !inTemplate && ch === '"' && inDouble) {
      inDouble = false;
      continue;
    }

    if (!inSingle && !inDouble && ch === '`') {
      inTemplate = !inTemplate;
      continue;
    }

    if (inSingle || inDouble || inTemplate) continue;

    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
    }
  }

  if (idx >= lines.length - 60) {
    console.log(`Line ${idx + 1}: depth=${depth} :: ${line}`);
  }
});

console.log('Final depth:', depth);
