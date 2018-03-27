import Ember from 'ember';
import {module, test} from 'qunit';
import {setupRenderingTest} from 'ember-qunit';
import {render} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {basicMockMessage, basicMockUser} from '../../helpers/mock-data';

module('Integration | Component | message-body', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        this.owner.register('service:skype', Ember.Service.extend());
        this.owner.register('service:store', Ember.Service.extend());
    });

    test('it renders', async function (assert) {
        const message = basicMockMessage();
        this.set('message', message);

        await render(hbs`{{message-body message=message}}`);

        assert.equal(
            this.element.querySelector('.text').textContent.trim(),
            message.get('text'));
    });

    test('it marks messages from logged in user', async function (assert) {
        const sender = basicMockUser();
        const message = basicMockMessage({ sender });

        this.set('message', message);
        this.set('me', sender);

        await render(hbs`{{message-body message=message me=me}}`);

        assert.equal(
            this.element.querySelectorAll('.is-you').length,
            1);
    });

    test('it doesnt mark messages not from logged in user', async function (assert) {
        this.set('message', basicMockMessage());

        await render(hbs`{{message-body message=message}}`);

        assert.equal(
            this.element.querySelectorAll('.is-you').length,
            0);
    });

    test('it marks messages that are unread', async function (assert) {
        this.set('message', basicMockMessage());

        await render(hbs`{{message-body message=message}}`);

        assert.equal(
            this.element.querySelectorAll('.unread').length,
            1);
    });

    test('it doesnt mark messages that are read', async function (assert) {
        this.set('message', basicMockMessage({ unread: false }));

        await render(hbs`{{message-body message=message}}`);

        assert.equal(
            this.element.querySelectorAll('.unread').length,
            0);
    });

});
