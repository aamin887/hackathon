import OpenAI from "openai";
const client = new OpenAI({
  apiKey: import.meta.VITE_OPENAI_API_KEY,
});

const response = await client.responses.create({
  model: "gpt-5.4",
  input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);
