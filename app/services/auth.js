/* global localforage */
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

    appId: 'ec744ffe-d332-454a-9f13-b9f7ebe8b249',
    urls: {
        auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        grant: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    },

    clientIds: {
        inindca: '9a529fd6-cb6c-4f8b-8fc9-e9288974f0c5',
        testshia: '160ab5d6-3d99-4fe9-bf94-0f96d5633b8f'
    },

    msftAccessToken: null,
    purecloudAccessToken: null,

    msftAuthDeferred: null,
    purecloudAuthDeferred: null,

    init() {
        this._super(...arguments);

        this.setProperties({
            msftAuthDeferred: RSVP.defer(),
            purecloudAuthDeferred: RSVP.defer()
        });

        this.authenticationContext = new window.AuthenticationContext({
            clientId: this.get('appId'),
            redirectUri: this.get('redirectUri'),
            popUp: true,
            cacheLocation: "localStorage",
            callback: (err, token) => {
                if (err) {
                    this.get('msftAuthDeferred').reject(err);
                    return;
                }

                Ember.Logger.info('Loaded token:', token);

                this.set('msftAccessToken', token);
                this.get('msftAuthDeferred').resolve(token);
            }
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

    redirectUri: computed(function () {
        return `${window.location.origin}${window.location.pathname}`;
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

    adminConsentUrl: computed(function () {
        const id = this.get('appId');
        const uri = `${window.location.origin}${window.location.pathname}`;
        return `https://login.microsoftonline.com/common/adminconsent?client_id=${id}&state=12345&redirect_uri=${uri}`;
    }),

    microsoftUser: computed('msftAccessToken', function () {
        if (!this.userAgentApplication) {
            return null;
        }
        return this.userAgentApplication.getUser();
    }),

    microsoftAuth() {
        this.authenticationContext.login();
        return this.get('msftAuthDeferred').promise;
    },

    silentLogin() {
        const deferred = RSVP.defer();
        this.authenticationContext.acquireToken('common', (err, token) => {
            if (err) {
                deferred.reject(err);
                return;
            }

            this.set('msftAccessToken', token);
            deferred.resolve(token);
        });
        return deferred.promise;
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
