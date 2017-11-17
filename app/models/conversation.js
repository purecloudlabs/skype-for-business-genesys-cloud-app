import Ember from 'ember';

const {
    inject,
    computed,
    run,
    RSVP,
    Logger
} = Ember;

export default Ember.Object.extend({

    skype: inject.service(),

    conversation: null,
    conversationTarget: null,

    messages: null,
    loadedHistory: false,

    name: computed.reads('conversationTarget.name'),

    init() {
        this._super(...arguments);

        this.set('messages', []);

        const conversation = this.get('conversation');
        if (!conversation) {
            Logger.error("Conversation model created without skype conversation model to wrap");
            return;
        }

        let deferred = RSVP.defer();
        this.set('loaded', deferred.promise);

        conversation.participants.added(person => {
            Logger.log("conversation.participants.added", person);

            this.set('conversationTarget', Ember.Object.create({
                id: person.uri(),
                name: person.displayName(),
                model: person
            }));
        });

        conversation.historyService.activityItems.added(message => {
            // message.direction();
            // message.timestamp();
            // message.text();
            // message.html();
            // message.sender.id(); // SIP URI

            // fetch the display name from UCWA


            // fetch the contact photo


            // subscribe to the sender's presence status
            // message.sender.availability.subscribe();
            // message.sender.availability.changed(status => {
            //     console.log(status);
            // });

            Logger.log('HISTORY', message);

            let messageModel = Ember.Object.create({
                direction: message.direction(),
                status: message.status(),
                text: message.text(),
                senderSip: message.sender.id(),
                timestamp: message.timestamp()
            });

            message.sender.displayName.get().then(name => {
                messageModel.set('senderName', name);
            });

            message.sender.avatarUrl.get().then(url => {
                messageModel.set('senderAvatar', url);
            });

            Logger.log("conversation.historyService.activityItems.added", messageModel);

            this.get('messages').pushObject(messageModel);
        });

        // turning off message events in favor of history events as an experiment.

        // conversation.chatService.messages.added(item => {
        //     console.log('MESSAGE', item);
        //     /*
        //     item.direction()
        //     "Incoming"
        //     item.html()
        //     "test"
        //     item.text()
        //     "test"
        //     item.status()
        //     "Succeeded"
        //     item.sender
        //     BaseModel {displayName: ƒ, id: ƒ}
        //     item.sender.displayName()
        //     "Keri Lawrence"
        //     item.sender.id()
        //     "sip:kerilawrence@teamshia.onmicrosoft.com"
        //      */
        //
        //     let messageModel = Ember.Object.create({
        //         direction: item.direction(),
        //         status: item.status(),
        //         text: item.text(),
        //         senderName: item.sender.displayName(),
        //         senderSip: item.sender.id(),
        //         timestamp: item.timestamp()
        //     });
        //     Logger.log("conversation.chatService.messages.added", messageModel, item);
        //
        //     this.get('messages').pushObject(messageModel);
        // });

        conversation.state.changed((newValue, reason, oldValue) => {
            Logger.log('conversation.state.changed', newValue, reason, oldValue);
        });

        run.once(() => deferred.resolve()); // until i work out how to load history
    },

    sendMessage(message) {
        this.get('conversation').chatService.sendMessage(message)
            .then(function () {
                Logger.log('Message sent.');
            });
    },

    loadMessageHistory() {
        if (!this.get('loadedHistory')) {
            this.get('conversation').historyService.getMoreActivityItems().then(() => {
                Logger.log('HISTORY LOADED');
                this.set('loadedHistory', true);
            });
        }
    }

});
