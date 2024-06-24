const fs = require('fs');
const {createChatCompletion} = require('./openAi');
const {generateContent} = require('./vertexAi');
const config = require("../config.json");

class RefactorMessagesBuilder {
    constructor(refactorConfig, useVertexAI = false) {
        this.messages = [];
        this.refactorConfig = refactorConfig;
        this.useVertexAI = useVertexAI;
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
        if (this.useVertexAI) {
            const answer = await generateContent(messages);
            this._addMessage("model", answer);
            return answer;
        }
        const answer = await createChatCompletion(messages);
        this._addMessage("assistant", answer);
        return answer;
    }

    _buildInitialMessages(fileContent) {
        const {prompt, advanceOptions} = this.refactorConfig;
        const rolePrompt = config.openAiConfig.rolePrompt;
        const userPrompt = rolePrompt + this._buildInitialPrompt(prompt, fileContent, advanceOptions)
        this._addMessage("user" , userPrompt);
        return this.messages;
    }

    _addMessage(role, text) {
        let msg = {};
        if (this.useVertexAI) {
            msg = {role: role, parts: [{text: text}]};
        }
        else {
            msg = {role: role, content: text};
        };
        this.messages.push(msg);
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