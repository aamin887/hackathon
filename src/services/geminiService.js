import { GoogleGenAI } from "@google/genai";

// import.meta.VITE_GEMINI_API_KEY,

const ai = new GoogleGenAI({
  apiKey: import.meta.VITE_GEMINI_API_KEY,
});

/**
 * Get a short, supportive message based on the user's mood.
 * @param {string} mood
 * @returns {Promise<string>}
 */
export const getMoodInsight = async (mood) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user has selected their current mood as "${mood}".
Provide a very short, supportive, and empathetic message (max 2 sentences).
The tone should be warm, non-judgmental, and wellness-focused.
Avoid medical advice.`,
      config: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
      },
    });

    console.log(response);

    return response?.text || "I'm here for you. Take a deep breath.";
  } catch (error) {
    console.error("Error getting mood insight:", error);
    return "Remember to be kind to yourself today. You're doing your best.";
  }
};

/**
 * Transcribe and summarize a voice note in base64 format.
 * Returns { transcription, summary }
 * @param {string} base64Audio
 * @param {string} mimeType
 * @returns {Promise<{transcription: string, summary: string}>}
 */

export const transcribeAndSummarizeAudio = async (base64Audio, mimeType) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Audio,
                mimeType,
              },
            },
            {
              text: `
              Context: You are a supportive trauma-informed assistant to help users who are experiencing emotional stress or secondary effects during a natural disaster

              Do not invent symptoms, facts, or organisations.

              Transcribe this voice note and provide a brief, supportive summary of the user's thoughts in second person terms and feelings expressed.
Format the response as JSON with "transcription" and "summary" fields.

              Do not`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",

        temperature: 0.9,
        topP: 0.95,
        topK: 40,
      },
    });

    const result = JSON.parse(response?.text || "{}");
    return {
      transcription: result.transcription || "Could not transcribe audio.",
      summary: result.summary || "No summary available.",
    };
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return {
      transcription: "Error processing audio.",
      summary: "I'm sorry, I couldn't process your voice note right now.",
    };
  }
};
