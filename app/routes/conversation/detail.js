import Route from '@ember/routing/route';
import { inject as service } from '@ember/service'
import AuthenticatedRoute from '../../mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    store: service(),

    model(params) {
        return this.get('store').getConversation(params.id);
    },

    afterModel(model) {
        if (!model) {
            return;
        }

        model.loadMessageHistory();
    }
});
