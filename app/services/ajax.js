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
        /graph.microsoft.com/
    ],

    headers: computed('auth.accessToken', function () {
        let headers = {};
        const token = this.get('auth.accessToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    })
});
