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
        /api.(?:inindca|mypurecloud).(?:com|jp).?(?:ie|au)?/
    ],

    headers: computed('auth.purecloudAccessToken', function () {
        let headers = {};
        const token = this.get('auth.purecloudAccessToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    })
});
