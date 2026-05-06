import fs from "fs";

const inputFile = "wordlist-german.txt";
const outputFile = "WordData.js";
const rejectedFile = "rejected-words.txt";
const reviewFile = "review-words.txt";

// Optionale manuelle Blocklist für Wörter, die formal gültig aussehen,
// aber für dein Wordle keinen Sinn ergeben
const blocklist = new Set(["allel", "prler", "unnas", "unkst", "undcp"]);

const content = fs.readFileSync(inputFile, "utf8");

const rawWords = content
  .split(/\r?\n/)
  .map((word) => word.trim().toLowerCase())
  .filter(Boolean);

const accepted = [];
const rejected = [];
const review = [];

const seen = new Set();

for (const word of rawWords) {
  // Nur exakt 5 normale Buchstaben von a-z erlauben
  const isValidAsciiWord = /^[a-z]{5}$/.test(word);

  if (!isValidAsciiWord) {
    rejected.push(`${word} -> ungültige Zeichen oder nicht exakt 5 Buchstaben`);
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

  seen.add(word);
  accepted.push(word);
}

// Optional: sehr simple Review-Heuristik
// Diese Wörter werden NICHT automatisch gelöscht,
// sondern nur in review-words.txt geschrieben.
for (const word of accepted) {
  if (looksSuspicious(word)) {
    review.push(word);
  }
}

accepted.sort();

const output = `export const WordData = {
  words: [
${accepted.map((word) => `    "${word}",`).join("\n")}
  ],
};
`;

fs.writeFileSync(outputFile, output, "utf8");
fs.writeFileSync(rejectedFile, rejected.join("\n"), "utf8");
fs.writeFileSync(reviewFile, review.join("\n"), "utf8");

console.log(`Fertig.`);
console.log(`${accepted.length} Wörter gespeichert in ${outputFile}`);
console.log(`${rejected.length} Wörter entfernt in ${rejectedFile}`);
console.log(`${review.length} Wörter zur Prüfung in ${reviewFile}`);

function looksSuspicious(word) {
  // Sehr grober Check für ungewöhnliche Buchstabenkombinationen
  const suspiciousPatterns = [
    /[bcdfghjklmnpqrstvwxyz]{4,}/, // 4 Konsonanten am Stück
    /q[^u]/, // q ohne u danach
    /[jxqy]/, // seltene Buchstaben
    /(.)\1\1/, // 3 gleiche Buchstaben hintereinander
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(word));
}
