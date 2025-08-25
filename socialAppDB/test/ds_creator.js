import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Helper for __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON files manually
const datasetPath = path.join(__dirname, "dataset.json");
const profaneWordsPath = path.join(__dirname, "words.json");

const datasetRaw = await fs.readFile(datasetPath, "utf-8");
// const profaneWordsRaw = await fs.readFile(profaneWordsPath, 'utf-8');

const dataset = JSON.parse(datasetRaw);
// const profaneWords = JSON.parse(profaneWordsRaw);

// // Add profane words
// profaneWords.forEach(word => {
//   dataset.push({
//     lang: 'en',
//     utterance: word,
//     intent: 'abuse.strong'
//   });
// });

// // Save result
// const outputPath = path.join(__dirname, 'updated_ds.json');
// await fs.writeFile(outputPath, JSON.stringify(dataset, null, 2), 'utf-8');

// console.log('✅ Dataset saved as updated_ds.json');

const file = path.join(__dirname, "roman.txt");
const profaneWordsRaw = (await fs.readFile(file, "utf-8")).split("\r\n");

for (let word of profaneWordsRaw) {
  if (word == "" || word == " " || word == " " || word == "\n") continue;
  console.log(word);
  dataset.push({
    lang: "ur",
    utterance: word,
    intent: "abuse.strong",
  });
}
const outputPath = path.join(__dirname, 'updated_ds.json');
await fs.writeFile(outputPath, JSON.stringify(dataset, null, 2), 'utf-8');
