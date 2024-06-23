
async function validateCodeContent(validatorName, validatorOptions, fileContent, filePath) {
    if (validatorName === "babelCompile") {
        const {validateFileContentAsync} = require('./validators/babelCompile');
        return await validateFileContentAsync(fileContent, validatorOptions);
    }
    if (validatorName === "jestRunner") {
        const {runJestRunner} = require('./validators/jestRunner');
        return await runJestRunner(filePath, validatorOptions['jestConfigFolder']);
    }
    throw new Error(`Unknown validator: ${validatorName}`);
}

module.exports = {
    validateCodeContent,
};