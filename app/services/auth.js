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

    // appId: '18758f68-8cf8-4f32-8785-059d4cd2e62e',
    // appId: 'ec744ffe-d332-454a-9f13-b9f7ebe8b249',
    appId: '6dd45f0c-9db2-4c5b-93c3-3ff5c703184e',
    urls: {
        auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        grant: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    },

    accessCode: null,
    skypeAccessToken: null,
    purecloudAccessToken: null,

    init() {
        this._super(...arguments);

        // this.application = new window.Msal.UserAgentApplication(this.get('appId'));
    },

    isLoggedIn: computed.and('purecloudAccessToken', 'skypeAccessToken'),

    scope: computed(function () {
        return [
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
            response_type: 'code',
            nonce: 'msft',
            response_mode: 'fragment',
            scope: this.get('scope').join(' ')
        };

        return `${base}/?${objectToQueryParameters(data)}`;
    }),

    login() {
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

    silentLogin() {
        const skypeAccessToken = localStorage.getItem('skypeAccessToken');
        if (!skypeAccessToken) {
            return RSVP.reject('no access token');
        }

        Ember.run.once(this, this.set, 'skypeAccessToken', skypeAccessToken);
        return this.get('ajax').request('https://graph.microsoft.com/v1.0/me/', {
            headers: {
                Authorization: `Bearer ${skypeAccessToken}`
            }
        }).then(() => {
            Logger.info('logged in!');
            return this.get('skype.promise');
        }).then(() => {
            this.get('skype').signIn();
        }).catch(err => {
            Ember.run.once(this, this.set, 'skypeAccessToken', null);
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
            this.set('skypeAccessToken', res.access_token);
            window.localStorage.setItem('skypeAccessToken', res.access_token);
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
            console.log(`${type} cookie set`);
        });
    }
});
