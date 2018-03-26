import Ember from 'ember';
import moment from 'moment';
import RSVP from 'rsvp';
import {module, test} from 'qunit';
import {setupRenderingTest} from 'ember-qunit';
import {render} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | message-body', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        this.owner.register('service:skype', Ember.Service.extend());
        this.owner.register('service:store', Ember.Service.extend());
    });

    test('it renders', async function (assert) {
        const sender = Ember.Object.create({
            name: RSVP.resolve('Test McTesterson'),
            skypePhotoUrl: RSVP.resolve('1')
        });

        const message = Ember.Object.create({
            sender,
            timestamp: moment(),
            unread: true,
            text: "test message please ignore"
        });

        this.set('message', message);

        await render(hbs`{{message-body message=message}}`);

        assert.equal(
            this.element.querySelector('.text').textContent.trim(),
            "test message please ignore");
    });
});
