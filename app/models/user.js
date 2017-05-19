import Ember from 'ember';

const {
    inject,
    computed
} = Ember;

export default Ember.Object.extend({
    ajax: inject.service(),
    skype: inject.service(),

    person: null,

    init() {
        this._super(...arguments);

        const person = this.get('person');

        person.id.get().then(() => this.set('id', person.id()));
        person.displayName.get().then(() => this.set('displayName', person.displayName()));
        person.avatarUrl.get().then(() => this.set('avatarUrl', person.avatarUrl()));
        if (!person.email) {
            person.emails.get().then(([email]) => this.set('email', email.emailAddress()));
        } else {
            person.email.get().then(() => this.set('email', person.email()));
        }

        this.subscribeToProperties();
        this.setupPhoto();
    },

    presence: computed(function () {
        const status = this.get('person').status();
        const map = {
            Online: 'Available',
            Busy: 'Busy',
            DoNotDisturb: 'Do Not Disturb',
            Away: 'Away'
        };

        if (map[status]) {
            return map[status];
        }

        return status;
    }),

    presenceClass: computed('presence', function () {
        return this.get('presence').toLowerCase();
    }),

    photoUrl: computed('email', function () {
        const email = this.get('email');
        if (!email) {
            return null;
        }
        return `https://outlook.office.com/owa/service.svc/s/GetPersonaPhoto?email=${email}&UA=0&size=HR64x64`
    }),

    setupPhoto() {
        const ajax = this.get('ajax');
        this.get('person').avatarUrl.get().then(() => {
            ajax.request(this.get('avatarUrl'), {
                headers: {
                    Authorization: `Bearer ${this.get('skype.authData.access_token')}`
                }
            });
        });
    },

    subscribeToProperties() {
        this.get('person').status.changed(() => this.notifyPropertyChange('presence'));
    }
});
