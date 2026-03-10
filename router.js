require('dotenv').config();
const fs = require('fs');
const { Groq } = require('groq-sdk');
const { SYSTEM_PROMPTS, CLASSIFIER_PROMPT } = require('./prompts');

const groq = new Groq({
    apiKey: process.env.OPENAI_API_KEY,
});

const LOG_FILE = 'route_log.jsonl';

function appendToLog(logEntry) {
    try {
        fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n', 'utf8');
    } catch (error) {
        console.error(`Error writing to log: ${error}`);
    }
}

async function classifyIntent(message) {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: CLASSIFIER_PROMPT },
                { role: "user", content: message }
            ],
            temperature: 0.0,
        });

        let replyContent = response.choices[0].message.content;

        if (replyContent.startsWith("```json")) {
            replyContent = replyContent.substring(7);
        } else if (replyContent.startsWith("```")) {
            replyContent = replyContent.substring(3);
        }
        if (replyContent.endsWith("```")) {
            replyContent = replyContent.substring(0, replyContent.length - 3);
        }

        const intentData = JSON.parse(replyContent.trim());

        if ('intent' in intentData && 'confidence' in intentData) {
            const validIntents = ['code', 'data', 'writing', 'career', 'unclear'];
            if (!validIntents.includes(intentData.intent)) {
                intentData.intent = 'unclear';
            }
            return intentData;
        } else {
            throw new Error("Missing 'intent' or 'confidence' keys in JSON");
        }

    } catch (error) {
        console.error(`Classification error: ${error.message}`);
        return { intent: "unclear", confidence: 0.0 };
    }
}

async function routeAndRespond(message, intentData) {
    const intentLabel = intentData.intent || 'unclear';
    const confidence = intentData.confidence || 0.0;

    let finalResponse = "";

    if (intentLabel === "unclear" || typeof SYSTEM_PROMPTS[intentLabel] === 'undefined') {
        finalResponse = "I'm not quite sure what you need. Are you asking for help with coding, data analysis, writing, or career advice?";
    } else {
        const systemPrompt = SYSTEM_PROMPTS[intentLabel];

        try {
            const response = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.7
            });
            finalResponse = response.choices[0].message.content;
        } catch (error) {
            finalResponse = `An error occurred while generating the expert response: ${error.message}`;
        }
    }

    const logEntry = {
        intent: intentLabel,
        confidence: confidence,
        user_message: message,
        final_response: finalResponse
    };
    appendToLog(logEntry);

    return finalResponse;
}

module.exports = {
    classifyIntent,
    routeAndRespond
};
