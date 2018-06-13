import Ember from 'ember';

export default {
    name: 'setup-logging',
    initialize: function initialize (instance) {
        Ember.Logger = instance.lookup('service:trace-logger');
    }
};
