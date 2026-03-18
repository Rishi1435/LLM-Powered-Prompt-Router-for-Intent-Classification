require('dotenv').config();
const readline = require('readline');
const { classifyIntent, routeAndRespond } = require('./router');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Prompt Router service is running in CLI mode!");
console.log("Type your message below (or type 'exit' to quit):\n");

function askQuestion() {
    rl.question('You: ', async (message) => {
        if (message.trim().toLowerCase() === 'exit' || message.trim().toLowerCase() === 'quit') {
            console.log('Exiting...');
            rl.close();
            return;
        }

        if (!message.trim()) {
            console.log('System: Please provide a valid message.\n');
            askQuestion();
            return;
        }

        try {
            const intentData = await classifyIntent(message);
            const finalResponse = await routeAndRespond(message, intentData);

            console.log('\n--- Result ---');
            console.log(`Intent: ${intentData.intent}`);
            console.log(`Confidence: ${intentData.confidence}`);
            console.log(`Response:\n${finalResponse}`);
            console.log('--------------\n');
        } catch (error) {
            console.error("System Error:", error);
        }

        askQuestion();
    });
}

askQuestion();
