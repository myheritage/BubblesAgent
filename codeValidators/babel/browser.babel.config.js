const base = require('./base.babel.config');

const browserBabelConfig = {
    presets: [...base.presets, [require.resolve('@babel/preset-env'), {modules: false}]],
    plugins: [...base.plugins, require.resolve('@babel/plugin-syntax-dynamic-import')],
};

module.exports = browserBabelConfig;
