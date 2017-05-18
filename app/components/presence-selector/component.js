import Ember from 'ember';

const {
    inject,
    computed,
    Component
} = Ember;

export default Component.extend({
    presence: inject.service(),

    presences: computed.reads('presence.presences')
});
