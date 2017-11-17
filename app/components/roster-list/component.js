import Ember from 'ember';

const {
    inject,
    computed,
    RSVP,
    Logger,
    Component
} = Ember;

export default Component.extend({
    classNames: ['roster-list'],

    skype: inject.service(),
    store: inject.service(),

    searchQuery: null,

    generalContacts: computed.alias('store.contacts'),
    activeConversations: computed.alias('store.conversations'),

    init() {
        this._super(...arguments);
    },

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
        }
    },

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

        Logger.log('Starting search for', { query });

        return new RSVP.Promise((resolve, reject) => {
            query.getMore().then((results) => {
                const data = results.map((result) => {
                    return this.get('store').getUserForPerson(result.result);
                });
                Logger.log('Results:', { data });
                resolve(data);
            }, (error) => {
                Logger.error('Failed loading results', { error });
                reject({ error });
            });
        })
    })
});
