import Ember from 'ember';
import { inject as service } from '@ember/service'
import Route from '@ember/routing/route';

const localforage = window.localforage;

export default Route.extend({
    intl: service(),
    application: service(),

    actions: {
        loading() {
            return true;
        },
        error(error) {
            if (typeof error === 'string' && /User login is required/.test(error)) {
                this.replaceWith('login');
                return;
            }

            const login = this.controllerFor('login');
            login.set('error', error);
            this.replaceWith('login');
        }
    },

    beforeModel() {
        this.extractSDKParams();
        this.get('application').setupClientApp();

        this.get('intl').setLocale(['en-us']);

        localforage.config({
            name: 'purecloud-skype',
            version: 1.0,
            storeName: 'forage',
            description: 'Storing local preferences for the Skype for Business integration app'
        });

        return localforage.ready();
    },

    extractSDKParams() {
        let environment = '';
        const { search, hostname } = window.location;

        // Parse environment from query params provided by apps framework
        if (search) {
            try {
                const parameters = {};
                search.substr(1).split('&').forEach(param => {
                    const [key, value] = param.split('=');
                    parameters[key] = value;
                });

                if (parameters.pcEnvironment) {
                    environment = parameters.pcEnvironment;
                }

            } catch (error) {
                Ember.Logger.error('Error parsing SDK parameters:', {error});
            }
        }

        // default to url parsing when query params fails
        if (!environment) {
            // dca
            if (hostname === 'apps.inindca.com') {
                environment = 'inindca.com';
            } else if (hostname === 'localhost') {
                environment = 'inindca.com';
            }
            // tca
            else if (hostname === 'apps.inintca.com') {
                environment = 'inintca.com';
            }
            // prod
            else {
                let [, host] = hostname.split('apps.');
                environment = host;
            }
        }

        if (environment) {
            this.get('application').set('environment', environment);
        }
    }
});
