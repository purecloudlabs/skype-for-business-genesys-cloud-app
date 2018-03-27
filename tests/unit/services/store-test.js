import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { mockConversationModel, mockSkypeConversation, mockSkypePerson, mockUserModel } from '../../helpers/mock-data';


module('Unit | Service | store', function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
        assert.ok(this.owner.lookup('service:store'));
    });

    module('Conversations', function (hooks) {
        let conv1, user1;

        hooks.beforeEach(function () {
            user1 = mockUserModel({ id: 1 });
            conv1 = mockConversationModel({ id: 1, users: [user1], owner: this.owner });
            const store = this.owner.lookup('service:store');
            store.set('conversations', [conv1]);
            store.set('users', [user1]);
        });

        test('incoming conversations are loaded into store', function (assert) {
            const store = this.owner.lookup('service:store');
            const skypeConversation = mockSkypeConversation({ id: 2 });
            store.addConversation(skypeConversation);
            assert.equal(store.get('conversations.length'), 2, 'New conversation added to the store');
            assert.deepEqual(store.get('conversations').mapBy('id'), [1, 2], 'Both conversations represented');
        });

        test('new conversations for the same creator are merged into a single conversation object', function (assert) {
            const store = this.owner.lookup('service:store');
            const creator = mockSkypePerson({ id: 1 });
            const skypeConversation = mockSkypeConversation({ id: 2, creator });
            store.addConversation(skypeConversation);
            assert.equal(store.get('conversations.length'), 1, 'New conversation not added to the store');
            assert.equal(conv1.get('extraConversations.length'), 1,
                'New conversation added to the original conversations extra collection');
        });
    });
});
