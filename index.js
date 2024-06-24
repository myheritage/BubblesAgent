const fs = require('fs');
const {refactorFile} = require('./services/refactorRunner');
const config = require('./config.json');

(async () => {
    const configName = process.argv[2] ?? "Accessify";
    const refactorConfig = config.RefactorsActions[configName];
    const codeValidatorsConfig = config.ValidatorsConfig;
    if (!refactorConfig) {
        let message = 'Unknown config, please select one of the following:\n';
        for (const key of Object.keys(refactorConfig)) {
            const option = `${key} - ${refactorConfig[key].description}`;
            message += option + '\n';
        }
        console.log(message);
        process.exit();
    }

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

async function refactorAllFiles(filesToRefactor, refactorConfig, codeValidatorsConfig) {
    for (const filePath of filesToRefactor) {
        console.log(`Progress: ${filesToRefactor.indexOf(filePath) + 1}/${filesToRefactor.length}`);
        const fileContent = getFileContent(filePath);
        await refactorFile({filePath, fileContent, refactorConfig, codeValidatorsConfig });
    }
}

//return all file pathes as array in a directory recursively based on regex and exclude by regex
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

