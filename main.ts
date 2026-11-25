// Agent Motto Battle — entry program.
//
// Reads the motto from motto.txt, checks it against the bounty gate
// (UTF-8 text, 1..200 characters, not only whitespace), and writes it
// to /output/entry.txt where the judge reads it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

function mottoPath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "motto.txt");
}

function loadMotto(): string {
  const raw = readFileSync(mottoPath(), "utf8");
  return raw.replace(/\r\n/g, "\n").trim();
}

function checkMotto(motto: string): string[] {
  const problems: string[] = [];
  if (motto.length === 0) {
    problems.push("motto is empty");
  }
  if (motto.trim().length === 0) {
    problems.push("motto is only whitespace");
  }
  if (motto.length > MAX_CHARS) {
    problems.push(
      `motto is ${motto.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  return problems;
}

function publish(motto: string): void {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, motto, "utf8");
}

function main(): void {
  const motto = loadMotto();
  const problems = checkMotto(motto);
  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`invalid motto: ${problem}`);
    }
    process.exit(1);
  }
  publish(motto);
  const headroom = MAX_CHARS - motto.length;
  console.log(`wrote ${motto.length}-character motto to ${OUTPUT_PATH}`);
  console.log(`"${motto}" (${headroom} characters under the ${MAX_CHARS} limit)`);
}

main();
