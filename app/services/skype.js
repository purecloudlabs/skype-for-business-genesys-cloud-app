import Ember from 'ember';

const {
    Service
} = Ember;

const config = {
    apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255', // SDK
    apiKeyCC: '9c967f6b-a846-4df2-b43d-5167e47d81e1' // SDK+UI
};

export default Service.extend({
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
        }, error => {
            window.alert('There was an error loading the api:', error);
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
