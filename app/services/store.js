import Ember from 'ember';
import { EVENTS } from './skype';
import Conversation from '../models/conversation';
import User from '../models/user';

const {
    inject,
    getOwner,
    Logger,
    Service,
} = Ember;


export default Service.extend({
    skype: inject.service(),

    me: null,
    users: null,
    contacts: null,
    conversations: null,
    activeConversation: null,

    init() {
        this._super(...arguments);

        this.set('users', []);
        this.set('contacts', []);
        this.set('conversations', []);

        const skype = this.get('skype');

        skype.on(EVENTS.signIn, this.signIn.bind(this));
        skype.on(EVENTS.personAdded, this.getUserForPerson.bind(this));
        skype.on(EVENTS.conversationAdded, this.addConversation.bind(this));
        skype.on(EVENTS.groupAdded, this.addGroup.bind(this));

        window.STORE = this;
    },

    signIn(user) {
        Logger.log('Store.signIn', { user });

        let me = this.getUserForPerson(user);
        this.set('me', me);
    },

    addConversation(conversation) {
        Logger.info('Store.addConversation', { conversation });

        const model = this.getConversation(conversation.id(), conversation);
        if (!this.get('activeConversation')) {
            this.setActiveConversation(model);
        }
    },

    addGroup() {
        Logger.log('Store.addGroup - ', arguments);
    },

    setActiveConversation(conversation) {
        Logger.log('Store.setActiveConversation', { conversation });

        if (conversation !== this.get('activeConversation')) {
            this.set('activeConversation', conversation);
        }

        conversation.loadMessageHistory();
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
    }

});
