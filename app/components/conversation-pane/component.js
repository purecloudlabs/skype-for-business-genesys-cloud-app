import Ember from 'ember';

const {
    inject,
    computed,
    Component
} = Ember;

export default Component.extend({
    classNames: ['conversation-pane'],

    store: inject.service(),
    conversation: computed.alias('store.activeConversation'),
})
