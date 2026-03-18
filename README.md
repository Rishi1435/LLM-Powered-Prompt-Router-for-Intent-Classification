# LLM Prompt Router (Node.js)

This project is a Node.js service that intelligently routes user requests to specialized AI personas using a two-step LLM process (Classify, then Respond). It demonstrates intent-based routing to provide specialized, context-aware responses using the Groq API.

## Core Features
1. **Intent Classification**: Uses a fast LLM call to classify user intents into `code`, `data`, `writing`, `career`, or `unclear` and returns a JSON object with intent and confidence.
2. **Context-Aware Routing**: Routes the user's message to a specialized expert system prompt based on the classified intent.
3. **Graceful Handling of Unclear Intent**: If the intent is unclear or JSON parsing fails, the system safely asks the user a clarifying question instead of hallucinating.
4. **Structured JSONL Logging**: Logs all classifier inputs, outputs, classification confidence, and final responses to `route_log.jsonl`.

## Application Structure
- `package.json`: Contains project metadata and `groq-sdk` / `dotenv` dependencies.
- `prompts.js`: Defines the system personas (Code, Data, Writing, Career) and the classifier prompt.
- `router.js`: Contains the core `classifyIntent` and `routeAndRespond` functions, along with logging logic to `route_log.jsonl`.
- `testRunner.js`: A script containing 15 diverse test cases to evaluate the routing behavior out of the box.

## Setup Instructions

### Environment Setup
1. Copy `.env.example` to `.env`.
2. Add your `OPENAI_API_KEY` to the `.env` file (this key will securely pass through to initialize the Groq SDK).

### Running with Docker (Recommended)
You can run the predefined test cases using Docker Compose.

```bash
docker-compose up --build
```
This will build the Node.js alpine image, install dependencies, run `npm test` (which triggers `testRunner.js`), and create/append to `route_log.jsonl` in your current directory.

### Running Locally without Docker
Ensure you have Node.js (v18+) installed.

1. Install requirements:
   ```bash
   npm install
   ```
2. Run the test script:
   ```bash
   npm test
   ```

## Design Decisions
- **Two-Step Architecture**: We decouple intent detection from generation. The intent detection uses `llama-3.1-8b-instant` with `temperature=0.0` through Groq for highly deterministic, ultra-fast, JSON-only outputs. 
- **Robustness**: The classifier safely catches `JSON.parse` errors to default to `unclear` intent. It also strips potential markdown code blocks like ```json ... ``` from the LLM response to ensure clean JSON parsing.
- **Logging**: `route_log.jsonl` provides strong observability across all requests in a machine-readable format.

## Video Demonstration
[Watch the demo on YouTube](https://www.youtube.com/watch?v=eLH0wbHCXng)
