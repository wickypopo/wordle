import fs from "fs";
import words from "german-words";

const filteredWords = words
  .map((word) => word.toLowerCase())
  .filter((word) => /^[a-zäöüß]{5}$/i.test(word))
  .filter((word, index, arr) => arr.indexOf(word) === index)
  .slice(0, 400);

fs.writeFileSync(
  "./src/data/words.json",
  JSON.stringify(filteredWords, null, 2),
  "utf-8",
);

console.log(`${filteredWords.length} Wörter gespeichert.`);
