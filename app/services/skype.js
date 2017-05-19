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
    apiKeyCC: '9c967f6b-a846-4df2-b43d-5167e47d81e1' // SDK+UI
};

const redirectUri = 'https://localhost:4200/skype-for-business-purecloud-app/';
const appConfigProperties = {
    "displayName": "purecloud-skype",
    "applicationID": "521f4c8f-9048-4337-bf18-6495ca21e415",
    "applicationType": "Web app / API",
    "objectID": "bd59e8f7-7455-4bb5-8e5e-7a0f1988e144",
    "homePage": "https://mypurecloud.github.io/skype-for-business-purecloud-app/",
};

export const EVENTS = {
    groupAdded: 'GROUP_ADDED',
    groupRemoved: 'GROUP_REMOVED',
    personAdded: 'PERSON_ADDED',
    personRemoved: 'PERSON_REMOVED',
    conversationAdded: 'CONVERSATION_ADDED',
    conversationRemoved: 'CONVERSATION_REMOVED'
}

export default Service.extend(Evented, {
    ajax: Ember.inject.service(),

    promise: null,

    init() {
        window.skype = this;

        this._super(...arguments);

        const deferred = RSVP.defer();
        this.promise = deferred.promise;

        window.Skype.initialize({
            apiKey: config.apiKeyCC,
            supportsAudio: true,
            supportsVideo: true,
            convLogSettings: true
        }, api => {
            this.api = api;
            this.application = api.UIApplicationInstance;

            deferred.resolve();
        }, error => {
            Logger.error('There was an error loading the api:', error);
        });
    },

    startAuthentication() {
        return this.promise.then(() => {
            if (window.location.href.indexOf('#') > 0) {
                return this.extractToken();
            }

            const baseUrl = 'https://login.microsoftonline.com/common/oauth2/authorize';
            const authData = {
                response_type: 'token',
                client_id: appConfigProperties.applicationID,
                state: 'dummy',
                redirect_uri: redirectUri,
                resource: 'https://webdir.online.lync.com'
            };

            const params = Object.keys(authData).map(key => {
                const value = authData[key];
                return `${key}=${value}`;
            });

            window.location.href = `${baseUrl}/?${params.join('&')}`;

            return new RSVP.Promise(() => { }); // never resolve
        });
    },

    extractToken() {
        const hash = window.location.hash.substr(1).split('&');
        const data = {};
        hash.forEach(info => {
            const [key, value] = info.split('=');
            data[key] = value;
        });
        this.authData = data;
        return this.signIn();
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
        return this.application.signInManager.signIn(options).then(() => {
            const me = this.application.personsAndGroupsManager.mePerson;
            const user = User.create({ me }, getOwner(this).ownerInjection());
            this.set('user', user);

            this.registerForEvents();
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

        group.persons.add(person.get('id')).then(() => {
            console.log(`added ${person.name} to ${group.name}`);
        },
        (err) => {
            console.error(err);
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
        });
    }
});
