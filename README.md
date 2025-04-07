# Bubbles Agent 

<p align="center">
  <img src="images/logo.png" width="150px" height="150px" alt="Bubbles Agent Logo - AI applying prompts to code"/>
</p>

<p align="center">
  <strong>Apply AI prompts (GPT, Gemini, Claude) to refactor or transform thousands of code files in one go.</strong>
</p>

<p align="center">
  </p>

Manually refactoring large codebases is time-consuming and error-prone. Bubbles Agent leverages the power of Large Language Models (LLMs) like OpenAI's GPT, Google's Gemini, and Anthropic's Claude to automate code transformations across multiple files based on your defined prompts and configurations.

Whether you need to modernize legacy code, enforce new standards, migrate APIs, or perform other large-scale modifications, Bubbles Agent provides a flexible framework to apply AI intelligence across your project.

## Key Features

* **Multi-LLM Support:** Works with **GPT (OpenAI)**, **Gemini (Google Vertex AI)**, and **Claude (Anthropic)**.
* **Batch Processing:** Apply prompts recursively to all matching files within a target directory.
* **Targeted Refactoring:** Filter files by extension (`targetFilesExtensionRegex`) and content (`contentConditionRegex`).
* **Flexible Prompts:** Use direct prompt strings or reference longer prompts from `.txt` files.
* **Code Validation:** Optionally validate AI-generated code using checks like Babel compilation or Jest tests (`codeValidators`).
* **Output Control:** Specify a different file extension for refactored output (`outputFileExtension`).
* **Example-Based Prompting:** (Optional) Provide `diff` examples or file paths to guide the LLM (`examples`).
* **Configurable:** Define multiple refactoring tasks within a central `config.json` file.

##  Prerequisites

* Node.js (specify version range if known, e.g., v18+)
* npm (comes with Node.js)
* API Keys for the desired AI services (OpenAI, Google Cloud/Vertex AI, Anthropic)

## 💾 Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/myheritage/BubblesAgent.git](https://www.google.com/search?q=https://github.com/myheritage/BubblesAgent.git)
    cd BubblesAgent
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    * Create a `.env` file in the root directory (copy from `.env.example` if provided).
    * Create a `vertex-ai-creds.json` file if using Vertex AI.

## ⚙️ Configuration

Configuration involves two main parts: setting up your AI provider(s) and defining your refactoring tasks.

### 1. AI Provider Setup

* **Select Model:** In `config.json`, set your desired LLM under `modelConfig`:
    ```json
    "modelConfig": {
      "model_type": "openai", // or "vertex_ai" or "anthropic"
      "model_name": "gpt-4" // Specific model name (e.g., "gpt-4", "gpt-3.5-turbo", "gemini-pro", "claude-2")
    },
    ```
* **API Keys & Credentials:**
    * **OpenAI (GPT):** Add your key to the `.env` file:
        ```env
        CHAT_GPT_API_KEY=your_openai_api_key
        ```
    * **Anthropic (Claude):** Add your key to the `.env` file:
        ```env
        ANTHROPIC_API_KEY=your_anthropic_api_key
        ```
    * **Google (Vertex AI / Gemini):**
        * Add your Google Cloud project ID and location to `config.json` under `vertexAiConfig`.
        * Place your service account key JSON content into the `vertex-ai-creds.json` file.

### 2. Refactoring Task Setup (`config.json`)

Define your refactoring tasks within the `RefactorsActions` object in `config.json`. Each key in this object represents a task name you can run.

Here's a breakdown of the fields for each task:

| Field                       | Description                                                                                                | Example                                          | Required |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------- | :----------------------------------------------- | :------- |
| `description`               | Human-readable description of the task (for clarity).                                                     | `"Convert class components to functional"`         | Yes      |
| `prompt`                    | The instructions for the LLM. Can be a direct string or a file path to a `.txt` file.                      | `"Refactor this React class component..."`       | Yes      |
| `targetDir`                 | Full path to the directory where files will be processed recursively.                                       | `"/path/to/your/project/src/components"`       | Yes      |
| `targetFilesExtensionRegex` | Regex pattern to match file extensions.                                                                    | `".*\\.js"` or `".*\\.tsx"`                     | Yes      |
| `contentConditionRegex`     | Regex pattern that file content *must* match to be processed. Use `".*"` to match any content.            | `"extends\\s+(React\\.)?(Pure)?Component\\s*{"` | Yes      |
| `advanceOptions`            | (Optional) An object for more advanced settings.                                                            | `{...}`                                          | No       |
| `advanceOptions.outputFileExtension` | (Optional) Save output with a new extension (e.g., `.refactored.js`). Keeps original file.          | `"refactored.js"`                                | No       |
| `advanceOptions.examples`   | (Optional) Provide examples to the LLM.                                                                   | `{ "useFilePath": true, "diffFile": "..." }`     | No       |
| `advanceOptions.examples.useFilePath` | (Optional) Boolean. If true, includes the file path in the prompt context.                         | `true`                                           | No       |
| `advanceOptions.examples.diffFile` | (Optional) Path to a file containing a `diff` formatted example for few-shot prompting.            | `"/path/to/example.diff"`                      | No       |
| `advanceOptions.codeValidators` | (Optional) Array of strings specifying validators to run on the output.                                  | `["babelCompile", "JestRunner"]`               | No       |

**Example Task Configuration (`config.json`):**

```json
{
  "modelConfig": { ... },
  "vertexAiConfig": { ... },
  "RefactorsActions": {
    "AccessifyReactComponents": {
      "description": "Add ARIA attributes to React class components for accessibility.",
      "prompt": "Make the following React component code fully accessible following WCAG 2 AA standards. Add necessary aria attributes and roles. Focus only on accessibility enhancements within the component structure.",
      "targetDir": "/Users/username/dev/my-project/src/components",
      "targetFilesExtensionRegex": ".*\\.react\\.js",
      "contentConditionRegex": "extends\\s+(React\\.)?(Pure)?Component\\s*{",
      "advanceOptions": {
        "codeValidators": ["babelCompile"]
      }
    },
    "AddComments": {
       "description": "Add JSDoc comments to functions",
       "prompt": "Add JSDoc comments explaining the purpose, parameters, and return value for the following Javascript function.",
       "targetDir": "/Users/username/dev/my-project/src/utils",
       "targetFilesExtensionRegex": ".*\\.js",
       "contentConditionRegex": "^\\s*export function\\s" // Target exported functions
    }
  }
}
