import Ember from 'ember';
import Service from '@ember/service';
import ClientApp from '@purecloud/purecloud-client-app-sdk';

const {
    Logger
} = Ember;

// const { ClientApp } = window.require('purecloud-client-app-sdk');

const ENV_REG_EXP = /^s*(?:(localhost|localhost.mypurecloud.com)|([^:/?#\s]*)?(inin[dts]ca|mypurecloud)([^:/?#]+))(?::\d+)?(\/[^?#]*)?(?:\?|#.*)?s*$/i;

export default Service.extend({
    environment: null,
    clientApp: null,

    authenticatingInFrame() {
        const href = window.location.href;
        const tokenIndex = href.indexOf('access_token');
        const stateIndex = href.indexOf('session_state')
        const isPurecloudAuth = tokenIndex > 0 && stateIndex === -1;
        const isMicrosoftAuth = tokenIndex > 0 && stateIndex > 0;

        try {
            const inFrame = window.self !== window.top;
            if (window.location.hostname === 'localhost') {
                return (isPurecloudAuth || isMicrosoftAuth) && inFrame;
            }

            const parentLocation = window && window.top && window.top.location.host;
            return (isPurecloudAuth || isMicrosoftAuth) && inFrame && !ENV_REG_EXP.test(parentLocation);
        } catch (e) {
            return false;
        }
    },

    loadingInsideFrame() {
        try {
            const parentLocation = window && window.top && window.top.location.host;
            const inFrame = window.self !== window.top;

            return inFrame && !ENV_REG_EXP.test(parentLocation);
        } catch (e) {
            return false;
        }
    },

    setupClientApp() {
        if (this.clientApp) {
            return;
        }

        let env = this.get('environment');
        // let ClientApp = window.require('purecloud-client-app-sdk');
        if (!env) {
            this.clientApp = new ClientApp({
                pcOrigin: 'https://apps.inindca.com' // Local development hosted in DCA
            });
        } else {
            try {
                this.clientApp = new ClientApp({
                    pcEnvironment: env
                });
            } catch (err) {
                Logger.error('There was an error setting up the apps SDK. Notifications will not work.', { err });
            }
        }
    },

    setAttentionCount(count) {
        if (!this.clientApp) {
            return;
        }

        this.clientApp.alerting.setAttentionCount(count);
    }
});
