import Ember from 'ember';
import { EVENTS } from './skype';

const {
    inject,
    getOwner,
    RSVP,
    Logger,
    Service,
    Evented
} = Ember;


export default Service.extend({
    skype: inject.service(),

    contacts: null,
    conversations: null,

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
        console.log('Store.addPerson - ', arguments);

        this.get('contacts').pushObject(person);
    },

    addConversation(conversation) {
        console.log('Store.addConversation - ', arguments);

        this.get('conversations').pushObject(conversation);
    },

    addGroup() {
        console.log('Store.addGroup - ', arguments);
    },
});
