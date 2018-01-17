/* global localforage */
import Ember from 'ember';

const {
    inject,
    Route,
    Logger
} = Ember;

export default Route.extend({
    auth: inject.service(),

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
                this.get('auth').setTokenCookie(token, 'purecloud');
            } else if (cookie) {
                this.get('auth').validatePurecloudAuth(cookie);
            } else {
                this.get('auth').purecloudAuth();
            }
        }).then(() => {
            return this.get('auth').silentLogin().then(() => {
                let target = transition.targetName;
                this.transitionTo(target);
            });
        }).catch(error => {
            Logger.error('Error logging in silently', error);
            this.transitionTo('index');
        });
    }
});
