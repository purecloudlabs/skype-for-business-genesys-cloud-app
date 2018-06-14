import Ember from 'ember'
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    auth: service(),
    skype: service(),
    application: service(),
    traceLogger: service(),

    disableSilentLogin: true,

    beforeModel() {
        if (this.disableSilentLogin) {
            this.get('application.clientApp').alerting.setAttentionCount(1);    //remove this when login stuff works
            return;
        }

        if (!this.get('auth.purecloudAccessToken')) {
            this.replaceWith('index');
        }

        const application = this.get('application');
        if (application.authenticatingInFrame() || application.loadingInsideFrame()) {
            Ember.Logger.info('routes/login', 'Authenticating inside iframe');
            return;
        }

        return this.get('auth').silentLogin().then(() => {
            Ember.Logger.info('routes/login', 'Silently logged in');
            return this.get('skype').get('promise');
        }).then(() => {
            return this.get('skype').signIn();
        }).then(() => {
            this.transitionTo('conversation');
        }).catch(error => {
            this.get('traceLogger').error('routes/login', 'Error logging in silently', { error });
        });
    }
})
