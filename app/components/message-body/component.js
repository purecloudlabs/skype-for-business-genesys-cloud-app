import Ember from 'ember';
const { Component, computed, inject } = Ember;

export default Component.extend({
    classNames: [ 'message-body '],
    classNameBindings: [ 'isYou:is-you:not-you' ],

    store: inject.service(),

    message: null,
    sender: computed.alias('message.sender'),
    me: computed.alias('store.me'),

    isYou: computed('me', 'sender', function () {
        return this.get('me') === this.get('sender');
    })
});
