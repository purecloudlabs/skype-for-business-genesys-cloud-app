import Ember from 'ember';

const {
    inject,
    Controller
} = Ember;

export default Controller.extend({
    skype: inject.service(),

    loading: false,

    init() {
        this.set('loading', true);

        this.get('skype').startAuthentication().then(() => {
            this.set('loading', false);
        });
    }
})
