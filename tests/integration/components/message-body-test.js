import Ember from 'ember';
import {module, test} from 'qunit';
import {setupRenderingTest} from 'ember-qunit';
import {render} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {mockMessage} from "../../helpers/mock-data";

module('Integration | Component | message-body', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        this.owner.register('service:skype', Ember.Service.extend());
        this.owner.register('service:store', Ember.Service.extend());
    });

    test('it renders', async function (assert) {
        const message = mockMessage();

        this.set('message', message);

        await render(hbs`{{message-body message=message}}`);

        assert.equal(
            this.element.querySelector('.text').textContent.trim(),
            message.get('text'));
    });
});
