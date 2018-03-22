import Ember from 'ember';
import DS from 'ember-data';

const {
    computed,
    RSVP,
    Component
} = Ember;

export default Component.extend({
    conversation: null,

    didInsertElement() {
        this._super(...arguments);

        const conversation = this.get('conversation');
        conversation.historyService.activityItems.added(() => {});
    },

    displayName: computed('conversation', function () {
        const conversation = this.get('conversation');
        const promise = RSVP.resolve('Meeting');
        if (!conversation.isGroupConversation()) {
            return '';
        }

        return DS.PromiseObject.create({ promise });
    })
});
