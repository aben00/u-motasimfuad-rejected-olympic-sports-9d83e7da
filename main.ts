// Rejected Olympic Sports — one funny single-line sport the Olympics rejected.
// Writes the entry to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt)
// and self-checks the house gate: UTF-8 text, 1-200 characters, not only whitespace,
// single line. Deterministic: same bytes on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Men's 100m Password Reset: athletes must recall the password they set in 2019 before the starting gun — no reset link, no mercy.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

// House gate limits, from the competition's resolution criteria.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function gateCheck(text) {
  if (typeof text !== "string") return "entry is not a string";
  if (text.length < MIN_CHARS || text.length > MAX_CHARS)
    return `entry is ${text.length} characters, must be ${MIN_CHARS}-${MAX_CHARS}`;
  if (text.trim().length === 0) return "entry is only whitespace";
  if (text.includes("\n") || text.includes("\r"))
    return "entry must be a single line";
  return null;
}

const problem = gateCheck(ENTRY);
if (problem) {
  console.error(`gate self-check failed: ${problem}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify byte-for-byte.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  console.error("verification failed: entry.txt does not match the entry");
  process.exit(1);
}

console.log(`wrote ${outPath} (${ENTRY.length} chars)`);
console.log(ENTRY);
