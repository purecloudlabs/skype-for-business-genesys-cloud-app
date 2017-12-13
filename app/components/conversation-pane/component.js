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
            // const number = this.get('target.person').id();

            platformClient.ApiClient.instance.setEnvironment('inindca.com');
            platformClient.ApiClient.instance.authentications['PureCloud Auth'].accessToken = this.get('auth.purecloudAccessToken');
            let apiInstance = new platformClient.ConversationsApi();
            let body = {
                phoneNumber: number,
            };

                // Purecloud SDK version
            // apiInstance.postConversationsCalls(body).then((data) => {
            //     Logger.log('Call Made', data);
            // }).catch((err) => {
            //     Logger.error('CALL ERROR', err);
            // });


            this.get('ajax').post('https://api.inindca.com/api/v2/conversations/calls', {
                'headers': {
                    'authorization': `bearer ${this.get('auth.purecloudAccessToken')}`,
                    'inin-client-path': '#/person/5a2ab908b59b1d251b66b2ea'
                },
                'data': {
                    'phoneNumber': number
                },
                'content-type': 'application/json'
            }).then((data) => {
                Logger.log('Call Made', data);
            }).catch((err) => {
                Logger.error('CALL ERROR', err);
            });

            // $.post('https://api.inindca.com/api/v2/conversations/calls', {
            //     headers: {
            //         authorization: `bearer ${this.get('auth.purecloudAccessToken')}`,
            //         'inin-client-path': '#/person/5a2ab908b59b1d251b66b2ea'
            //     },
            //     data: {
            //         phoneNumber: number
            //     },
            //     type: 'POST',
            //     contentType: 'application/json'
            // }).then((data) => {
            //     Logger.log('Call Made', data);
            // }).catch((err) => {
            //     Logger.error('CALL ERROR', err);
            // });
        }
    }
})
