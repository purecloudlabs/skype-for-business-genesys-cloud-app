import Ember from 'ember';
import moment from 'moment';

const {
    computed
} = Ember;

export default Ember.Object.extend({
    sender: null,
    skypeMessage: null,

    init() {
        const message = this.get('skypeMessage');
        this.setProperties({
            direction: message.direction(),
            status: message.status(),
            text: message.text(),
            timestamp: moment(message.timestamp()),
        });
    },

    sortComparison: computed('timestamp', function () {
        const timestamp = this.get('timestamp');
        if (timestamp) {
            return timestamp.valueOf();
        }
        return null;
    })
});
