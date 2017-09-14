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

    init() {
        this._super(...arguments);

        this.set('contacts', []);

        const skype = this.get('skype');

        skype.on(EVENTS.personAdded, this.addPerson.bind(this));
        skype.on(EVENTS.conversationAdded, this.addConversation.bind(this));
        skype.on(EVENTS.groupAdded, this.addGroup.bind(this));

    },

    addPerson(person) {
        console.log('Store.addPerson - ', arguments);

        this.get('contacts').pushObject(person);
    },

    addConversation() {
        console.log('Store.addConversation - ', arguments);
    },

    addGroup() {
        console.log('Store.addGroup - ', arguments);
    },
});
