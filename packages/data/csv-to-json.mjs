#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename, extname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const csvDir = join(here, 'csv');
const jsonDir = join(here, 'json');
// The web app consumes a checked-in copy of the generated JSON.
const webJsonDir = join(here, '..', 'web', 'src', 'data', 'json');
mkdirSync(jsonDir, { recursive: true });
mkdirSync(webJsonDir, { recursive: true });

const parseCSV = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') {
        row.push(field);
        field = '';
      } else if (c === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else if (c === '\r') {
        /* skip */
      } else field += c;
    }
    i++;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
};

for (const file of readdirSync(csvDir)) {
  if (extname(file) !== '.csv') continue;
  const csvPath = join(csvDir, file);
  const rows = parseCSV(readFileSync(csvPath, 'utf8'));
  const [header, ...data] = rows;
  const records = data.map((cells) =>
    Object.fromEntries(header.map((col, i) => [col, cells[i] ?? '']))
  );
  const name = basename(file, '.csv') + '.json';
  const contents = `${JSON.stringify(records, null, 2)}\n`;
  for (const dir of [jsonDir, webJsonDir]) {
    const jsonPath = join(dir, name);
    writeFileSync(jsonPath, contents, 'utf8');
    console.log(`Wrote ${records.length} records -> ${jsonPath}`);
  }
}
