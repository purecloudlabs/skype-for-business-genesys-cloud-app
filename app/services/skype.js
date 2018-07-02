import Ember from 'ember';

const {
    RSVP,
    Service,
    Evented
} = Ember;

const config = {
    apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255',
    apiKeyCC: '9c967f6b-a846-4df2-b43d-5167e47d81e1' // with UI
};

const appConfigProperties = {
    displayName: 'purecloudskype',
    applicationID: 'ec744ffe-d332-454a-9f13-b9f7ebe8b249',
    applicationType: 'Web app / API',
    objectID: '45185d32-9960-42ad-beed-6b02215f8ba2',
    homePage: 'https://mypurecloud.github.io/skype-for-business-purecloud-app/',
};

export const EVENTS = {
    signIn: 'SIGN_IN',
    groupAdded: 'GROUP_ADDED',
    groupRemoved: 'GROUP_REMOVED',
    personAdded: 'PERSON_ADDED',
    personRemoved: 'PERSON_REMOVED',
    conversationAdded: 'CONVERSATION_ADDED',
    conversationRemoved: 'CONVERSATION_REMOVED'
};

export default Service.extend(Evented, {
    traceLogger: Ember.inject.service(),

    promise: null,

    redirectUri: Ember.computed(function () {
        if (window.location.host.indexOf('localhost')) {
            return 'https://localhost:4200/';
        }
        return `${window.location.origin}${window.location.pathname}`;
    }),

    init() {
        window.skype = this;

        this._super(...arguments);

        const deferred = RSVP.defer();
        this.promise = deferred.promise;

        window.Skype.initialize({
            apiKey: config.apiKey
        }, api => {
            this.api = api;
            this.application = new api.application({
                settings: {
                    convLogSettings: true
                }
            });
            deferred.resolve();
        }, error => {
            this.get('traceLogger').Logger.error('services/skype', 'error initializing skype api', { error });
        });
    },

    signIn() {
        const options = {
            client_id: appConfigProperties.applicationID,
            origins: [
                'https://webdir.online.lync.com/autodiscover/autodiscoverservice.svc/root'
            ],
            cors: true,
            version: 'PurecloudSkype/0.0.0',
            redirect_uri: this.get('redirectUri')
        };

        return this.application.signInManager.signIn(options)
            .then(() => {
                Ember.Logger.log('services/skype', 'signIn', arguments);
                const me = this.application.personsAndGroupsManager.mePerson;
                this.set('me', me);
                this.trigger(EVENTS.signIn, me);

                this.registerForEvents();

                // Load all conversations
                this.application.conversationsManager.getMoreConversations();
            })
            .catch(error => {
                this.get('traceLogger').error('services/skype', 'signIn', { error });
                return RSVP.reject(error);
            });
    },

    registerForEvents() {
        const app = this.application;
        const conversations = app.conversationsManager.conversations;
        const groups = app.personsAndGroupsManager.all.groups;
        const persons = app.personsAndGroupsManager.all.persons;

        conversations.subscribe();
        groups.subscribe();
        persons.subscribe();

        groups.added(group => {
            Ember.Logger.debug('services/skype', 'Group added:', { group });
            this.trigger(EVENTS.groupAdded, group);
        });
        groups.removed(group => {
            Ember.Logger.debug('services/skype', 'Group removed:', { group });
            this.trigger(EVENTS.groupRemoved, group);
        });

        persons.added(person => {
            Ember.Logger.debug('services/skype', 'Person added:', { person });

            person.id.get().then(() => {
                this.trigger(EVENTS.personAdded, person);
            });
        });

        conversations.added(conversation => {
            Ember.Logger.debug('services/skype', 'Conversation added:', { conversation });

            conversation.chatService.accept();
            conversation.chatService.start();

            conversation.selfParticipant.chat.state.when('Notified', () => {
                conversation.chatService.accept();
            });

            this.trigger(EVENTS.conversationAdded, conversation);
        });
    },

    addContact(person) {
        let groups = this.get('application').personsAndGroupsManager.all.groups();
        let group = groups[this.get('application').personsAndGroupsManager.all.groups().map(p => p.name()).indexOf('Other Contacts')];

        return group.persons.add(person.get('id')).then(() => {
                Ember.Logger.log('services/skype', `added ${person.displayName} to ${group.name()}`);
            },
            (err) => {
                this.get('traceLogger').error('services/skype', "error saving contact", err);
            });
    },

    // Chat

    startConversation(sip) {
        return this.application.conversationsManager.getConversation(sip);
    },

    endConversation(conversation) {
        const conversations = [conversation.conversation, conversation.latestConversation];
        conversations.forEach(c => {
            this.application.conversationsManager.conversations.remove(c);
        });
    },

    // Audio & Video

    startAudio(id) {
        var conversationManager;
        var conversation = conversationManager.getConversation(id);
        conversation.participants.added((participant) => {
            //participant added
            participant; //appease lint
        });
        conversation.audioService.start();
    },

    startVideo() {          // appears to assume/require that an audio conversation has been started first
        var conversation;
        conversation.videoService.start(null, (error) => {
            // error handler
            error; //appease lint
        })
    },

    getAllGroups() {
        return this.application.personsAndGroupsManager.all.groups.get().then(groups => {
            return groups.filter(group => !!group.id());
        });
    }
});
