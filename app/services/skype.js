import Ember from 'ember';

const {
    Service
} = Ember;

const config = {
    apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255', // SDK
    apiKeyCC: '9c967f6b-a846-4df2-b43d-5167e47d81e1' // SDK+UI
};

const discoveryUrl = 'https://webdir.online.lync.com/autodiscover/autodiscoverservice.svc/root';

export default Service.extend({
    ajax: Ember.inject.service(),

    init() {
        this._super(...arguments);

        window.Skype.initialize({
            apiKey: config.apiKeyCC,
            supportsAudio: true,
            supportsVideo: true,
            convLogSettings: true
        }, api => {
            this.api = api;
            this.application = api.UIApplicationInstance;

            this.startAuthentication();
        }, error => {
            console.error('There was an error loading the api:', error);
        });
    },

    startAuthentication() {
        this.get('ajax').request(discoveryUrl, {
            dataType: 'json'
        }).then(data => {
            const baseUrl = 'https://login.microsoftonline.com/oauth2/authorize';
            const authData = {
                response_type: 'id_token',
                client_id: '521f4c8f-9048-4337-bf18-6495ca21e415',
                state: 'dummy',
                resource: data._links.self.href,
                redirect_uri: 'https://localhost:4200/skype-for-business-purecloud-app/'
            };
            return this.application.signInManager.signIn({
                cors: true,
                client_id: authData.client_id,
                redirect_uri: authData.redirect_uri,
                origins: [
                    'https://webdir0b.online.lync.com/Autodiscover/AutodiscoverService.svc/root?originalDomain=connectortrial.onmicrosoft.com'
                ]
            });
            // const params = Object.keys(authData).map(key => {
            //     let value = authData[key];
            //     if (key === 'redirect_uri') {
            //         value = window.encodeUriComponents(value);
            //     }
            //     return `${key}=${value}`;
            // });

            // return this.get('ajax').request(baseUrl, { data: authData });
        }).then(data => {
            debugger;
        }).catch(error => {
            console.error('There was an error signing in:', error);
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

    endConversation (conversation) { //video, audio or chat (?)
        conversation.leave();
    }
});
