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

            auth.login()
                .then(token => {
                    console.log('TOKEN:', token);
                    return auth.exchangeCodeForToken(token);
                })
                .then(() => skype.get('promise'))
                .then(() => skype.signIn())
                .then(() => {
                    console.log('done?', arguments);
                });
        }
    }
})
