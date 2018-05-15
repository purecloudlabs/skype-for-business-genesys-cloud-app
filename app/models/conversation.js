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
    application: inject.service(),
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

        Logger.info('Incoming extra conversation', { conversation: latest });

        run(this, () => run.once(this, this._setupMessageHandling, latest));
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
        let newCount = this.get('store.totalUnreadCount') - this.get('badgeCount');
        if (newCount < 0) {
            newCount = 0;
        }
        this.set('store.totalUnreadCount', newCount);
        this.set('badgeCount', 0);
        this.get('application.clientApp').alerting.setAttentionCount(this.get('store.totalUnreadCount'));
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

    leave() {
        if (this.latestConversation) {
            this.latestConversation.leave();
        }
        if (this.conversation) {
            this.conversation.leave();
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

            const cacheKey = getCacheKey(message);
            let model = MESSAGE_CACHE[cacheKey];
            if (model && model.get('sender') !== this.get('store.me')) {
                model.set('unread', true);
                this._incrementBadgeCount();
            } else if (message.direction() === 'Incoming') {
                this._incrementBadgeCount();
            }
        });

        conversation.historyService.activityItems.added(message => {
            const cacheKey = getCacheKey(message);
            if (MESSAGE_CACHE[cacheKey]) {
                return;
            }

            Logger.log('History added:', { message });

            if (message.type && message.type() !== 'TextMessage') {
                Logger.log('Unsupported message type:', {
                    message,
                    messageType: message.type()
                });
                return;
            }

            let sender = this.get('store').getUserForPerson(message.sender);

            let messageModel = Message.create({
                sender,
                skypeMessage: message
            });

            MESSAGE_CACHE[cacheKey] = messageModel;

            Logger.log('conversation.historyService.activityItems.added', { message: messageModel });

            this.get('messages').pushObject(messageModel);
        });
    },

    _incrementBadgeCount() {
        this.incrementProperty('store.totalUnreadCount');
        this.incrementProperty('badgeCount');
        this.get('application').setAttentionCount(this.get('store.totalUnreadCount'));
    }
});
