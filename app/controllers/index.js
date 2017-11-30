import Ember from 'ember';

const {
    inject,
    Controller
} = Ember;

export default Controller.extend({
    auth: inject.service(),

    skype: inject.service(),
    //
    // loading: false,
    //
    // init() {
    //     this.set('loading', true);
    //
    //     this.get('skype').startAuthentication().then(() => {
    //         this.set('loading', false);
    //     });
    // }
    actions: {
        startAuth() {
            const auth = this.get('auth');
            const skype = this.get('skype');

            auth.loginMicrosoft()
                .then(token => {
                    Ember.Logger.log('TOKEN:', token);
                })
                .then(() => skype.get('promise'))
                .then(() => skype.signIn())
                .then(() => {
                    Ember.log('done?', arguments);
                }).catch(error => {
                    Ember.Logger.error('Error authenticating:', { error });
                });
        }
    }
})
