import Ember from 'ember';
import { EVENTS } from './skype';

const {
    inject,
    Logger,
    Service,
} = Ember;


export default Service.extend({
    skype: inject.service(),

    contacts: null,
    conversations: null,
    activeConversation: null,

    init() {
        this._super(...arguments);

        this.set('contacts', []);
        this.set('conversations', []);

        const skype = this.get('skype');

        skype.on(EVENTS.personAdded, this.addPerson.bind(this));
        skype.on(EVENTS.conversationAdded, this.addConversation.bind(this));
        skype.on(EVENTS.groupAdded, this.addGroup.bind(this));

        window.STORE = this;
    },

    addPerson(person) {
        Logger.log('Store.addPerson - ', arguments);

        this.get('contacts').pushObject(person);
    },

    addConversation(conversation) {
        Logger.log('Store.addConversation - ', arguments);

        this.get('conversations').pushObject(conversation);

        if (!this.get('activeConversation')) {
            this.setActiveConversation(conversation);
        }
    },

    addGroup() {
        Logger.log('Store.addGroup - ', arguments);
    },

    setActiveConversation(conversation) {
        if (conversation !== this.get('activeConversation')) {
            this.set('activeConversation', conversation);

            conversation.loadMessageHistory();
        }
    },

    startConversation(user) {
        const conversations = this.get('conversations');
        const currentConversation = conversations.findBy('conversationTarget.id', user.id);

        if (currentConversation) {
            this.set('activeConversation', currentConversation);
            return;
        }

        const conversation = this.get('skype').startConversation(user.id);
        this.setActiveConversation(conversation);
    }

});
