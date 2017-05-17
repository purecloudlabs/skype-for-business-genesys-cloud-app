import Ember from 'ember';

const {
    inject,
    Component
} = Ember;

export default Component.extend({
    skype: inject.service(),

    init() {
        this._super(...arguments);

        this.get('skype'); // dummy...
    }
})
