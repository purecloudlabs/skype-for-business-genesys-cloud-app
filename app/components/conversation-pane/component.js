import Ember from 'ember';

const {
    inject,
    computed,
    Logger,
    Component
} = Ember;

export default Component.extend({
    classNames: ['conversation-pane'],

    ajax: inject.service(),
    auth: inject.service(),
    store: inject.service(),
    conversation: computed.alias('store.activeConversation'),

    target: computed.alias('conversation.conversationTarget'),

    actions: {
        keyup({key, keyCode, shiftKey, target}) {
            if ((key === "Enter" || keyCode === 13) && !shiftKey) {
                let messageText = target.value;

                Logger.log("SEND", messageText);
                this.get('conversation').sendMessage(messageText);

                target.value = "";
            }
        },

        makeCall() {
            let platformClient = window.require('platformClient');
            const number = this.get('target.person').phoneNumbers().get('firstObject').displayString();

            platformClient.ApiClient.instance.setEnvironment('inindca.com');
            platformClient.ApiClient.instance.authentications['PureCloud Auth'].accessToken = this.get('auth.purecloudAccessToken');
            let apiInstance = new platformClient.ConversationsApi();
            let body = {
                phoneNumber: number,
            };

            apiInstance.postConversationsCalls(body).then((data) => {
                Logger.log('Call Made', data);
            }).catch((err) => {
                Logger.error('CALL ERROR', err);
            });
        }
    }
})
