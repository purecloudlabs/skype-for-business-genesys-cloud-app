import Ember from 'ember';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { mockUserModel, mockConversationModel } from '../../helpers/mock-data';

let user1, user2;
let conv1, conv2;

module('Integration | Component | roster-list', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        this.owner.register('service:skype', Ember.Service.extend());
        const store = this.owner.lookup('service:store')

        user1 = mockUserModel({
            id: 1,
            displayName: 'Test 1',
            email: 'test1@email.com',
            presence: 'Available'
        });

        user2 = mockUserModel({
            id: 2,
            displayName: 'Test 2',
            email: 'test2@email.com',
            presence: 'Away'
        });

        store.users = [user1, user2];

        conv1 = mockConversationModel({
            id: 1,
            users: [user1],
            owner: this.owner
        });

        conv2 = mockConversationModel({
            id: 2,
            users: [user2],
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
