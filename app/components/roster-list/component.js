import Ember from 'ember';

const {
    inject,
    computed,
    RSVP,
    Component
} = Ember;

export default Component.extend({
    classNames: ['roster-list'],

    skype: inject.service(),
    store: inject.service(),
    traceLogger: inject.service(),

    searchQuery: null,

    generalContacts: computed.reads('store.contacts'),
    activeConversations: computed.reads('store.conversations'),

    actions: {
        selectConversation(conversation) {
            this.get('store').setActiveConversation(conversation);
        },

        searchHandler(event) {
            let value = event.target.value;
            Ember.run.debounce(this, this.set, 'searchQuery', value, 500);
        },

        selectSearchResult(user) {
            this.$('input').val('');
            this.set('searchQuery', null);

            this.get('store').startConversation(user);
        },

        closeConversation(conversation) {
            this.get('store').endConversation(conversation);
        }
    },

    sortedActiveConversations: computed('activeConversations', 'activeConversations.[]', function () {
        const conversations = this.get('activeConversations');
        if (conversations) {
            const promises = conversations.mapBy('name');
            return Ember.RSVP.all(promises).then(() => {
                return conversations.sortBy('name.content');
            });
        }
        return [];
    }),

    hideSearch: computed('searchQuery', function () {
        return !this.get('searchQuery');
    }),

    searchResults: computed('searchQuery', function () {
        const search = this.get('searchQuery');
        if (!search) {
            return RSVP.resolve([]);
        }

        const query = this.get('skype').application.personsAndGroupsManager.createPersonSearchQuery();
        query.limit(20);
        query.text(search);

        Ember.Logger.log('components/roster-list', 'Starting search for', { query });

        return new RSVP.Promise((resolve, reject) => {
            query.getMore().then((results) => {
                const data = results.map((result) => {
                    return this.get('store').getUserForPerson(result.result);
                });
                Ember.Logger.log('components/roster-list', 'Search results:', { data });
                resolve(data);
            }, (error) => {
                this.get('traceLogger').error('components/roster-list', 'Search failed loading results', { error });
                reject({ error });
            });
        })
    })
});
