/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const CDN_URL = process.env.CDN_URL || '';

module.exports = function (defaults) {
    var app = new EmberApp(defaults, {
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
    });

    app.import('bower_components/localforage/dist/localforage.js');

    return app.toTree();
};
