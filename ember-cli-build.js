/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const CDN_URL = process.env.CDN_URL || '';

module.exports = function (defaults) {
    let app = new EmberApp(defaults, {
        sourcemaps: {
            enabled: true,
            extensions: ['js']
        },
        replace: {
            files: ['index.html'],
            patterns: [{
                match: 'CDN_URL',
                replacement: CDN_URL
            }]
        },
        "ember-cli-babel": {
            includePolyfill: true
        }
    });

    app.import('node_modules/localforage/dist/localforage.js');
    app.import('node_modules/@purecloud/purecloud-client-app-sdk/dist/purecloud-client-app-sdk.js');

    return app.toTree();
};
