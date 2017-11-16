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
    },

    actions: {
        selectConversation(conversation) {
            this.get('store').setActiveConversation(conversation);
        },

        clickContact(person) {
            this.get('store').startConversation(person);
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
        Logger.log('RosterList.generalContacts - ', this.get('generalContacts'));
    }
});
