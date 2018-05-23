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

    hideMoreDetails: true,

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

                    if (error.code === 'CommandDisabled') {
                        // We are in a bad state, reload
                        window.location.reload();
                    } else if (error.errorDetails) {
                        this.set('errorDetails', error.errorDetails);
                    } else if (error.error && error.error_description) {
                        this.set('errorDetails', error);
                    }
                }).finally(() => this.set('authenticating', false));
        },

        toggleMoreErrorDetails() {
            this.toggleProperty('hideMoreDetails');
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

        if (error.code && error.code.toLowerCase() === 'oauthfailed') {
            if (/multiple user identities/.test(error.message)) {
                return this.get('intl').t('errors.auth.multipleIdentities');
            } else if (/no user is signed in/.test(error.message)) {
                return null;
            }
        }

        return this.get('intl').t('errors.auth.generalError');
    }),

    errorDetailsMessage: computed('errorDetails', function () {
        const details = this.get('errorDetails');
        if (!details) {
            return null;
        }

        const message = details.message || details.error_description;
        const code = details.code;

        if (code) {
            return `${code}: ${message}`;
        }

        return message;
    })
})
