import express from "express";
import dotenv from "dotenv";
import Groq from "groq-sdk";

import Flight from "../models/Flight.js";
import User from "../models/User.js";

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY?.trim(),
});

router.post("/chat", async (req, res) => {

  try {

    const { message, languageMode } = req.body;

    const lower = message.toLowerCase();

    const isDatabaseQuery =
      lower.includes("flight") ||
      lower.includes("gate") ||
      lower.includes("boarding") ||
      lower.includes("status") ||
      lower.includes("crew") ||
      lower.includes("passenger") ||
      lower.includes("maintenance") ||
      lower.includes("user");

    let databaseContext = "";

    if (isDatabaseQuery) {

      const flightMatch = message.toUpperCase().match(/AN\\d+/);

if (flightMatch) {

  const flightNumber = flightMatch[0];

  const flight = await Flight.findOne({
    flightNumber,
  });

  if (flight) {

    databaseContext = `
Flight Number: ${flight.flightNumber}
Gate: ${flight.gate}
Status: ${flight.status}
Departure: ${flight.departure}
Arrival: ${flight.arrival}
Time: ${flight.time}
    `;
  }
}
      
    }

    const completion = await groq.chat.completions.create({

      messages: [

        {
          role: "system",
content: `
You are AeroNexus AI.

You are a multilingual aviation operations assistant.

IMPORTANT RULES:

1. Always reply in the SAME language as the user.

2. Support:
- English
- Hindi
- Telugu
- Tamil
- Spanish
- French
- Arabic
- German
- Japanese
and other major languages.

3. If database contains answer:
reply directly using database truth.

4. Never hallucinate gates or flight data.

5. Keep aviation responses short and professional.

6. If user asks general AI questions:
answer intelligently like ChatGPT.

7. If information is not found:
say:
"Information not found in AeroNexus database."

Examples:

User:
AN614 की गेट क्या है?

Assistant:
फ्लाइट AN614 का गेट A28 है।

User:
¿Cuál es la puerta de AN614?

Assistant:
La puerta del vuelo AN614 es A28.
`,
        },{
  role: "system",
  content: `
You are AeroNexus AI.

You are an airport operations copilot.

VERY IMPORTANT RULES:

1. Database information is ALWAYS the source of truth.

2. NEVER ask unnecessary follow-up questions.

3. NEVER hallucinate flight information.

4. Keep answers short and professional.

Current language mode:
${languageMode}

IMPORTANT:
Always reply ONLY in the selected language.

If languageMode is:
- hindi → reply fully in Hindi
- telugu → reply fully in Telugu
- english → reply fully in English

Even if user types English letters,
continue replying in selected language.
`,
        },

        {
          role: "system",
          content: `
DATABASE INFORMATION:

${databaseContext}
          `,
        },

        {
          role: "user",
          content: message,
        },

      ],

      model: "llama-3.1-8b-instant",

    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "AI request failed",
    });

  }

});

export default router;