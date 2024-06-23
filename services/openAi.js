const { Configuration, OpenAIApi } = require("openai");
const config = require("../config.json");

const configuration = new Configuration({
  apiKey: config.openAiConfig.apiKey,
  organization: config.openAiConfig.organization,
});

async function createChatCompletion(messages) {
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    ...config.openAiConfig.chatConfig,
    messages,
  });
  return response.data.choices[0].message.content;
}

module.exports = {
  createChatCompletion,
};
