import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { mockConversationModel, mockSkypeConversation } from '../../helpers/mock-data';


module('Unit | Service | store', function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
        assert.ok(this.owner.lookup('service:store'));
    });

    module('Conversations', function (hooks) {
        let conv1;

        hooks.beforeEach(function () {
            conv1 = mockConversationModel({ id: 1, owner: this.owner });
            const store = this.owner.lookup('service:store');
            store.set('conversations', [conv1]);
        });

        test('incoming conversations are loaded into store', function (assert) {
            const store = this.owner.lookup('service:store');
            const skypeConversation = mockSkypeConversation({ id: 2 });
            store.addConversation(skypeConversation);
            assert.equal(store.get('conversations.length'), 2, 'New conversation added to the store');
            assert.deepEqual(store.get('conversations').mapBy('id'), [1, 2], 'Both conversations represented');
        });
    });
});
