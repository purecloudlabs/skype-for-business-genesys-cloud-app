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
        /online.lync.com/
    ],

    headers: computed('auth.{msftAccessToken,purecloudAccessToken}', function () {
        let headers = {};
        const msftToken = this.get('auth.msftAccessToken');
        if (msftToken) {
            headers['Authorization'] = `Bearer ${msftToken}`;
        }

        const pcToken = this.get('auth.purecloudAccessToken');
        if (pcToken) {
            headers['Purecloud Auth'] = `bearer ${pcToken}`;
            headers['inin-client-id'] = '#/person/5a2ab908b59b1d251b66b2ea';
        }

        return headers;
    })
});
