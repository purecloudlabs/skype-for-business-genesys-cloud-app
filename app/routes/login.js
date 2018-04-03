import Ember from 'ember'
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const {
    Logger
} = Ember;

export default Route.extend({
    auth: service(),
    skype: service(),
    application: service(),

    disableSilentLogin: true,

    beforeModel() {
        if (this.disableSilentLogin) {
            return;
        }

        if (!this.get('auth.purecloudAccessToken')) {
            this.replaceWith('index');
        }

        const application = this.get('application');
        if (application.authenticatingInFrame() || application.loadingInsideFrame()) {
            Logger.info('Authenticating inside iframe');
            return;
        }

        return this.get('auth').silentLogin().then(() => {
            Logger.info('Silently logged in');
            return this.get('skype').get('promise');
        }).then(() => {
            return this.get('skype').signIn();
        }).then(() => {
            this.transitionTo('conversation');
        }).catch(error => {
            Logger.error('Error logging in silently', { error });
        });
    }
})
