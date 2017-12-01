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

        skype.on(EVENTS.personAdded, this.addPerson.bind(this));
        skype.on(EVENTS.conversationAdded, this.addConversation.bind(this));
        skype.on(EVENTS.groupAdded, this.addGroup.bind(this));

        window.STORE = this;
    },

    addPerson(person) {
        Logger.log('Store.addPerson:', { person });

        const user = User.create({
            person
        }, getOwner(this).ownerInjection());

        this.get('users').addObject(user);
    },

    addConversation(conversation) {
        Logger.info('Store.addConversation:', { conversation });

        const model = this.getConversation(conversation.id(), conversation);
        if (!this.get('activeConversation')) {
            this.setActiveConversation(model);
        }
    },

    addGroup() {
        Logger.log('Store.addGroup - ', arguments);
    },

    setActiveConversation(conversation) {
        console.log('store.setActiveConversation', conversation);

        if (conversation !== this.get('activeConversation')) {
            this.set('activeConversation', conversation);
        }

        conversation.loadMessageHistory();
    },

    getConversation(id, skypeConversation = null) {
        const conversations = this.get('conversations');
        let conversation = conversations.findBy('id', id);
        if (!conversation) {
            conversation = Conversation.create({
                id,
                conversation: skypeConversation
            }, getOwner(this).ownerInjection());
            this.get('conversations').addObject(conversation);
        }
        if (!conversation.get('conversation') && skypeConversation) {
            conversation.set('conversation', skypeConversation);
        }

        return conversation;
    },

    getConversationForUser(user) {
        const conversation = this.get('conversations').findBy('conversationTarget.id', user.id);
        if (!conversation) {
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
