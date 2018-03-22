import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
    auth: service(),

    beforeModel() {
        if (!this.get('auth.msftAccessToken')) {
            this.transitionTo('index');
        }
    }
})
