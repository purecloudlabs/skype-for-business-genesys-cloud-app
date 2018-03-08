import Ember from 'ember';

const {
    inject,
    Logger,
    Controller
} = Ember;

export default Controller.extend({
    auth: inject.service(),
    skype: inject.service(),

    actions: {
        startAuth() {
            const auth = this.get('auth');
            const skype = this.get('skype');

            auth.microsoftAuth()
                .then(() => skype.get('promise'))
                .then(() => skype.signIn())
                .then(() => {
                    Logger.log('done?', arguments);
                }).catch(error => {
                    Logger.error('Error authenticating:', { error });
                });
        }
    }
})
