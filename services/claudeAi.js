const Anthropic = require("@anthropic-ai/sdk");
require('dotenv').config();

const anthropic = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});


async function generateClaudeContent(content, model_type = "claude-3-5-sonnet-20240620") {
    try {
        const result = await anthropic.messages.create({
            max_tokens: 4096,
            messages: content,
            model: 'claude-3-opus-20240229',
        });
    
        console.log("MAIII : ", result.content[0].text);
        return result.content[0].text;
    
    } catch (error) {
        console.error("Error in generateClaudeContent:", error);
    }

}
module.exports = { generateClaudeContent };