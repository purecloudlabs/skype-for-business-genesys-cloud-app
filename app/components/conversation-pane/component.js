import Ember from 'ember';

const {
    inject,
    computed,
    run,
    observer,
    Logger,
    Component
} = Ember;

const MAX_MESSAGE_LENGTH = 300;

export default Component.extend({
    classNames: ['conversation-pane'],

    ajax: inject.service(),
    application: inject.service(),
    auth: inject.service(),
    intl: inject.service(),
    store: inject.service(),
    conversation: computed.alias('store.activeConversation'),

    target: computed.alias('conversation.conversationTarget'),

    MAX_MESSAGE_LENGTH,

    didInsertElement() {
        run.scheduleOnce('afterRender', this, this.focus);

        return this._super(...arguments);
    },

    messageLengthError: computed('text', function () {
        return this.get('text.length') > MAX_MESSAGE_LENGTH;
    }),

    disableCallButton: computed('target.skypePhoneNumbers.isFulfilled', function () {
        let promise = this.get('target.skypePhoneNumbers');

        return promise ?
            !promise.get('content.0') :
            true;
    }),

    conversationChanged: observer('conversation', function () {
        run.scheduleOnce('afterRender', this, this.focus);
    }),

    focus() {
        if (this.element) {
            let textarea = this.element.querySelector('textarea');
            if (textarea) {
                textarea.focus();
            }
        }
    },

    actions: {
        keyup({ target }) {
            this.set('text', target.value);
        },

        keydown(event) {
            const {key, keyCode, shiftKey, target} = event;

            if ((key === 'Escape' || keyCode === 27) && target.value === '') {
                this.get('conversation').clearUnreadState();
            }

            if ((key === 'Enter' || keyCode === 13) && !shiftKey) {
                event.preventDefault();

                if (target.value.length > MAX_MESSAGE_LENGTH) {
                    return;
                }

                let messageText = target.value;
                this.get('conversation').sendMessage(messageText);

                target.value = '';
            }
        },

        makeCall() {
            let platformClient = window.require('platformClient');
            this.get('target.skypePhoneNumbers').then(numbers => {
                if (!numbers || !numbers.length) {
                    // error?
                    return;
                }

                const workSkypeNumber = numbers.find(number => number && number.type() === 'Work');
                let number = numbers[0];
                if (workSkypeNumber) {
                    number = workSkypeNumber;
                }
                if (number && number.displayString) {
                    let displayString = number.displayString();
                    if (displayString.indexOf('+') === -1) {
                        displayString = `+${displayString}`;
                    }
                    displayString = displayString.replace(/[\s-]+/g, '')
                    number = `tel:${displayString}`;

                    const environment = this.get('application.environment') || 'inindca.com';
                    platformClient.ApiClient.instance.setEnvironment(environment);
                    platformClient.ApiClient.instance.authentications['PureCloud Auth'].accessToken = this.get('auth.purecloudAccessToken');
                    let apiInstance = new platformClient.ConversationsApi();
                    let body = {
                        phoneNumber: number,
                    };

                    apiInstance.postConversationsCalls(body).then((data) => {
                        Logger.log('Call Made', data);
                    }).catch((err) => {
                        let title = this.get('intl').t('errors.title');
                        let text = this.get('intl').t('errors.calls.general');
                        let options = {
                            type: 'error',
                            timeout: 30,
                            showCloseButton: true
                        }

                        Logger.error('CALL ERROR', err);
                        this.get('application.clientApp').alerting.showToastPopup(title, text, options);
                    });
                } else {
                    // no phone number, error
                }
            });
        }
    }
})
