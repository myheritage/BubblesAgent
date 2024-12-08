const fs = require('fs');
const path = require('path');
const {RefactorMessagesBuilder} = require('./refactorMessagesBuilder');
const {validateCodeContent} = require('../codeValidators');

async function writeOutputFile(path, fileContent) {
    await fs.writeFile(path, fileContent, ()=>{});
}

function replaceFileExtention(filePath, newExtention) {
    // Get the file's base name without the extension
    const baseName = path.basename(filePath, path.extname(filePath));
    // Join the new base name with the new extension to create the new file name
    const newFileName = `${baseName}.${newExtention}`;
    // Get the directory of the file
    const directory = path.dirname(filePath);
    // Create the new file path by joining the directory and the new file name
    return path.join(directory, newFileName);
}

async function refactorFile({filePath, fileContent, refactorConfig, codeValidatorsConfig}) {
    const {outputFileExtension, codeValidators} = refactorConfig.advanceOptions ?? {};
    console.log('Refactoring file: ' + filePath);
    const refactorMessagesBuilder = new RefactorMessagesBuilder(refactorConfig);
    let answer = await refactorMessagesBuilder.askFirstQuestion(fileContent);

    if(codeValidators && codeValidators.length > 0) {
        const validatorName = codeValidators[0];
        const validatorOptions = codeValidatorsConfig[validatorName];
        let tryNum = 0;
        let compileError;
        while (tryNum <= codeValidatorsConfig.maxRetries) {
            tryNum++;
            console.log(`Compiling with ${validatorName}, try num: ${tryNum}`);
            compileError = await validateCodeContent(validatorName, validatorOptions, answer, filePath);
            if(!compileError) {
                console.log('File compiled successfully!');
                break;
            }
            console.log('Opps, Compile error found, sorry :( \n', compileError);
            console.log('Refactoring again...');
            answer = await refactorMessagesBuilder.askAnotherQuestion(compileError);
        }
    }

    const outputFilePath = outputFileExtension ? replaceFileExtention(filePath, outputFileExtension) : filePath;
    answer && await writeOutputFile(outputFilePath, answer);
    console.log('Refactoring done!');
}

module.exports = {
    refactorFile,
};