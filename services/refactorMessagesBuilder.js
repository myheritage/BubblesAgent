const fs = require('fs');
const {createChatCompletion} = require('./openAi');
const {generateContent} = require('./vertexAi');
const config = require("../config.json");
const {generateClaudeContent} = require("./claudeAi");
const {ModelAdapter} = require('./modelAdapter');

class RefactorMessagesBuilder {
    constructor(refactorConfig) {
        this.messages = [];
        this.refactorConfig = refactorConfig;
        this.modelAdapter = new ModelAdapter(config.modelConfig.model_type);
    }

    async askFirstQuestion(fileContent) {
        const messages = this._buildInitialMessages(fileContent);
        return await this._askAI(messages);
    }

    async askAnotherQuestion(question) {
        const messages = this._addMessage("user", question);
        return await this._askAI(messages);
    }

    async _askAI(messages) {
        const modelFunction = this.modelAdapter.modelFactory();
        const answer = modelFunction(messages);
        this._addMessage("assistant", answer);
        return answer;
    }

    _buildInitialMessages(fileContent) {
        const {prompt, advanceOptions} = this.refactorConfig;
        const rolePrompt = config.modelConfig.rolePrompt;
        const userPrompt = rolePrompt + this._buildInitialPrompt(prompt, fileContent, advanceOptions)
        this._addMessage("user" , userPrompt);
        return this.messages;
    }

    _addMessage(role, text) {
        let msg = {};

        msg = this.modelAdapter.addMessage(role, text);
        this.messages.push(msg);
    }

    async _modelFactory(messages) {
        // Object to store different model type functions ChatGPT/Vertex/ClaudeAi
        const modelTypes = {
            ChatGPT: createChatCompletion,
            Vertex: generateContent,
            ClaudeAi: generateClaudeContent,
            // Add more types as needed
        };

        // Get the function based on the model_type
        const modelFunction = modelTypes[config.modelConfig.model_type];

        // If the function exists, call it with the config
        if (modelFunction) {
            return await modelFunction(messages);
        } else {
            throw new Error(`Unknown model type: ${config.model_type}`);
        }
    }

    _buildInitialPrompt(prompt, fileContent, advanceOptions) {
        let userPrompt = prompt;
        if (prompt.includes(".txt")) {
            userPrompt = fs.readFileSync(prompt, 'utf8', console.error);
        }

        if (advanceOptions?.useFilePath) {
            userPrompt = this._replaceAllFilePathWithContent(userPrompt);
        }
        userPrompt = userPrompt.concat(`\nFile:\n${fileContent}\n`);
        return userPrompt;
    }

    _replaceAllFilePathWithContent(prompt) {
        // Regular expression to match the specified structure
        const regex = /{"file_path":\s*"(.*?)"}/g;
        let matches;
        // Use regex.exec() in a loop to find all matches in the file
        while ((matches = regex.exec(prompt)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (matches.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // matches[1] contains the text inside the capturing group
            if (matches[1]) {

                let fileContentToReplace = fs.readFileSync(matches[1]);
                prompt = prompt.replace(matches[0], fileContentToReplace);
            }
        }

        return prompt;
    }
}

module.exports = {RefactorMessagesBuilder};