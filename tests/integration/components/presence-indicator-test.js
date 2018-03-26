import Ember from 'ember';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {mockUser} from "../../helpers/mock-data";


module('Integration | Component | presence-indicator', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        this.owner.register('service:skype', Ember.Service.extend());
        this.owner.register('service:store', Ember.Service.extend());
    });

    test('displays correct presence class for user', async function (assert) {
        const person = mockUser();

        this.set('user', person);

        await render(hbs`{{presence-indicator user=user}}`);

        const elem = this.element.querySelector('.presence-indicator');
        assert.ok(elem.classList.contains('presence-indicator'));
        assert.ok(elem.classList.contains('ion-checkmark-round'));

        this.set('user.presence', 'Away');
        this.set('user.presenceClass', 'away');

        assert.ok(elem.classList.contains('presence-indicator'));
        assert.ok(elem.classList.contains('ion-clock'));
    });
});
