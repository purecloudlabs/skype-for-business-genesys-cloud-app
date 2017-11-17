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

    // appId: '18758f68-8cf8-4f32-8785-059d4cd2e62e',
    // appId: 'ec744ffe-d332-454a-9f13-b9f7ebe8b249',
    appId: '6dd45f0c-9db2-4c5b-93c3-3ff5c703184e',
    urls: {
        // auth: 'https://login.microsoftonline.com/common/oauth2/authorize',
        auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        grant: 'https://login.microsoftonline.com/common/oauth2/token'
    },

    idToken: null,
    accessToken: null,

    init() {
        this._super(...arguments);

        // this.application = new window.Msal.UserAgentApplication(this.get('appId'));
    },

    scope: computed(function () {
        return [
            'Calendars.ReadWrite',
            'Contacts.ReadWrite',
            'User.ReadBasic.All',
            'User.ReadWrite',
            'Mail.ReadWrite',
            'Mail.Send'
        ];
    }),

    authorizationUrl: computed('urls.auth', 'scope.[]', function () {
        const base = this.get('urls.auth');
        const data = {
            client_id: this.get('appId'),
            redirect_uri: window.location.href,
            response_type: 'code',
            nonce: 'msft',
            response_mode: 'fragment',
            // resource: 'https://webdir.online.lync.com',
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
                // const match = search.match(/id_token=(.*)&/);
                const match = search.match(/code=(.*)&/);
                if (match && match[1]) {
                    popup.close();
                    window.clearInterval(interval);

                    this.set('idToken', match[1]);
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
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            return RSVP.reject('no access token');
        }

        this.set('accessToken', accessToken);
        return this.get('ajax').request('https://graph.microsoft.com/v1.0/me/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(() => {
            Logger.info('logged in!');
        }).catch(err => {
            this.set('accessToken', null);
            return RSVP.reject(err);
        });
    },

    exchangeCodeForToken(code) {
        const data = {
            code,
            client_id: this.get('appId'),
            resource: 'https://graph.windows.net/',
            scope: this.get('scope').join(' '),
            redirect_uri: window.location.href,
            grant_type: 'authorization_code',
            client_secret: 'qGPJgoQgN7ZBc8iz65SVnD8qJ5gQGHh7q3y4rF0Kn/g='
        };

        return this.get('ajax').post(this.get('urls.grant'), {
            contentType: 'application/x-www-form-urlencoded',
            data
        }).then(res => {
            if (typeof res === 'string') {
                res = JSON.parse(res);
            }
            this.set('accessToken', res.access_token);
            window.localStorage.setItem('accessToken', res.access_token);
        });
    }
});
