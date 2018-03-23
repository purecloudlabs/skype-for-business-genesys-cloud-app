import Service from '@ember/service';

export default Service.extend({
    environment: null,

    authenticatingInFrame() {
        const ref = window.location.href;
        const tokenIndex = ref.indexOf('access_token');
        const stateIndex = ref.indexOf('session_state')
        const isPurecloudAuth = tokenIndex > 0 && stateIndex === -1;
        const isMicrosoftAuth = tokenIndex > 0 && stateIndex > 0;

        return (isPurecloudAuth || isMicrosoftAuth) && window.self !== window.top;
    }
});
