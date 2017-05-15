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
    }
});
