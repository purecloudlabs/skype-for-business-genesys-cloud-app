import Ember from 'ember';
import moment from 'moment';

import Message from './message';

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
    extraConversations: null,
    latestConversation: null,

    attachedListeners: null,

    badgeCount: 0,
    messages: null,
    loadedHistory: false,

    deferred: null,
    _setupComplete: false,

    messageSortingAsc: ['sortComparison:asc'],
    sortedMessages: computed.sort('messages', 'messageSortingAsc'),

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
            return Ember.Object.create({
                name: RSVP.resolve(''),
                photoUrl: RSVP.resolve('')
            });
        }
        else {
            return this.get('store').getUserForPerson(person);
        }
    }),

    avatarUrl: computed('conversation', function () {
        const conversation = this.get('conversation');
        const avatarUrl = conversation.avatarUrlLarge();
        if (typeof avatarUrl === 'string') {
            return RSVP.resolve(avatarUrl);
        }

        return new RSVP.Promise(resolve => {
            conversation.avatarUrl.get().then(resolve);
        });
    }),

    conversationChange: observer('conversation', function () {
        run.once(this, this._setup);
    }),

    incomingExtraConversation: observer('extraConversations.[]', function () {
        const latest = this.get('extraConversations.lastObject');
        this.set('latestConversation', latest);

        run.once(this, this._setupMessageHandling, latest);
    }),

    init() {
        this._super(...arguments);

        this.set('messages', []);
        this.set('extraConversations', []);
        this.set('attachedListeners', []);

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

        this.set('latestConversation', conversation);

        this._setup();
    },

    clearUnreadState() {
        this.set('badgeCount', 0);
        this.get('messages').forEach(message => message.set('unread', false));
    },

    sendMessage(message) {
        this.clearUnreadState();
        this.get('latestConversation').chatService.sendMessage(message)
            .then(function () {
                Logger.log('Message sent.');
            });
    },

    loadMessageHistory() {
        if (!this.get('loadedHistory')) {
            this.get('deferred.promise').then(() => {
                this.get('conversation').historyService.getMoreActivityItems().then(() => {
                    Logger.log('History loaded', {
                        name: this.get('name'),
                        conversationId: this.get('conversation.id')
                    });
                    this.set('loadedHistory', true);
                });
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

        this._setupMessageHandling(conversation);
    },

    _setupMessageHandling(conversation) {
        if (this.get('attachedListeners').includes(conversation.id())) {
            return;
        }

        this.get('attachedListeners').addObject(conversation.id());

        conversation.chatService.messages.added(message => {
            Logger.log('chatService.messages.added', message);

            let model = MESSAGE_CACHE[ getCacheKey(message) ];
            if (model && model.get('sender') !== this.get('store.me')) {
                model.set('unread', true);
                this.incrementProperty('badgeCount');
            }
        });

        conversation.historyService.activityItems.added(message => {
            Logger.log('HISTORY', message);

            let sender = this.get('store').getUserForPerson(message.sender);

            if (message.type && message.type() !== 'TextMessage') {
                Logger.log('Unsupported message type:', {
                    message,
                    messageType: message.type()
                });
                return;
            }

            let messageModel = Message.create({
                sender,
                skypeMessage: message
            });

            MESSAGE_CACHE[ getCacheKey(message) ] = messageModel;

            Logger.log('conversation.historyService.activityItems.added', { message: messageModel });

            this.get('messages').pushObject(messageModel);
        });

        conversation.state.changed((newValue, reason, oldValue) => {
            Logger.log('conversation.state.changed', newValue, reason, oldValue);
        });
    }
});
