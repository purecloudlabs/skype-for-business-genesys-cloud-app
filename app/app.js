import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App = Application.extend({
    modulePrefix: config.modulePrefix,
    podModulePrefix: config.podModulePrefix,
    Resolver,

    init() {
        this._super(...arguments);

        window.App = this;

        // prevent file drag & drop from leaving the app
        window.addEventListener('drop', function(ev){
            ev.preventDefault();
        });
        window.addEventListener('dragover', function(ev){
            ev.preventDefault();
        });
        window.addEventListener('dragenter', function(ev){
            ev.preventDefault();
        });
    },

    serviceFor(name) {
        return this.__container__.lookup(`service:${name}`);
    },

    componentFor: function (id) {
        return this.__container__.lookup('-view-registry:main')[id];
    }
});

loadInitializers(App, config.modulePrefix);

export default App;
