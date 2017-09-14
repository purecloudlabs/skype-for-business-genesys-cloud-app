import Ember from 'ember';

import User from '../models/user';

const {
    getOwner,
    RSVP,
    Logger,
    Service,
    Evented
} = Ember;

const config = {
    apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255', // SDK
};

const redirectUri =
    window.location.host.indexOf('localhost') > -1 ?
        'https://localhost:4200/skype-for-business-purecloud-app/' :
        'https://mypurecloud.github.io/skype-for-business-purecloud-app/';

const appConfigProperties = {
    "displayName": "purecloudskype",
    "applicationID": "ec744ffe-d332-454a-9f13-b9f7ebe8b249",
    "applicationType": "Web app / API",
    "objectID": "45185d32-9960-42ad-beed-6b02215f8ba2",
    "homePage": "https://mypurecloud.github.io/skype-for-business-purecloud-app/",
};

export const EVENTS = {
    groupAdded: 'GROUP_ADDED',
    groupRemoved: 'GROUP_REMOVED',
    personAdded: 'PERSON_ADDED',
    personRemoved: 'PERSON_REMOVED',
    conversationAdded: 'CONVERSATION_ADDED',
    conversationRemoved: 'CONVERSATION_REMOVED'
};

export default Service.extend(Evented, {
    ajax: Ember.inject.service(),

    promise: null,

    init() {
        window.skype = this;

        this._super(...arguments);

        const deferred = RSVP.defer();
        this.promise = deferred.promise;

        window.Skype.initialize({
            apiKey: config.apiKey,
        }, api => {
            this.api = api;
            this.application =  new api.application();

            deferred.resolve();
        }, error => {
            Logger.error('There was an error loading the api:', error);
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
            redirect_uri: redirectUri
        };

        return this.application.signInManager.signIn(options)
            .then(() => {
                console.log('SIGNIN-THEN', arguments);
                const me = this.application.personsAndGroupsManager.mePerson;
                const user = User.create({person: me}, getOwner(this).ownerInjection());

                this.set('user', user);

                this.registerForEvents();
            })
            .catch((err) => {
                console.log('SIGNIN-CATCH', err, arguments);
            })
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
            Logger.info('Group added', group);
            this.trigger(EVENTS.groupAdded, group);
        });
        groups.removed(group => {
            Logger.info('Group added', group);
            this.trigger(EVENTS.groupRemoved, group);
        });

        persons.added(person => {
            Logger.info('Person added', person);
            this.trigger(EVENTS.personAdded, person);
        });

        conversations.added(conversation => {
            Logger.info('Conversation added', conversation);
            this.trigger(EVENTS.conversationAdded, conversation);
        });
    },

    addContact(person) {
        let groups = this.get('application').personsAndGroupsManager.all.groups();
        let group = groups[this.get('application').personsAndGroupsManager.all.groups().map(p => p.name()).indexOf('Other Contacts')];

        return group.persons.add(person.get('id')).then(() => {
                Logger.log(`added ${person.displayName} to ${group.name()}`);
            },
            (err) => {
                Logger.error(err);
            });
    },

    // Chat

    startChat(id) {
        var conversationManager;
        var listeners;
        var conversation = conversationManager.getConversation(id);
        // do stuff with chat listeners
        listeners.push(conversation.selfParticipant.chat.state.when('Connected', function () {
            // Connected to chat
        }));
    },

    sendMessage(message) {
        var conversation;
        conversation.chatService.sendMessage(message);
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

    endConversation(conversation) { //video, audio or chat (?)
        conversation.leave();
    },

    getAllGroups() {
        return this.application.personsAndGroupsManager.all.groups.get().then(groups => {
            return groups.filter(group => !!group.id());
        });
    },

    startConversation(person) {
        this.set('activeConversation', null);

        Ember.run.next(() => {
            const conversation = this.application.conversationsManager.getConversation(person);
            this.set('activeConversation', conversation);
            window.CONVERSATION = conversation;
        });
    }
});
