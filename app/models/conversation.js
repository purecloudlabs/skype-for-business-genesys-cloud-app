import Ember from 'ember';
import User from './user';

const {
    inject,
    computed,
    getOwner,
    run,
    RSVP
} = Ember;

export default Ember.Object.extend({

    skype: inject.service(),

    conversation: null,
    conversationTarget: null,

    init() {
        this._super(...arguments);

        const conversation = this.get('conversation');
        if (!conversation) {
            console.error("Conversation model created without skype conversation model to wrap");
            return;
        }

        let deferred = RSVP.defer();
        this.set('loaded', deferred.promise);

        conversation.participants.added(person => {
            console.log("conversation.participants.added", person);

            this.set('conversationTarget', Ember.Object.create({
                id: person.uri(),
                name: person.displayName(),
                model: person
            }));
        });

        conversation.chatService.messages.added(item => {
            console.log("conversation.chatService.messages.added", item);
        });

        conversation.state.changed((newValue, reason, oldValue) => {
            console.log('conversation.state.changed', newValue, reason, oldValue);
        });

        run.once(() => deferred.resolve()); // until i work out how to load history
    }

});
