import Ember from 'ember';
import User from '../../models/user';

const {
    inject,
    getOwner,
    Logger,
    Component,
    computed
} = Ember;

export default Component.extend({
    classNames: ['roster-list'],

    skype: inject.service(),
    store: inject.service(),

    searchResults: [],

    generalContacts: computed.alias('store.contacts'),
    activeConversations: computed.alias('store.conversations'),

    init() {
        this._super(...arguments);

        console.log(this.get('store'));

        window.roster = this;
    },

    actions: {
        clickConversation(conversation) {
            this.get('store').setActiveConversation(conversation);
        },

        clickContact(person) {
            this.get('skype').startConversation(person.get('person'));
        },

        searchHandler (event) {
            let val = event.target.value;
            if (val !== '') {
                this.set('searchLoading', true);
                this.set('hideSearch', false);
                Ember.run.debounce(this, this.handleSearch, val, 500);
            } else {
                this.set('searchLoading', false);
                this.set('hideSearch', true);
                this.set('searchResults', []);
            }
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
            });
            this.set('searchLoading', false);
            Logger.log(list);
        },
        (err) => {
            Logger.error(err);
        });
    },

    fetchData() {
        const store = this.get('store');

        this.set('generalContacts', store.get('contacts'));
        console.log('RosterList.generalContacts - ', this.get('generalContacts'));
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
    //
    // addPerson(person) {
    //     let personModel = User.create({
    //         person
    //     }, getOwner(this).ownerInjection());
    //
    //     this.get('generalContacts').pushObject(personModel);
    // },
    //
    // addConversation(conversation) {
    // },
    //
    // addGroup(group) {
    //     let groupModel = Ember.Object.create();
    //     this.get('groups').unshiftObject(groupModel);
    //
    //     group.id.get().then(() => {
    //         groupModel.set('id', group.id());
    //         groupModel.set('name', group.name());
    //         groupModel.set('persons', []);
    //
    //         if (groupModel.get('name') === 'pinnedGroup') {
    //             groupModel.set('name', 'Favorites');
    //         }
    //         if (groupModel.get('name') === 'Other Contacts') {
    //             groupModel.set('name', 'Contacts');
    //             groupModel.set('persons', this.get('generalContacts'));
    //             return;
    //         }
    //
    //         group.persons().forEach(person => {
    //             let personModel = User.create({
    //                 person
    //             }, getOwner(this).ownerInjection());
    //             groupModel.get('persons').pushObject(personModel);
    //         });
    //     });
    // }
});
