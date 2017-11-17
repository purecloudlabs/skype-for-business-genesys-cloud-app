import Ember from 'ember';

const {
    inject,
    computed,
    RSVP
} = Ember;

export default Ember.Object.extend({
    ajax: inject.service(),
    skype: inject.service(),

    id: null,
    person: null,

    init() {
        this._super(...arguments);

        const person = this.get('person');

        let deferred = RSVP.defer();
        this.set('loaded', deferred.promise);

        if (typeof person.id.get === "function") {
            person.id.get().then(() => {
                this.set('id', person.id());
                this.set('displayName', person.displayName());

                person.status.get().then(() => this.set('rawPresence', person.status()));
                if (!person.email) {
                    person.emails.get().then(([email]) => {
                        this.set('email', email.emailAddress());
                        this.setupPhoto();
                    });
                } else {
                    person.email.get().then(() => {
                        this.set('email', person.email());
                        this.setupPhoto();
                    });
                }

                deferred.resolve(this);
            });
        } else {
            this.set('displayName', person.displayName);
            if (person.emails) {
                this.set('email', person.emails[0]);
            } else {
                this.set('email', person.email);
            }
            this.set('rawPresence', person.status);
            this.set('avatarUrl', person.avatarUrl);
            this.setupPhoto();

            deferred.resolve(this);
        }

        this.subscribeToProperties();
    },

    rawPresence: computed(function () {
        return 'Offline';
    }),

    presence: computed('rawPresence', function () {
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
        let presence = this.get('presence');
        if (presence) {
            return presence.toLowerCase();
        }
        else {
            return 'Offline';
        }
    }),

    photoUrl: "",

    setupPhoto() {
        let email = this.get('email');
        this.get('ajax').request(`https://outlook.office.com/api/v2.0/Users/${email}/photo`)
            .then(photoDescriptor => {
                let avatarUrl = photoDescriptor["@odata.id"];
                avatarUrl += "/$value";

                this.set('photoUrl', avatarUrl);
            });
    },

    subscribeToProperties() {
        let person = this.get('person');
        if (person.status) {
            person.status.changed(() => this.notifyPropertyChange('presence'));
        }
    }
});
