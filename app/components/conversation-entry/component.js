import Ember from 'ember';
import PromiseObject from '../../utils/promise-object';

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

        return PromiseObject.create({ promise });
    })
});
