const {createChatCompletion} = require("./openAi");
const {generateContent} = require("./vertexAi");
const {generateClaudeContent} = require("./claudeAi");

class ModelAdapter {
    constructor(model_type) {
        this.model_type = model_type;
    }

    addMessage(role, text) {
        const modelTypes = {
            "ChatGPT": (role, text) => ({role: role, content: text}),
            "Vertex": (role, text) => ({role: role, parts: [{text: text}]}),
            "ClaudeAi": (role, text) => ({role: role, content: JSON.stringify(text)}),
            // Add more types as needed
        };
        return modelTypes[this.model_type](role, text);
    }

    modelFactory() {
        // Object to store different model type functions ChatGPT/Vertex/ClaudeAi
        const modelTypes = {
            ChatGPT: createChatCompletion,
            Vertex: generateContent,
            ClaudeAi: generateClaudeContent,
            // Add more types as needed
        };

        // Get the function based on the model_type
        const modelFunction = modelTypes[this.model_type];

        // If the function exists, call it with the config
        if (modelFunction) {
            return modelFunction;
        } else {
            throw new Error(`Unknown model type: ${this.model_type}`);
        }
    }
}

module.exports = {ModelAdapter};