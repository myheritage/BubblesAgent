const { Configuration, OpenAIApi } = require('openai');
const config = require("../config.json");
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env['CHAT_GPT_API_KEY'],
});
const openai = new OpenAIApi(configuration);

async function createChatCompletion(messages) {
  try {
    const response = await openai.createChatCompletion({
      model: config.openAiConfig.model_name,
      messages,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log("Error in createChatCompletion:" , error , "\n Try to see if you forgot to add the API key in the config.json file.");
  }
}

module.exports = {
  createChatCompletion,
};
