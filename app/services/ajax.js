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
        /outlook.office.com/,
        /graph.microsoft.com/,
        /online.lync.com/,
        /api.(?:inindca|mypurecloud).(?:com|jp).?(?:ie|au)?/
    ],

    headers: computed('auth.msftAccessToken', function () {
        let headers = {};
        const token = this.get('auth.msftAccessToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    })
});
