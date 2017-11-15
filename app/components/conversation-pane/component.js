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

    target: computed.alias('conversation.conversationTarget'),

    actions: {
        keyup({key, keyCode, shiftKey, target}) {
            if ((key === "Enter" || keyCode === 13) && !shiftKey) {
                let messageText = target.value;

                console.log("SEND", messageText);
                this.get('conversation').sendMessage(messageText);

                target.value = "";
            }
        }
    }
})
