const fs = require('fs');
const {refactorFile} = require('./services/refactorRunner');
const config = require('./config.json');
const {isAbsolute} = require("node:path");

(async () => {
    const configName = process.argv[2] ?? "Accessify";
    const refactorConfig = validateConfig(config.RefactorsActions[configName]);
    const codeValidatorsConfig = config.ValidatorsConfig;
    const {targetFilesExtensionRegex, contentConditionRegex, targetDir} = refactorConfig;
    const filesToRefactor = getFilesToRefactor(targetFilesExtensionRegex, contentConditionRegex, targetDir);
    if(filesToRefactor.length === 0) {
        console.log('No files found');
        process.exit();
    }

    await refactorAllFiles(filesToRefactor, refactorConfig, codeValidatorsConfig);
})().catch(error => {
    console.error(error, error.stack);
});

function validateConfig(refactorConfig) {
    function isFilePath(str) {
        return isAbsolute(str) || str.startsWith('./') || str.startsWith('../');
    }

    if (!refactorConfig) {
        let message = 'Unknown config, please select one of the following:\n';
        for (const key of Object.keys(refactorConfig)) {
            const option = `${key} - ${refactorConfig[key].description}`;
            message += option + '\n';
        }
        console.log(message);
        process.exit();
    }

    // If the prompt seems like a file path, then we expect it to be a file
    const prompt = refactorConfig.prompt;
    if (!prompt || prompt.trim() === "") {
        console.log("Prompt can't be empty");
        process.exit();
    }
    if (isFilePath(prompt) && !fs.existsSync(prompt)) {
        console.log("Prompt is a file path but the file does not exist: " + prompt);
        process.exit();
    }

    return refactorConfig;
}

async function refactorAllFiles(filesToRefactor, refactorConfig, codeValidatorsConfig) {
    const concurrency = refactorConfig?.concurrency ?? 1;

    let activeWorkers = 0;
    let index = 0;

    return new Promise((resolve, reject) => {
        const next = async () => {
            if (index >= filesToRefactor.length) {
                if (activeWorkers === 0) resolve(); // All tasks are done
                return;
            }

            const filePath = filesToRefactor[index++];
            activeWorkers++;
            const progressMessage = `Progress: ${index}/${filesToRefactor.length}`;

            try {
                const fileContent = getFileContent(filePath);
                await refactorFile({ filePath, fileContent, refactorConfig, codeValidatorsConfig, progressMessage });
            } catch (error) {
                reject(error); // Stop execution if an error occurs
            } finally {
                activeWorkers--;
                next(); // Start next file immediately after one finishes
            }
        };

        // Start initial workers
        for (let i = 0; i < Math.min(concurrency, filesToRefactor.length); i++) {
            next();
        }
    });
}


//return all file paths as array in a directory recursively based on regex and exclude by regex
function getFiles(dir, regex = /.*/, exclude = /node_modules/) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file, regex, exclude));
        } else {
            if (regex.test(file) && !exclude.test(file)) {
                results.push(file);
            }
        }
    });
    return results;
}

 function getFileContent(path) {
    return fs.readFileSync(path, 'utf8', console.error);
}

function getFilesToRefactor(pattern, condition, directory) {
    const matchFileRegx = new RegExp(pattern);
    const refactorConditionRegx = new RegExp(condition);
    const filesToRefactor = getFiles(directory, matchFileRegx).filter(filePath => {
        const fileContent = getFileContent(filePath);
        const shouldRefactor = refactorConditionRegx.test(fileContent);
        return shouldRefactor;
    });
    return filesToRefactor;
}

