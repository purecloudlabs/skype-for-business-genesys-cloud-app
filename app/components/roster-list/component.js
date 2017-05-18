import Ember from 'ember';
import { EVENTS } from '../../services/skype';

const {
    Component,
    inject
} = Ember;

export default Component.extend({
    classNames: ['roster-list'],

    skype: inject.service(),

    init() {
        this._super(...arguments);

        this.set('groups', []);
        window.GROUPS = this.get('groups');
    },

    didInsertElement() {
        this._super(...arguments);

        const skype = this.get('skype');

        skype.on(EVENTS.personAdded, this.addPerson.bind(this));
        skype.on(EVENTS.conversationAdded, this.addConversation.bind(this));
        skype.on(EVENTS.groupAdded, this.addGroup.bind(this));

        Ember.run.scheduleOnce('afterRender', this, this.fetchData);
    },

    actions: {
        clickContact(person) {
            this.get('skype').startConversation(person.get('id'));
        }
    },

    fetchData() {
        // const skype = this.get('skype');
        //
        // console.log('roster group search started');
        // skype.getAllGroups().then(groups => {
        //     console.log('roster groups: ', groups, groups.map(g => mapSkypeToPojo(g)));
        //     setTimeout(() => {
        //         console.log('roster groups delayed: ', groups, groups.map(g => mapSkypeToPojo(g)));
        //     }, 1000);
        //
        //     window.GROUPS = groups;
        //     // this.get('groups').addObjects(groups);
        // });
        //
        // console.log('roster person search started');
        // skype.get('application').personsAndGroupsManager.all.persons
        //     .get().then(function (contacts) {
        //         console.log('roster person search results: ', contacts, contacts.map(c => c.displayName()));
        //
        //     }, function (error) {
        //         console.log('roster person search error: ', error);
        //     });
    },

    addPerson(person) {
        person.displayName.get().then(name => {
            console.log('ROSTER: addPerson', name, person.id());
        })
    },
    addConversation(conversation) {
    },
    addGroup(group) {
        let groupModel = Ember.Object.create();
        this.get('groups').unshiftObject(groupModel);

        group.id.get().then(() => {
            groupModel.set('id', group.id());
            groupModel.set('name', group.name());
            groupModel.set('persons', []);

            if (groupModel.get('name') === 'pinnedGroup') {
                groupModel.set('name', 'Favorites');
            }

            group.persons().forEach(person => {
                let personModel = Ember.Object.create();
                groupModel.get('persons').pushObject(personModel);

                person.id.get().then(() => personModel.set('id', person.id()));
                person.displayName.get().then(() => personModel.set('displayName', person.displayName()));
                person.avatarUrl.get().then(() => personModel.set('avatarUrl', person.avatarUrl()));
            });
        });
    }
});
