const { override, addWebpackModuleRule } = require('customize-cra');
const version = require('./package.json').version;
const buildFileName = `quiz`;

module.exports = override(
    (config) => {
    config.output = {
        ...config.output,
        filename: `${buildFileName}.js`,
    };
    config.plugins.map((plugin) => {
        if (plugin.options?.filename && plugin.options.filename.endsWith('.css')) {
            plugin.options.filename = `${buildFileName}.css`;
        }
        return plugin;
    });
    return config;
    }
);