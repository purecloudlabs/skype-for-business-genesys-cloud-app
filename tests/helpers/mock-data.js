import moment from 'moment';
import Ember from 'ember';
import RSVP from 'rsvp';
import Conversation from 'purecloud-skype/models/conversation';
import User from 'purecloud-skype/models/user';

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
        person: {
            id: () => id,
            displayName: () => displayName,
            email: () => email,
            presence: () => presence,
            avatarUrl: () => 'https://placekitten.com/g/200/200'
        }
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
