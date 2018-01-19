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

    clientIds: {
        inindca: '9a529fd6-cb6c-4f8b-8fc9-e9288974f0c5',
        testshia: '160ab5d6-3d99-4fe9-bf94-0f96d5633b8f'
    },

    accessCode: null,
    msftAccessToken: null,
    purecloudAccessToken: null,

    purecloudAuthDeferred: null,
    MSALDeferred: null,

    init() {
        this._super(...arguments);

        const purecloudDeferred = RSVP.defer();
        this.set('purecloudAuthDeferred', purecloudDeferred);

        // Workaround for MSAL thinking we are authenticating with it instead of PureCloud
        const loginRequest = 'msal.login.request';
        window.localStorage.setItem(loginRequest, '');

        const logger = new Msal.Logger((logLevel, message) => {
            Ember.Logger.log('MSAL:', message);
        }, { level: Msal.LogLevel.Verbose });

        purecloudDeferred.promise.then(() => {
            this.userAgentApplication = new Msal.UserAgentApplication(this.get('appId'), null, (errDesc, token, error) => {
                const deferred = RSVP.defer();
                this.set('MSALDeferred', deferred);

                if (!error && token) {
                    this.userAgentApplication.acquireTokenSilent(this.get('scope')).then(token => {
                        Logger.info('Retrieved token', {
                            accessToken: token
                        });
                        this.set('msftAccessToken', token);
                        deferred.resolve(token);
                    });
                }
            }, {
                logger,
                cacheLocation: 'localStorage'
            });
        });
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
        if (!this.userAgentApplication) {
            return null;
        }
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

        this.userAgentApplication.acquireTokenSilent(this.get('scope')).then(() => {
            deferred.resolve();
            return;
        }).catch(error => {
            Logger.error('Error acquiring silent token', { error });
            this.userAgentApplication.loginPopup(this.get('scope')).then(token => {
                this.set('msftAccessToken', token);
                deferred.resolve();
            });
        });

        this.set('loginDeferred', deferred);
        deferred.resolve();
        return deferred.promise;
    },

    silentLogin() {
        if (!this.userAgentApplication) {
            return this.get('purecloudAuthDeferred').promise.then(() => {
                return this.silentLogin();
            });
        }

        if (this.userAgentApplication.getUser()) {
            return this.get('skype.promise').then(() => {
                this.get('skype').signIn();
            });
        }

        if (this.get('MSALDeferred')) {
            return this.get('MSALDeferred').promise;
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
        const clientId = this.get('clientIds.inindca');
        let client = platform.ApiClient.instance;
        client.setEnvironment('inindca.com');
        return client.loginImplicitGrant(clientId, redirectUri).then(() => {
            this.get('purecloudAuthDeferred').resolve();
        }).catch((err) => {
            Logger.error(err.error);
            return RSVP.reject(err);
        })
    },

    validatePurecloudAuth(token) {
        const platformClient = window.require('platformClient');
        const client = platformClient.ApiClient.instance;
        client.setEnvironment('inindca.com');
        client.authentications['PureCloud Auth'].accessToken = token;

        let apiInstance = new platformClient.UsersApi();

        return apiInstance.getUsersMe().then((data) => {
            Logger.log('auth confirmed', data);
            this.set('purecloudAccessToken', token);
            this.setTokenCookie(token, 'purecloud');

            this.get('purecloudAuthDeferred').resolve();

            return true;
        }).catch((err) => {
            Logger.error('AUTH ERROR', err);
            if (err.status === 401) {
                return this.purecloudAuth();
            }
            return false;
        });
    },

    setTokenCookie(token, type) {
        return localforage.setItem(`forage.token.${type}`, token).then(() => {
            this.get('purecloudAuthDeferred').resolve();

            Logger.log(`${type} cookie set`);
        });
    }
});
