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

        conversation.chatService.messages.added(item => {
            /*
            item.direction()
            "Incoming"
            item.html()
            "test"
            item.text()
            "test"
            item.status()
            "Succeeded"
            item.sender
            BaseModel {displayName: ƒ, id: ƒ}
            item.sender.displayName()
            "Keri Lawrence"
            item.sender.id()
            "sip:kerilawrence@teamshia.onmicrosoft.com"
             */

            let messageModel = Ember.Object.create({
                direction: item.direction(),
                status: item.status(),
                text: item.text(),
                senderName: item.sender.displayName(),
                senderSip: item.sender.id(),
                timestamp: item.timestamp()
            });
            Logger.log("conversation.chatService.messages.added", messageModel, item);

            this.get('messages').pushObject(messageModel);
        });

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
    }

});
