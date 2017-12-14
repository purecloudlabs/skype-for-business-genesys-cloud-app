import Ember from 'ember';

const {
    run,
    observer,
    computed,
    Component,
} = Ember;

export default Component.extend({
    classNameBindings: [],

    person: null,
    showInitials: true,

    enablePresenceIndicator: true,

    didInsertElement() {
        this._super(...arguments);

        this.processPhoto();
    },

    initials: computed('person.fullName', function () {
        return this.get('person.fullName').then(name => {
            if (!name) {
                return '';
            }
            const [first, last] = name.split(' ');
            return `${first.charAt(0)}${last.charAt(0)}`;
        });
    }),

    processPhoto: observer('person.photoUrl', function () {
        this.get('person.photoUrl').then(url => {
            if (!url) {
                run.scheduleOnce('afterRender', this, this.set, 'showInitials', true);
            } else {
                run.scheduleOnce('afterRender', this, this.set, 'showInitials', false);
            }
        }).catch(() => {
            run.scheduleOnce('afterRender', this, this.set, 'showInitials', true);
        });
    })
});
