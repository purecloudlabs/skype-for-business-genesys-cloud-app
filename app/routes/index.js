import Ember from 'ember';
import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const {
    Logger
} = Ember;

const localforage = window.localforage;

export default Route.extend({
    auth: service(),
    skype: service(),

    actions: {
        error() {
            return true;
        }
    },

    beforeModel() {
        localforage.config({
            name: 'pureSkype',
            version: 1.0,
            storeName: 'forage',
            description: 'Storing local preferences for the Skype for Business integration app'
        });

        const ref = window.location.href;
        const tokenIndex = ref.indexOf('access_token');
        const auth = this.get('auth');

        return localforage.getItem('forage.token.purecloud').then((cookie) => {
            if (tokenIndex !== -1) {
                const token = ref.substring(tokenIndex + 13, ref.indexOf('&'));
                auth.set('purecloudAccessToken', token);
                return auth.setTokenCookie(token, 'purecloud');
            } else if (cookie) {
                return auth.validatePurecloudAuth(cookie);
            } else {
                return auth.purecloudAuth();
            }
        }).catch(error => {
            Logger.error('Error grabbing purecloud auth info', { error });
            this.transitionTo('login');
        });
    },

    model() {
        return this.get('auth').silentLogin().then(() => {
            Logger.info('Silently logged in');
            return this.get('skype').get('promise');
        }).then(() => {
            return this.get('skype').signIn();
        }).then(() => {
            this.transitionTo('conversations');
        }).catch(error => {
            Logger.error('Error logging in silently', { error });
            return RSVP.reject(error);
        });
    }
})
