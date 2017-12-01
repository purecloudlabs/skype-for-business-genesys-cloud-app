import Ember from 'ember';
const { Component, observer, run } = Ember;

export default Component.extend({
    classNames: [ 'messages-panel' ],
    messages: null,

    messagesAdded: observer('messages.[]', function () {
        run.scheduleOnce('afterRender', this, this.scrollToBottom);
    }),
    scrollToBottom() {
        this.element.scrollTop = this.element.scrollHeight;
    }
});
