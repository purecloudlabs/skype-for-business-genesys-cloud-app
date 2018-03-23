import Service from '@ember/service';

const ENV_REG_EXP = /^s*(?:(localhost|localhost.mypurecloud.com)|([^:/?#\s]*)?(inin[dts]ca|mypurecloud)([^:/?#]+))(?::\d+)?(\/[^?#]*)?(?:\?|#.*)?s*$/i;

export default Service.extend({
    environment: null,

    authenticatingInFrame() {
        const ref = window.location.href;
        const tokenIndex = ref.indexOf('access_token');
        const stateIndex = ref.indexOf('session_state')
        const isPurecloudAuth = tokenIndex > 0 && stateIndex === -1;
        const isMicrosoftAuth = tokenIndex > 0 && stateIndex > 0;

        try {
            const parentLocation = window && window.top && window.top.location.host;
            const inFrame = window.self !== window.top;
            return (isPurecloudAuth || isMicrosoftAuth) && inFrame && !ENV_REG_EXP.test(parentLocation);
        } catch (e) {
            return false;
        }
    }
});
