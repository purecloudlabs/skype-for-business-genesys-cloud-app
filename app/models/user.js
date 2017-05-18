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
    },

    status: computed(function () {
        return this.get('me').status().toLowerCase();
    }),

    photoUrl: computed(function () {
        const email = this.get('email');
        return `https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=${email}&UA=0&size=HR64x64`;
    })
});
