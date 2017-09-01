import Ember from 'ember';

const {
    inject,
    Route,
    Logger
} = Ember;

export default Route.extend({
    auth: inject.service(),

    beforeModel(transition) {
        this.get('auth').silentLogin().then(() => {
            let target = transition.targetName;
            // if (target === 'index' || target === 'application') {
            //     target = 'calendar';
            // }
            this.transitionTo(target);
        }).catch(error => {
            Logger.error('Error logging in silently', error);
            this.transitionTo('index');
        })
    }
});
