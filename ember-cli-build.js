/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
    var app = new EmberApp(defaults, {
        sourcemaps: {
            enabled: true,
            extensions: ['js']
        },
    });

    app.import('bower_components/localforage/dist/localforage.js');

    return app.toTree();
};
