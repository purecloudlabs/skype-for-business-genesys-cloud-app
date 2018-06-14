import Ember from 'ember';
import { EVENTS } from './skype';
import Conversation from '../models/conversation';
import User from '../models/user';

const {
    inject,
    getOwner,
    Service,
} = Ember;

export default Service.extend({
    skype: inject.service(),

    me: null,
    users: null,
    contacts: null,
    conversations: null,
    activeConversation: null,

    totalUnreadCount: 0,

    init() {
        this._super(...arguments);

        this.set('users', []);
        this.set('contacts', []);
        this.set('conversations', []);

        this.setupSkype();
    },

    setupSkype() {
        if (Ember.testing) {
            return;
        }

        const skype = this.get('skype');
        skype.on(EVENTS.signIn, this.signIn.bind(this));
        skype.on(EVENTS.personAdded, this.getUserForPerson.bind(this));
        skype.on(EVENTS.conversationAdded, this.addConversation.bind(this));
        skype.on(EVENTS.groupAdded, this.addGroup.bind(this));
    },

    signIn(user) {
        Ember.Logger.log('services/store', 'signIn', { user });

        let me = this.getUserForPerson(user);
        this.set('me', me);
    },

    addConversation(conversation) {
        Ember.Logger.debug('services/store', 'addConversation', { conversation });

        const model = this.getConversation(conversation.id(), conversation);
        if (!this.get('activeConversation')) {
            this.setActiveConversation(model);
        }

        conversation.state.changed((newValue, reason, oldValue) => {
            Ember.Logger.debug('services/store', 'conversation.state.changed', {
                conversation,
                event: { newValue, reason, oldValue }
            });

            if (newValue && newValue.toLowerCase() === 'disconnected') {
                // Maybe display message to user that conversation got disconnected?
                // this.endConversation(model);
            }
        });
    },

    addGroup() {
        Ember.Logger.debug('services/store', 'addGroup - ', arguments);
    },

    setActiveConversation(conversation) {
        Ember.Logger.debug('services/store', 'setActiveConversation', { conversation });

        if (conversation !== this.get('activeConversation')) {
            this.set('activeConversation', conversation);
        }

        if (conversation) {
            conversation.loadMessageHistory();
        }
    },

    getConversation(id, skypeConversation = null) {
        const conversations = this.get('conversations');
        let conversation = conversations.findBy('id', id);
        if (!conversation) {
            // Lets check if the conversation has a user
            conversation = this.getConversationForUser({
                id: skypeConversation.creator.id()
            }, false);

            if (conversation) {
                conversation.get('extraConversations').pushObject(skypeConversation);
            } else {
                conversation = Conversation.create({
                    id,
                    conversation: skypeConversation
                }, getOwner(this).ownerInjection());
                this.get('conversations').addObject(conversation);
            }
        }
        if (!conversation.get('conversation') && skypeConversation) {
            conversation.set('conversation', skypeConversation);
        }

        return conversation;
    },

    getConversationForUser(user, fallback = true) {
        const conversation = this.get('conversations').findBy('conversationTarget.id', user.id);
        if (!conversation && fallback) {
            const skypeConversation = this.get('skype').startConversation(user.id);
            return this.getConversation(skypeConversation.id(), skypeConversation);
        }
        return conversation;
    },

    getUserForPerson(person) {
        const id = person.id();
        const users = this.get('users');
        let currentUser = users.find(user => user.get('id') === id);

        if (!currentUser) {
            currentUser = User.create({
                id,
                person
            }, getOwner(this).ownerInjection());

            users.addObject(currentUser);
        }

        return currentUser;
    },

    startConversation(user) {
        const conversation = this.getConversationForUser(user);
        conversation.get('loaded').then(() => {
            this.setActiveConversation(conversation);
        });
    },

    endConversation(conversation) {
        conversation.leave();
        this.get('skype').endConversation(conversation);
        this.get('conversations').removeObject(conversation);
        this.setActiveConversation(this.get('conversations.firstObject'));
    }
});
