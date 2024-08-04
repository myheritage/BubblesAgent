const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
});

async function generateClaudeContent(content, model_type = 'claude-3-opus-20240229') {
    try {
        const result = await anthropic.messages.create({
            max_tokens: 4096, // This is the maximum number of tokens that can be generated
            messages: content,
            model: model_type,
        });
        return result.content[0].text;
    } catch (error) {
        console.error('Error in generateClaudeContent:', error);
    }
}
module.exports = {generateClaudeContent};
