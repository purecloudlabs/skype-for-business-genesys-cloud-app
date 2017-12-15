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

        this.element
            .querySelector('img')
            .addEventListener('error', () =>
                run.scheduleOnce('afterRender', this, this.set, 'showInitials', true));
    },

    initials: computed('person.name', function () {
        return this.get('person.name').then(name => {
            if (!name) {
                return '';
            }
            const [first, last] = name.split(' ');
            return `${first.charAt(0)}${last.charAt(0)}`;
        });
    }),

    processPhoto: observer('person.photoUrl', function () {
        this.get('person.photoUrl').then(url => {
            run.scheduleOnce('afterRender', this, this.set, 'showInitials', !url);
        }).catch(() => {
            run.scheduleOnce('afterRender', this, this.set, 'showInitials', true);
        });
    })
});
