require('dotenv').config();
const express = require('express');
const { classifyIntent, routeAndRespond } = require('./router');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'Prompt Router service is running!' });
});

app.post('/api/route', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Please provide a "message" field in the JSON body.' });
        }

        const intentData = await classifyIntent(message);
        const finalResponse = await routeAndRespond(message, intentData);

        res.json({
            original_message: message,
            classification: intentData,
            response: finalResponse
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
