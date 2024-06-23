const {exec} = require('child_process');
const {promisify} = require('util');
const execPromise = promisify(exec);

async function execCommand(cmd, options = {}) {
    // if this throws an error the promise will also be rejected
    try {
        const {stdout, stderr: output} = await execPromise(cmd, options);
        return output;
    } catch (error) {
        throw new Error(`There was an error with running the jest file: ${error}`);
    }
}

/**
 * Runs a Jest test file and returns the test result.
 * @param {string} testFilePath - The path to the Jest test file.
 * @returns {Promise<string>} The test result.
 */
async function runJestTest(testFilePath, jestConfigFolder) {
    let jestProcess = '';
    try {
        console.log("testFilePath", testFilePath);
        jestProcess = await execCommand(`npx jest ${testFilePath}`, {cwd: jestConfigFolder});
    } catch (error) {
        throw new Error(`The test failed: ${jestProcess}`);
    }
    if (jestProcess.includes('FAIL')) {
        throw new Error(`The test failed: ${jestProcess}`);
    } else {
        return (jestProcess);
    }
}

export function runJestRunner(testFilePath, jestConfigFolder) {
    runJestTest(testFilePath, jestConfigFolder)
        .then((testResult) => {
            console.log("File jest run passed: ", testResult);
            return null;
        }).catch((error) => {
        console.log('File jest run failed: ', error);
        // send the test to ai for refactor
        return error;
    });
}