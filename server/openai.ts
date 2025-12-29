import OpenAI from "openai";

// Uses OPENAI_API_KEY from environment variables
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "mock-key",
    dangerouslyAllowBrowser: true // Just in case used in client side (shouldn't be, but safe for now)
});
