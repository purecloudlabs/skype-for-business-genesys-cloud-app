/* global localforage, Msal */
import Ember from 'ember';

const {
    inject,
    computed,
    RSVP,
    Logger,
    Service
} = Ember;

function objectToQueryParameters(obj) {
    return Object.keys(obj).map(key => {
        const value = obj[key];
        return `${key}=${value}`;
    }).join('&');
}

export default Service.extend({
    ajax: inject.service(),
    skype: inject.service(),

    // appId: '18758f68-8cf8-4f32-8785-059d4cd2e62e',
    // appId: 'ec744ffe-d332-454a-9f13-b9f7ebe8b249',
    appId: '6dd45f0c-9db2-4c5b-93c3-3ff5c703184e',
    urls: {
        auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        grant: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    },

    accessCode: null,
    msftAccessToken: null,
    purecloudAccessToken: null,

    MSALDeferred: null,

    init() {
        this._super(...arguments);

        const logger = new Msal.Logger((logLevel, message) => {
            Ember.Logger.log('MSAL:', message);
        }, { level: Msal.LogLevel.Verbose });

        this.userAgentApplication = new Msal.UserAgentApplication(this.get('appId'), null, () => {
            const deferred = RSVP.defer();
            this.set('MSALDeferred', deferred);

            this.userAgentApplication.acquireTokenSilent(this.get('scope')).then(token => {
                this.set('msftAccessToken', token);
            });
        }, {
            logger,
            cacheLocation: 'localStorage'
        });

        window.auth = this;
    },

    isLoggedIn: computed.and('purecloudAccessToken', 'msftAccessToken'),

    scope: computed(function () {
        return [
            'openid',
            'Contacts.ReadWrite',
            'User.ReadBasic.All',
            'User.ReadWrite'
        ];
    }),

    authorizationUrl: computed('urls.auth', 'scope.[]', function () {
        const base = this.get('urls.auth');
        const data = {
            client_id: this.get('appId'),
            redirect_uri: `${window.location.origin}${window.location.pathname}`,
            response_type: 'id_token+token',
            nonce: 'msft',
            response_mode: 'fragment',
            scope: this.get('scope').join(' ')
        };

        return `${base}/?${objectToQueryParameters(data)}`;
    }),

    microsoftUser: computed('msftAccessToken', function () {
        return this.userAgentApplication.getUser();
    }),

    loginForCode() {
        const deferred = RSVP.defer();
        const url = this.get('authorizationUrl');
        const popup = window.open(url, 'auth', 'scrollbars=no,menubar=no,width=800,height=600');
        const interval = window.setInterval(() => {
            try {
                const search = popup.window.location.hash;
                const match = search.match(/code=(.*)&/);
                if (match && match[1]) {
                    popup.close();
                    window.clearInterval(interval);

                    this.set('accessCode', match[1]);
                    deferred.resolve(match[1]);
                }
            } catch (e) {
                // ignore
            }
        }, 10);
        this.set('loginDeferred', deferred);
        return deferred.promise;
    },

    loginMicrosoft() {
        const deferred = RSVP.defer();

        this.userAgentApplication.loginRedirect(this.get('scope'));

        this.set('loginDeferred', deferred);
        return deferred.promise;
    },

    silentLogin() {
        if (this.get('MSALDeferred')) {
            return this.get('MSALDeferred').promise;
        }

        if (this.userAgentApplication.getUser()) {
            return this.get('skype.promise').then(() => {
                this.get('skype').signIn();
            })
        }

        const msftAccessToken = localStorage.getItem('msftAccessToken');
        if (!msftAccessToken) {
            return RSVP.reject('no access token');
        }

        Ember.run.once(this, this.set, 'msftAccessToken', msftAccessToken);
        return this.get('ajax').request('https://graph.microsoft.com/v1.0/me/', {
            headers: {
                Authorization: `Bearer ${msftAccessToken}`
            }
        }).then(() => {
            Logger.info('logged in!');
            return this.get('skype.promise');
        }).then(() => {
            this.get('skype').signIn();
        }).catch(err => {
            Ember.run.once(this, this.set, 'msftAccessToken', null);
            return RSVP.reject(err);
        });
    },

    exchangeCodeForToken(code) {
        const data = {
            code,
            client_id: this.get('appId'),
            scope: this.get('scope').join(' '),
            redirect_uri: `${window.location.origin}${window.location.pathname}`,
            grant_type: 'authorization_code',
            client_secret: 'qbbaVO8>dmjRALXY8557<>-'
        };

        return this.get('ajax').post(this.get('urls.grant'), {
            contentType: 'application/x-www-form-urlencoded',
            data
        }).then(res => {
            if (typeof res === 'string') {
                res = JSON.parse(res);
            }
            this.set('msftAccessToken', res.access_token);
            window.localStorage.setItem('msftAccessToken', res.access_token);
        });
    },

    purecloudAuth() {
        const platform = window.require('platformClient');
        const redirectUri = `${window.location.origin}${window.location.pathname}`;
        const clientId = '9a529fd6-cb6c-4f8b-8fc9-e9288974f0c5';
        let client = platform.ApiClient.instance;
        client.setEnvironment('inindca.com');
        client.loginImplicitGrant(clientId, redirectUri).catch((err) => {
            Logger.error(err.error);
        })
    },

    setTokenCookie(token, type) {
        localforage.setItem(`forage.token.${type}`, token).then(() => {
            Logger.log(`${type} cookie set`);
        });
    }
});
