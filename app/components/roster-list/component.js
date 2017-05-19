import Ember from 'ember';
import { EVENTS } from '../../services/skype';
import User from '../../models/user';

const {
    inject,
    getOwner,
    Logger,
    Component
} = Ember;

export default Component.extend({
    classNames: ['roster-list'],

    skype: inject.service(),

    searchResults: [],

    init() {
        this._super(...arguments);

        this.set('groups', []);
        this.set('generalContacts', []);

        window.GROUPS = this.get('groups');
        window.roster = this;
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
            this.get('skype').startConversation(person.get('person'));
        },

        searchHandler (event) {
            let val = event.target.value;
            Ember.run.debounce(this, this.handleSearch, val, 500);
        },

        addContact(person) {
            this.get('skype').addContact(person).then(() => {
                let group = this.get('groups').filterBy('name', "Other Contacts")[0];
                group.get('persons').pushObject(person);
            });
        }
    },

    handleSearch(input) {
        if (!input) {
            this.set('searchResults', null);
            return;
        }

        let query = this.get('skype').application.personsAndGroupsManager.createPersonSearchQuery();
        query.limit(50);
        query.text(input);

        Logger.warn(`Starting search for ${input}`);

        this.set('searchLoading', true);

        query.getMore().then((results) => {
            let list = results.map((result) => {
                return result.result;
            });
            this.set('searchResults', []);
            list.forEach( person => {
                let personModel = User.create({
                    person
                }, getOwner(this).ownerInjection());

                this.get('searchResults').pushObject(personModel);

                // person.id.get().then(() => personModel.set('id', person.id()));
                // person.displayName.get().then(() => personModel.set('displayName', person.displayName()));
                // person.avatarUrl.get().then(() => personModel.set('avatarUrl', person.avatarUrl()));
            });

            Logger.log(list);
        },
        (err) => {
            Logger.error(err);
        });
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
        let personModel = User.create({
            person
        }, getOwner(this).ownerInjection());

        this.get('generalContacts').pushObject(personModel);
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
            if (groupModel.get('name') === 'Other Contacts') {
                groupModel.set('name', 'Contacts');
                groupModel.set('persons', this.get('generalContacts'));
            }

            group.persons().forEach(person => {
                let personModel = User.create({
                    person
                }, getOwner(this).ownerInjection());
                groupModel.get('persons').pushObject(personModel);

                // person.id.get().then(() => personModel.set('id', person.id()));
                // person.displayName.get().then(() => personModel.set('displayName', person.displayName()));
                // person.avatarUrl.get().then(() => personModel.set('avatarUrl', person.avatarUrl()));
            });
        });
    }
});
