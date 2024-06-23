module.exports = {
    presets: [require.resolve('@babel/preset-react')],
    plugins: [
        require.resolve('@babel/plugin-transform-flow-strip-types'),
        [require.resolve('babel-plugin-transform-builtin-extend'), {globals: ['Error', 'Array']}],
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
        [require.resolve('@babel/plugin-proposal-class-properties'), {loose: true}],
        [require.resolve('@babel/plugin-proposal-private-methods'), {loose: true}],
        [require.resolve('@babel/plugin-proposal-private-property-in-object'), {loose: true}],
    ],
};
