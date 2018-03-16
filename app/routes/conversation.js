import Route from '@ember/routing/route';
import { inject as service } from '@ember/service'
import { observer } from '@ember/object';
import AuthenticatedRoute from '../mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    auth: service(),
    skype: service(),

    beforeModel() {
        this._super(...arguments);

        const activeConversation = this.get('store.activeConversation');
        if (activeConversation) {
            this.transitionTo('conversation.detail', activeConversation.get('id'));
        }
    },

    activeConversationChanged: observer('store.activeConversation', function () {
        const activeConversation = this.get('store.activeConversation');
        if (activeConversation) {
            this.transitionTo('conversation.detail', activeConversation.get('id'));
        }
    })
});
