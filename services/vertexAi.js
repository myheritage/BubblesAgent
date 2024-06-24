const { VertexAI } = require("@google-cloud/vertexai");
const credentials = require("./vertex-ai-creds.json");
const config = require("../config.json");

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: "<YOUR_PROJECT>",
  location: "<YOUR_LOCATION>",
  googleAuthOptions: { credentials },
});

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: config.vertexAiConfig.model,
});

async function generateContent(contents) {
  const result = await generativeModel.generateContent({contents});
  const response = result.response;
  return response.candidates[0].content.parts[0].text;
}

module.exports = { generateContent };

