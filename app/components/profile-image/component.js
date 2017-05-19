import Ember from 'ember';

const {
    computed,
    Component
} = Ember;

export default Component.extend({
    classNameBindings: ['person.presenceClass'],
    person: null,

    photoUrl: computed.reads('person.photoUrl'),

    showInitials: false,

    didInsertElement() {
        this._super(...arguments);

        this.$('img').on('load', event => {
            if (event.target.naturalHeight < 32) { // hax
                this.set('showInitials', true);
            }
        }).on('error', () => {
            this.set('showInitials', true);
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
