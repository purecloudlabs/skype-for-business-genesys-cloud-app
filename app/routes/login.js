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

    beforeModel() {
        if (!this.get('auth.purecloudAccessToken')) {
            this.replaceWith('index');
        }

        if (this.get('application').authenticatingInFrame()){
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
