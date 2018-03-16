import { inject as service } from '@ember/service'
import Route from '@ember/routing/route';

export default Route.extend({
    intl: service(),

    actions: {
        loading() {
            return true;
        },
        error(error) {
            if (typeof error === 'string' && /User login is required/.test(error)) {
                this.replaceWith('login');
                return;
            }

            const login = this.controllerFor('login');
            login.set('error', error);
            this.replaceWith('login');
        }
    },

    beforeModel() {
        this.get('intl').setLocale(['en-us']);
    }
});
