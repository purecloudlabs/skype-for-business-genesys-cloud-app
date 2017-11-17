import Ember from 'ember';
import User from './user';

const {
    get,
    inject,
    computed,
    observer,
    run,
    RSVP,
    Logger
} = Ember;

export default Ember.Object.extend({
    store: inject.service(),
    skype: inject.service(),

    conversation: null,

    messages: null,
    loadedHistory: false,

    deferred: null,
    _setupComplete: false,

    name: computed.reads('conversationTarget.displayName'),

    loaded: computed('deferred.promise', function () {
        return this.get('deferred.promise');
    }),

    isReady: computed('_setupComplete', function () {
        return this.get('_setupComplete');
    }),

    conversationTarget: computed('conversation', function () {
        const person = get(this.get('conversation').participants(), 'firstObject.person');
        if (!person) {
            return {};
        }
        return this.get('store').getUserForPerson(person);
    }),

    conversationChange: observer('conversation', function () {
        run.once(this, this._setup);
    }),

    init() {
        this._super(...arguments);

        this.set('messages', []);
        this.set('deferred', RSVP.defer());

        const id = this.get('id');
        if (!id) {
            throw new Error('Conversation id is required.');
        }

        const conversation = this.get('conversation');
        if (!conversation) {
            Logger.warn('Conversation model created without skype conversation.');
            return;
        }

        this._setup();
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
    },

    _setup() {
        if (this.get('_setupComplete')) {
            return;
        }

        this.set('_setupComplete', true);

        const conversation = this.get('conversation');

        conversation.participants.added(person => {
            Logger.log('conversation.participants.added', person);
            this.notifyPropertyChange('conversationTarget');
            this.get('deferred').resolve();
        });

        conversation.historyService.activityItems.added(message => {
            Logger.log('HISTORY', message);

            let sender = this.get('store').getUserForPerson(message.sender);

            let messageModel = Ember.Object.create({
                direction: message.direction(),
                status: message.status(),
                text: message.text(),
                timestamp: message.timestamp(),
                sender
            });

            Logger.log("conversation.historyService.activityItems.added", messageModel);

            this.get('messages').pushObject(messageModel);
        });

        conversation.state.changed((newValue, reason, oldValue) => {
            Logger.log('conversation.state.changed', newValue, reason, oldValue);
        });
    }
});
