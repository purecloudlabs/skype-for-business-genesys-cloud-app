import Ember from 'ember';
import DS from 'ember-data';

const {
    inject,
    computed,
    Logger,
    Controller
} = Ember;

export default Controller.extend({
    auth: inject.service(),
    skype: inject.service(),

    authPromise: null,

    actions: {
        startAuth() {
            const auth = this.get('auth');
            const skype = this.get('skype');

            const promise = auth.microsoftAuth();
            this.set('authPromise', DS.PromiseObject.create({ promise }));
            promise
                .then(() => skype.get('promise'))
                .then(() => skype.signIn())
                .then(() => {
                    Logger.log('done?', arguments);
                }).catch(error => {
                    Logger.error('Error authenticating:', { error });
                });
        }
    },

    adminConsentUrl: computed.reads('auth.adminConsentUrl'),

    isAuthenticating: computed('authPromise', 'authPromise.isSettled', function () {
        return this.get('authPromise') && !this.get('authPromise.isSettled');
    }),

    closedPopup: computed('authPromise', 'authPromise.{reason,isRejected}', function () {
        if (this.get('authPromise.isRejected')) {
            const regex = /Popup Window closed/i;
            const reason = this.get('authPromise.reason');
            return regex.test(reason);
        }
        return false;
    })
})
