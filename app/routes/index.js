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
        const auth = this.get('auth');

        return auth.getToken('purecloud').then((cookie) => {
            if (tokenIndex !== -1) {
                const token = ref.substring(tokenIndex + 13, ref.indexOf('&'));
                auth.set('purecloudAccessToken', token);
                return auth.setToken('purecloud', token);
            } else if (cookie) {
                return auth.validatePurecloudAuth(cookie);
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
