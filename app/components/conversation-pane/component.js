import Ember from 'ember';
import DS from 'ember-data';

const {
    inject,
    computed,
    run,
    observer,
    Component
} = Ember;

const MAX_MESSAGE_LENGTH = 300;

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
const SPECIAL_ENTER = 229;

export default Component.extend({
    classNames: ['conversation-pane'],

    application: inject.service(),
    auth: inject.service(),
    intl: inject.service(),
    store: inject.service(),
    traceLogger: inject.service(),

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

    disableCallButton: computed('target.skypePhoneNumbers.isFulfilled', 'hasPurecloudStation.isFulfilled', function () {
        let skypeNumbers = this.get('target.skypePhoneNumbers');
        let purecloudStation = this.get('hasPurecloudStation');

        return skypeNumbers && purecloudStation ?
            !skypeNumbers.get('content.0') || !purecloudStation.get('content') :
            true;
    }),

    hasPurecloudStation: computed('auth.purecloudAccessToken', function () {
        let platformClient = window.require('platformClient');
        const environment = this.get('application.environment') || 'inindca.com';
        platformClient.ApiClient.instance.setEnvironment(environment);
        platformClient.ApiClient.instance.authentications['PureCloud Auth'].accessToken = this.get('auth.purecloudAccessToken');
        let apiInstance = new platformClient.UsersApi();

        let promise = apiInstance.getUsersMe().then( (user) => {
           return apiInstance.getUserStation(user.id).then( (res) => {
                return !!res.associatedStation;
            });
        });

        return DS.PromiseObject.create({ promise });
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

            if ((key === 'Escape' || keyCode === ESCAPE_KEY) && target.value === '') {
                this.get('conversation').clearUnreadState();
            }

            if ((key === 'Enter' || keyCode === ENTER_KEY) && !shiftKey && keyCode !== SPECIAL_ENTER) {
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
                        Ember.Logger.log('components/conversation-pane', 'Call Made', data);
                    }).catch((err) => {
                        let title = this.get('intl').t('errors.title');
                        let text = this.get('intl').t('errors.calls.general');
                        let options = {
                            type: 'error',
                            timeout: 30,
                            showCloseButton: true
                        };

                        this.get('traceLogger').error('components/conversation-pane', 'purecloud call error', err);
                        this.get('application.clientApp').alerting.showToastPopup(title, text, options);
                    });
                } else {
                    // no phone number, error
                }
            });
        }
    }
})
