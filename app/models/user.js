import Ember from 'ember';
import PromiseObject from '../utils/promise-object';

const {
    inject,
    computed,
    RSVP
} = Ember;

export default Ember.Object.extend({
    auth: inject.service(),
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
            person.id.get()
                .then(() => {
                    this.set('id', person.id());
                    this.set('displayName', person.displayName());

                    return person.status.get()
                })
                .then(() => {
                    this.set('rawPresence', person.status());

                    return person.email ?
                        person.email.get() :
                        person.emails.get();

                })
                .then(([email]) => {
                    if (email && email.emailAddress) {
                        this.set('email', email.emailAddress());
                    } else {
                        this.set('email', person.email());
                    }

                    this.setupPhoto();
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
            return 'offline';
        }
    }),

    photoUrl: computed('email', function () {
        const email = this.get('email');
        if (!email) {
            return RSVP.resolve('');
        }
        const promise = this.get('ajax').request(`https://outlook.office.com/api/v2.0/Users/${email}/photo`)
            .then(photoDescriptor => {
                const avatarUrl = photoDescriptor['@odata.id'];
                const requestUrl = `${avatarUrl}/$value`;
                return fetch(requestUrl, {
                    method: 'GET',
                    headers: {
                        Authorization: `bearer ${this.get('auth.msftAccessToken')}`
                    }
                }).then(response => {
                    return response.blob();
                }).then(blob => {
                    return (window.URL || window.webkitURL).createObjectURL(blob);
                });
            });

        return PromiseObject.create({
            promise
        });
    }),

    subscribeToProperties() {
        let person = this.get('person');
        if (person.status) {
            person.status.changed(() => this.notifyPropertyChange('presence'));
        }
    }
});
