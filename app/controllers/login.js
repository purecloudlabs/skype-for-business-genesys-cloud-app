import Ember from 'ember';
import PromiseObject from '../utils/promise-object';

const {
    inject,
    computed,
    Logger,
    Controller
} = Ember;

export default Controller.extend({
    intl: inject.service(),
    auth: inject.service(),
    skype: inject.service(),

    error: null,
    authPromise: null,

    actions: {
        startAuth() {
            const auth = this.get('auth');
            const skype = this.get('skype');

            const promise = auth.microsoftAuth();
            this.set('authPromise', PromiseObject.create({ promise }));
            this.set('authenticating', true);

            promise
                .then(() => skype.get('promise'))
                .then(() => skype.signIn())
                .then(() => this.set('authenticating', false))
                .then(() => this.transitionToRoute('conversation'))
                .catch(error => {
                    Logger.error('Error authenticating:', { error });
                    this.set('error', error);
                }).finally(() => this.set('authenticating', false));
        }
    },

    adminConsentUrl: computed.reads('auth.adminConsentUrl'),

    closedPopup: computed('authPromise', 'authPromise.{reason,isRejected}', function () {
        if (this.get('authPromise.isRejected')) {
            const regex = /Popup Window closed/i;
            const reason = this.get('authPromise.reason');
            return regex.test(reason);
        }
        return false;
    }),

    errorMessage: computed('error', function () {
        const error = this.get('error');
        if (!error) {
            return null;
        }

        if (error.code && error.code.toLowerCase() === 'oauthfailed' && /multiple user identities/.test(error.message)) {
            return this.get('intl').t('errors.auth.multipleIdentities');
        }

        return this.get('intl').t('errors.auth.generalError');
    })
})
