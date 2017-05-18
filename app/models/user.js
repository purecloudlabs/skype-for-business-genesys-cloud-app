import Ember from 'ember';

const {
    computed
} = Ember;

export default Ember.Object.extend({
    me: null,

    init() {
        this._super(...arguments);

        const me = this.get('me');
        this.setProperties({
            id: me.id(),
            avatar: me.avatarUrl(),
            email: me.email(),
            displayName: me.displayName()
        });

        this.subscribeToProperties();
    },

    presence: computed(function () {
        const status = this.get('me').status();
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

    photoUrl: computed(function () {
        const email = this.get('email');
        return `https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=${email}&UA=0&size=HR64x64`;
    }),

    subscribeToProperties() {
        this.get('me').status.changed(() => this.notifyPropertyChange('presence'));
    }
});
