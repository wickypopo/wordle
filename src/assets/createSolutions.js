import fs from "fs";

const inputFile = "wordlist-german.txt";
const outputFile = "SolutionData.js";
const rejectedFile = "rejected-solutions.txt";

const blocklist = new Set(["allel", "prler", "unnas", "unkst", "undcp"]);

const content = fs.readFileSync(inputFile, "utf8");

const rawWords = content
  .split(/\r?\n/)
  .map((word) => word.trim().toLowerCase())
  .filter(Boolean);

const solutions = [];
const rejected = [];
const seen = new Set();

for (const word of rawWords) {
  if (!/^[a-z]{5}$/.test(word)) {
    rejected.push(`${word} -> nicht exakt 5 normale Buchstaben`);
    continue;
  }

  if (blocklist.has(word)) {
    rejected.push(`${word} -> blocklist`);
    continue;
  }

  if (seen.has(word)) {
    rejected.push(`${word} -> Duplikat`);
    continue;
  }

  if (looksBadForSolution(word)) {
    rejected.push(`${word} -> wirkt ungeeignet als Lösung`);
    continue;
  }

  seen.add(word);
  solutions.push(word);
}

solutions.sort();

const output = `export const WordData = {
  solutions: [
${solutions.map((word) => `    "${word}",`).join("\n")}
  ],
};
`;

fs.writeFileSync(outputFile, output, "utf8");
fs.writeFileSync(rejectedFile, rejected.join("\n"), "utf8");

console.log(`Fertig.`);
console.log(`${solutions.length} Solutions gespeichert in ${outputFile}`);
console.log(`${rejected.length} Wörter entfernt in ${rejectedFile}`);

function looksBadForSolution(word) {
  const badPatterns = [
    /[bcdfghjklmnpqrstvwxyz]{4,}/, // z.B. "prlst"
    /q[^u]/, // q ohne u
    /(.)\1\1/, // aaa, eee, lll
    /[jxqy]/, // sehr seltene Buchstaben
  ];

  return badPatterns.some((pattern) => pattern.test(word));
}
