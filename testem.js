/* eslint-env node */
const config = require('ember-chromium').getTestemConfig();

config.disable_watching = true;
config.launch_in_ci = ['chromium_headless'];
config.launch_in_dev = ['chromium_headless'];

module.exports = config;
