import Ember from 'ember';
import { EVENTS } from '../../services/skype';

const {
    Component,
    inject
} = Ember;

export default Component.extend({
    classNames: ['roster-list'],

    skype: inject.service(),

    groups: [],

    didInsertElement() {
        this._super(...arguments);

        const skype = this.get('skype');

        skype.on(EVENTS.personAdded, this.addPerson.bind(this));
        skype.on(EVENTS.conversationAdded, this.addConversation.bind(this));
        skype.on(EVENTS.groupAdded, this.addGroup.bind(this));

        Ember.run.scheduleOnce('afterRender', this, this.fetchData);
    },

    fetchData() {
        const skype = this.get('skype');
        skype.getAllGroups().then(groups => {
            this.get('groups').addObjects(groups);
        });
    },

    addPerson() {},
    addConversation() {},
    addGroup() {}
});
