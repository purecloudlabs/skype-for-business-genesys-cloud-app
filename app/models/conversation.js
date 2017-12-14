import Ember from 'ember';
import moment from 'moment';

const {
    get,
    inject,
    computed,
    observer,
    run,
    RSVP,
    Logger
} = Ember;

const MESSAGE_CACHE = { };
const getCacheKey = message => `${moment(message.timestamp()).toISOString()}$$${message.text()}`;

export default Ember.Object.extend({
    store: inject.service(),
    skype: inject.service(),

    conversation: null,

    badgeCount: 0,
    messages: null,
    loadedHistory: false,

    deferred: null,
    _setupComplete: false,

    name: computed.reads('conversationTarget.name'),

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

    addMessage(message) {
        this.get('messages').pushObject(message);
    },

    sendMessage(message) {
        this.set('badgeCount', 0);
        this.get('conversation').chatService.sendMessage(message)
            .then(function () {
                Logger.log('Message sent.');
            });
    },

    loadMessageHistory() {
        if (!this.get('loadedHistory')) {
            this.get('deferred.promise').then(() =>
                this.get('conversation').historyService.getMoreActivityItems().then(() => {
                    Logger.log('History loaded', {
                        name: this.get('name'),
                        conversationId: this.get('conversation.id')
                    });
                    this.set('loadedHistory', true);
                }));
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

        conversation.chatService.messages.added(message => {
            console.log('chatService.messages.added', message);

            let model = MESSAGE_CACHE[ getCacheKey(message) ];
            if (model) {
                model.set('unread', true);
                this.incrementProperty('badgeCount');
            }
        });

        conversation.historyService.activityItems.added(message => {
            Logger.log('HISTORY', message);

            let messageModel = Ember.Object.create({
                direction: message.direction(),
                status: message.status(),
                text: message.text(),
                timestamp: moment(message.timestamp()),
                sender: this.get('store').getUserForPerson(message.sender)
            });

            MESSAGE_CACHE[ getCacheKey(message) ] = messageModel;

            Logger.log('conversation.historyService.activityItems.added', { message: messageModel });

            this.addMessage(messageModel);
        });

        conversation.state.changed((newValue, reason, oldValue) => {
            Logger.log('conversation.state.changed', newValue, reason, oldValue);
        });
    }
});
