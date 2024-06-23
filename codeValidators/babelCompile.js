const babel =  require("@babel/core");

function validateFileContentAsync(fileContent, options = {}) {
    return new Promise((resolve, reject) => {
        babel.transform(
            fileContent,
            {
                configFile: '../babel/browser.babel.config.js'
            },
            function(err, result) {
                resolve(err ? err.message : null);
            }
        )
    });
}

module.exports = {
    validateFileContentAsync,
};