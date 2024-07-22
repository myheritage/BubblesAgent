const { VertexAI } = require("@google-cloud/vertexai");
const credentials = require("./vertex-ai-creds.json");
const config = require("../config.json");
require('dotenv').config();


let vertex_ai;
let generativeModel;

async function generateContent(contents) {

  // This should happen only once
  if (!vertex_ai || !generativeModel) {
    // Initialize Vertex with your Cloud project and location
    vertex_ai = new VertexAI({
      project: process.env['VERTEX_YOUR_PROJECT'] ?? "your-project-id",
      location: process.env['VERTEX_YOUR_LOCATION'] ?? "your-location-id",
      googleAuthOptions: {credentials},
    });

    // Instantiate the models
    generativeModel = vertex_ai.preview?.getGenerativeModel({
      model: config?.modelConfig?.model_name,
    });
  }

  const result = await generativeModel.generateContent({contents});
  const response = result.response;
  return response.candidates[0].content.parts[0].text;
}

module.exports = { generateContent };