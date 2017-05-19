import Ember from 'ember';

const {
    computed,
    Component
} = Ember;

export default Component.extend({
    person: null,

    photoUrl: computed.reads('person.photoUrl'),

    showInitials: false,

    didInsertElement() {
        this._super(...arguments);

        this.$('img').on('load', event => {
            debugger;
        });
    },

    initials: computed('person.displayName', function () {
        const name = this.get('person.displayName');
        if (!name) {
            return '';
        }
        const [first, last] = name.split(' ');
        return `${first.charAt(0)}${last.charAt(0)}`;
    })
});
