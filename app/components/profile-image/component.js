import Ember from 'ember';

const {
    computed,
    Component,
    inject
} = Ember;

const URL_CACHE = {

};

export default Component.extend({
    classNameBindings: ['person.presenceClass'],

    ajax: inject.service(),

    person: null,

    sip: null,
    photoUrl: null,
    // photoUrl: computed('sip', function () {
    //     const sip = this.get('sip');
    //
    //     if (!sip) {
    //         return '';
    //     }
    //
    //     let parts = sip.split('sip:');
    //     let id = parts[ parts.length - 1 ];
    //
    //     return `https://outlook.office.com/api/v2.0/Users/${id}/photo/$value`;
    // }),
    //
    // photoUrl: computed.reads('person.photoUrl'),

    showInitials: false,

    init() {
        this._super(...arguments);

        let sip = this.get('sip');
        sip = sip.split('sip:');
        sip = sip[ sip.length - 1 ];

        let request = this.get('ajax').request(`https://outlook.office.com/api/v2.0/Users/${sip}/photo`);

        request.then(photoDescriptor => {
            let avatarUrl = photoDescriptor["@odata.id"];
            avatarUrl += "/$value";

            this.set('photoUrl', avatarUrl);
        });
    }

    // didInsertElement() {
    //     this._super(...arguments);
    //
    //     this.$('img').on('load', event => {
    //         if (event.target.naturalHeight < 32) { // hax
    //             this.set('showInitials', true);
    //         }
    //     }).on('error', () => {
    //         this.set('showInitials', true);
    //     });
    // },
    //
    // initials: computed('person.displayName', function () {
    //     const name = this.get('person.displayName');
    //     if (!name) {
    //         return '';
    //     }
    //     const [first, last] = name.split(' ');
    //     return `${first.charAt(0)}${last.charAt(0)}`;
    // })
});
