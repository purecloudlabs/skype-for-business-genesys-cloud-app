import Ember from 'ember';
import {module, test} from 'qunit';
import {setupRenderingTest} from 'ember-qunit';
import {render} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {mockMessage} from "../../helpers/mock-data";

module('Integration | Component | messages-panel', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        this.owner.register('service:skype', Ember.Service.extend());
        this.owner.register('service:store', Ember.Service.extend());
    });

    test('it renders all the messages passed to it', async function (assert) {
        const messages = [
            mockMessage({ text: "message 1" }),
            mockMessage({ text: "message 2" }),
            mockMessage({ text: "message 3" }),
            mockMessage({ text: "message 4" }),
            mockMessage({ text: "message 5" }),
        ];

        this.set('messages', messages);

        await render(hbs`{{messages-panel messages=messages}}`);

        const panelContent = this.element.textContent;
        const messageElements = this.element.querySelectorAll('.message-body');

        assert.equal(
            messageElements.length,
            5);

        messages.forEach(({text}) => assert.ok(
            panelContent.indexOf(text) > -1
        ));
    });
});
