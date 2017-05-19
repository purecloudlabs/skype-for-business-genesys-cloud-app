import Ember from 'ember';

const {
    inject,
    Component
} = Ember;

export default Component.extend({
    classNames: ['conversation-pane'],
    skype: inject.service(),

    conversation: null,

    init() {
        this._super(...arguments);
    },

    didInsertElement() {
        Ember.run.scheduleOnce('afterRender', this, this.renderConversation);
    },

    renderConversation() {
        const conversation = this.get('conversation');
        this.get('skype').api.renderConversation(this.element, { conversation });
    }
})
