import Ember from 'ember';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const {
    Logger
} = Ember;

export default Route.extend({
    auth: service(),
    skype: service(),

    actions: {
        error() {
            return true;
        }
    },

    beforeModel() {
        const ref = window.location.href;
        const tokenIndex = ref.indexOf('access_token');
        const stateIndex = ref.indexOf('session_state')
        const auth = this.get('auth');

        const isPurecloudAuth = tokenIndex > 0 && stateIndex === -1;
        const isMicrosoftAuth = tokenIndex > 0 && stateIndex > 0;

        if ((isPurecloudAuth || isMicrosoftAuth) && window.self !== window.top) {
            Logger.debug('Authenticating inside iframe');
            return;
        }

        return auth.getToken('purecloud').then(cachedToken => {
            if (cachedToken) {
                return auth.validatePurecloudAuth(cachedToken);
            } else if (isPurecloudAuth) {
                const token = ref.substring(tokenIndex + 13, ref.indexOf('&'));
                auth.set('purecloudAccessToken', token);
                return auth.setToken('purecloud', token);
            } else {
                return auth.purecloudAuth();
            }
        }).then(() => {
            this.transitionTo('login');
        }).catch(error => {
            Logger.error('Error grabbing purecloud auth info', { error });
            this.transitionTo('login');
        });
    }
})
