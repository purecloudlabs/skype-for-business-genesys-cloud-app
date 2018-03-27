import moment from 'moment';
import Ember from 'ember';
import RSVP from 'rsvp';
import Conversation from 'purecloud-skype/models/conversation';
import User from 'purecloud-skype/models/user';

function propertyFunction(value) {
    const prop = () => value;
    prop.get = () => RSVP.resolve(value);
    prop.changed = () => null
    prop.added = () => null
    prop.subscribe = () => null
    return prop;
}

// See: https://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.person.html
export function mockSkypePerson({
    id,
    email = 'test@test.com',
    displayName = 'Test McTesterson',
    avatarUrl = 'https://placekitten.com/g/200/200',
    status = 'Available'
}) {
    return {
        id: propertyFunction(id),
        email: propertyFunction(email),
        displayName: propertyFunction(displayName),
        avatarUrl: propertyFunction(avatarUrl),
        status: propertyFunction(status)
    }
}

// See: https://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.conversation.html
export function mockSkypeConversation({ id, creator = null }) {
    creator = creator || mockSkypePerson({ id });

    const chatService = {
        messages: propertyFunction([])
    };

    const historyService = {
        activityItems: propertyFunction([])
    }

    return {
        id: propertyFunction(id),
        participants: propertyFunction([]),
        state: propertyFunction(''),
        creator,
        chatService,
        historyService
    };
}

export const basicMockUser =
    ({
         name = 'Test McTesterson',
         skypePhotoUrl = '1',
         presence = 'Available',
         presenceClass = 'available'
     } = {}) =>
        Ember.Object.create({
            name: RSVP.resolve(name),
            skypePhotoUrl: RSVP.resolve(skypePhotoUrl),
            presence,
            presenceClass
        });

export const basicMockMessage =
    ({
         sender = basicMockUser(),
         timestamp = moment(),
         unread = true,
         text = "test message please ignore"
     } = {}) =>
        Ember.Object.create({
            sender,
            timestamp,
            unread,
            text
        });


export function mockUserModel({ id, displayName, email, presence, owner }) {
    const ownerInjection = owner ? owner.ownerInjection() : {}
    return User.create({
        id,
        presence,
        person: mockSkypePerson({ id, displayName, email })
    }, ownerInjection);
}

export function mockConversationModel({ id, users = [], owner }) {
    const ownerInjection = owner ? owner.ownerInjection() : {}
    const participants = () => {
        return users.map(({ id, person}) => {
            return { id, person };
        });
    }
    participants.added = () => {};

    return Conversation.create({
        id,
        conversation: {
            id() {
                const _id = () => id
                _id.get = () => RSVP.resolve(id)
                return _id;
            },
            added() {},
            state: {
                changed() {}
            },
            participants,
            chatService: {
                messages: {
                    added() {}
                }
            },
            historyService: {
                activityItems: {
                    added() {}
                }
            }
        }
    }, ownerInjection);
}
