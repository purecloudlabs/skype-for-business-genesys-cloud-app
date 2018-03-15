/* global localforage */
import Ember from 'ember';

const {
    inject,
    Route,
    Logger
} = Ember;

export default Route.extend({
    auth: inject.service(),
    skype: inject.service(),

    beforeModel(transition) {
        localforage.config({
            name: 'pureSkype',
            version: 1.0,
            storeName: 'forage',
            description: 'Storing local preferences for the Skype for Business integration app'
        });

        let ref = window.location.href;
        let tokenIndex = ref.indexOf('access_token');

        return localforage.getItem('forage.token.purecloud').then((cookie) => {
            if (tokenIndex !== -1) {
                let token = ref.substring(tokenIndex + 13, ref.indexOf('&'));
                this.get('auth').set('purecloudAccessToken', token);
                return this.get('auth').setTokenCookie(token, 'purecloud');
            } else if (cookie) {
                return this.get('auth').validatePurecloudAuth(cookie);
            } else {
                return this.get('auth').purecloudAuth();
            }
        }).then(() => {
            return this.get('auth').silentLogin().then(() => {
                Logger.info('Silently logged in');
                return this.get('skype').get('promise');
            }).then(() => {
                return this.get('skype').signIn();
            });
        }).catch(error => {
            Logger.error('Error logging in silently', { error });
            this.transitionTo('index');
        });
    }
});
