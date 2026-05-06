import { WordData } from "../assets/WordData.js";

export default async function getWords(setRandomWord) {
  /*
  const res = await fetch(
    "https://random-words-api.kushcreates.com/api?language=en&category=wordle",
  );

  const data = await res.json();
  const randomWordNum = Math.floor(Math.random() * data.length);
  console.log(data);
  setRandomWord(data[randomWordNum].word);
  */

  const data = WordData.words;
  const randomWordNum = Math.floor(Math.random() * data.length);
  setRandomWord(data[randomWordNum]);
}
