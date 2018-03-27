import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { mockConversationModel, mockSkypeConversation, mockSkypePerson, mockUserModel } from '../../helpers/mock-data';


module('Unit | Service | store', function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
        assert.ok(this.owner.lookup('service:store'));
    });

    module('Users', function (hooks) {
        let store;

        hooks.beforeEach(function () {
            store = this.owner.lookup('service:store');
        });

        test('returns new user for skype person if it doesnt exist', function (assert) {
            const person = mockSkypePerson({ id: 1 });
            assert.equal(store.get('users.length'), 0, 'No users have been loaded');
            const user = store.getUserForPerson(person);
            assert.equal(store.get('users.length'), 1, 'New user was loaded into store');
            assert.equal(store.get('users.firstObject'), user, 'User in store is same as person');
        });

        test('returns cached user when it exists in store', function (assert) {
            const user = mockUserModel({ id: 1 })
            store.users.push(user);

            const person = mockSkypePerson({ id: 1 });
            const cachedUser = store.getUserForPerson(person);
            assert.equal(store.get('users.length'), 1, 'Store only contains previously loaded user');
            assert.equal(store.get('users.firstObject'), cachedUser, 'Cached user is the stores only stored user');
        });
    });

    module('Conversations', function (hooks) {
        let conv1, user1, store;

        hooks.beforeEach(function () {
            this.owner.register('service:skype', Service.extend({
                startConversation(id) {
                    return mockSkypeConversation({ id });
                }
            }));
        });

        hooks.beforeEach(function () {
            store = this.owner.lookup('service:store');
            user1 = mockUserModel({ id: 1 });
            conv1 = mockConversationModel({ id: 1, users: [user1], owner: this.owner });
            store.set('conversations', [conv1]);
            store.set('users', [user1]);
        });

        test('incoming conversations are loaded into store', function (assert) {
            const skypeConversation = mockSkypeConversation({ id: 2 });
            store.addConversation(skypeConversation);
            assert.equal(store.get('conversations.length'), 2, 'New conversation added to the store');
            assert.deepEqual(store.get('conversations').mapBy('id'), [1, 2], 'Both conversations represented');
        });

        test('new conversations for the same creator are merged into a single conversation object', function (assert) {
            const creator = mockSkypePerson({ id: 1 });
            const skypeConversation = mockSkypeConversation({ id: 2, creator });
            store.addConversation(skypeConversation);
            assert.equal(store.get('conversations.length'), 1, 'New conversation not added to the store');
            assert.equal(conv1.get('extraConversations.length'), 1,
                'New conversation added to the original conversations extra collection');
        });

        test('returns a cached conversation for a user', function (assert) {
            const conv = store.getConversationForUser(user1);
            assert.equal(store.get('conversations.length'), 1, 'A new conversation was not created');
            assert.equal(conv, conv1, 'The correct conversation was returned');
        });

        test('creates a new conversation for user when its not cached', function (assert) {
            const user = mockUserModel({ id: 2 });
            store.getConversationForUser(user);
            assert.equal(store.get('conversations.length'), 2, 'New conversation was created and cached');
        });
    });
});
