import Ember from 'ember';
import RSVP from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import Conversation from 'purecloud-skype/models/conversation';
import User from 'purecloud-skype/models/user';

function createUser({ id, displayName, email, presence }) {
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
    });
}

function createConversation({ id, users = [], owner }) {
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
    }, owner.ownerInjection());
}

let user1, user2;
let conv1, conv2;

module('Integration | Component | roster-list', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        this.owner.register('service:skype', Ember.Service.extend());
        const store = this.owner.lookup('service:store')

        user1 = createUser({
            id: 1,
            displayName: 'Test 1',
            email: 'test1@email.com',
            presence: 'Available'
        });

        user2 = createUser({
            id: 2,
            displayName: 'Test 2',
            email: 'test2@email.com',
            presence: 'Away'
        });

        store.users = [user1, user2];

        conv1 = createConversation({
            id: 1,
            users: [user1, user2],
            owner: this.owner
        });

        conv2 = createConversation({
            id: 2,
            users: [user2, user1],
            owner: this.owner
        });
    });

    test('displays list of conversations', async function (assert) {
        this.set('activeConversations', [
            conv1,
            conv2
        ]);

        await render(hbs`{{roster-list activeConversations=activeConversations}}`);

        let elems = this.element.querySelectorAll('.roster-entries a');
        assert.equal(elems.length, 2, 'Two users are in the roster');

        elems = this.element.querySelectorAll('.roster-entries a .name');
        const names = [...elems].map(e => e.innerText);
        assert.deepEqual(names, ['Test 1', 'Test 2'], 'Both users are listed in the roster');

        const presence1 = this.element.querySelectorAll('.presence-indicator')[0];
        const presence2 = this.element.querySelectorAll('.presence-indicator')[1];
        assert.ok(presence1.classList.contains('available'));
        assert.ok(presence2.classList.contains('away'));
    });
});
