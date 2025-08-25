import { NlpManager } from "node-nlp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// ES6 workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the dataset
const datasetRaw = await fs.readFile(
  path.join(__dirname, "./updated_ds.json"),
  "utf-8"
);
const dataset = JSON.parse(datasetRaw);

// Initialize NLP manager
const manager = new NlpManager({ languages: ["en", "ur"] });

// Load dataset into manager
for (const item of dataset) {
  manager.addDocument(item.lang, item.utterance, item.intent);
}


// Classification function
export async function classifyMessage(text) {
  await manager.train();
  const lang = /[a-zA-Z]/.test(text) ? "en" : "ur";
  const result = await manager.process(lang, text);
  return result.answer || "❓ Couldn't understand the message.";
}

// Example usage
const test1 = await classifyMessage("salam app kesay haiN!");
const test2 = await classifyMessage("you suck");

console.log("Input: salam →", test1);
console.log("Input: you suck →", test2);
