import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';

const {
    inject,
    computed
} = Ember;

export default AjaxService.extend({
    auth: inject.service(),

    contentType: 'application/json; charset=utf-8',

    trustedHosts: [
        /infra.lync.com/,
        /online.lync.com/,
        /graph.windows.net/,
        /outlook.office.com/,
        /graph.microsoft.com/,
        /api.(?:inindca|mypurecloud).(?:com|jp).?(?:ie|au)?/
    ],

    headers: computed('auth.msftAccessToken', function () {
        let headers = {};
        const msftToken = this.get('auth.msftAccessToken');
        if (msftToken) {
            headers['Authorization'] = `Bearer ${msftToken}`;
        }

        return headers;
    })
});
