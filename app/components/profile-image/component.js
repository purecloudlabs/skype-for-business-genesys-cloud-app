import Ember from 'ember';

const {
    run,
    computed,
    Component,
} = Ember;

export default Component.extend({
    classNameBindings: [],

    person: null,
    showInitials: true,

    loading: false,
    enablePresenceIndicator: true,

    didInsertElement() {
        this._super(...arguments);

        this.set('loading', true);

        const img = this.element.querySelector('img');
        img.addEventListener('load', run.bind(this, () => {
            this.set('showInitials', false);
            this.set('loading', false);
        }));

        img.addEventListener('error', run.bind(this, () => {
            this.set('showInitials', true);
            this.set('loading', false);
        }));
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

    processPhoto() {
        this.get('person.photoUrl').then(url => {
            run.scheduleOnce('afterRender', this, this.set, 'showInitials', !url);
        }).catch(() => {
            run.scheduleOnce('afterRender', this, this.set, 'showInitials', true);
        });
    }
});
