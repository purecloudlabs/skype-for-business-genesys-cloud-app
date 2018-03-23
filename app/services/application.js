import Service from '@ember/service';

const ENV_REG_EXP = /^s*(?:(localhost|localhost.mypurecloud.com)|([^:/?#\s]*)?(inin[dts]ca|mypurecloud)([^:/?#]+))(?::\d+)?(\/[^?#]*)?(?:\?|#.*)?s*$/i;

export default Service.extend({
    environment: null,

    authenticatingInFrame() {
        const href = window.location.href;
        const tokenIndex = href.indexOf('access_token');
        const stateIndex = href.indexOf('session_state')
        const isPurecloudAuth = tokenIndex > 0 && stateIndex === -1;
        const isMicrosoftAuth = tokenIndex > 0 && stateIndex > 0;

        try {
            const parentLocation = window && window.top && window.top.location.host;
            const inFrame = window.self !== window.top;
            return (isPurecloudAuth || isMicrosoftAuth) && inFrame && !ENV_REG_EXP.test(parentLocation);
        } catch (e) {
            return false;
        }
    },

    loadingInsideFrame() {
        try {
            const parentLocation = window && window.top && window.top.location.host;
            const inFrame = window.self !== window.top;

            if (window.location.hostname === 'localhost') {
                return inFrame;
            }

            return inFrame && !ENV_REG_EXP.test(parentLocation);
        } catch (e) {
            return false;
        }
    }
});
