const { classifyIntent, routeAndRespond } = require('./router');

const TEST_CASES = [
    "how do i sort a list of objects in python?",
    "explain this sql query for me",
    "This paragraph sounds awkward, can you help me fix it?",
    "I'm preparing for a job interview, any tips?",
    "what's the average of these numbers: 12, 45, 23, 67, 34",
    "Help me make this better.",
    "I need to write a function that takes a user id and returns their profile, but also i need help with my resume.",
    "hey",
    "Can you write me a poem about clouds?",
    "Rewrite this sentence to be more professional.",
    "I'm not sure what to do with my career.",
    "what is a pivot table",
    "fxi thsi bug pls: for i in range(10) print(i)",
    "How do I structure a cover letter?",
    "My boss says my writing is too verbose."
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
    console.log("Starting tests...");

    for (let i = 0; i < TEST_CASES.length; i++) {
        const message = TEST_CASES[i];
        console.log(`\n--- Test ${i + 1}/${TEST_CASES.length} ---`);
        console.log(`Message: ${message}`);

        const intent = await classifyIntent(message);
        console.log(`Classified Intent: ${intent.intent} (Confidence: ${intent.confidence})`);

        const response = await routeAndRespond(message, intent);
        console.log(`Response snippet: ${response.substring(0, 150)}...\n`);

        await sleep(1000);
    }

    console.log("Tests complete. Check route_log.jsonl for output.");
}

runTests().catch(console.error);
