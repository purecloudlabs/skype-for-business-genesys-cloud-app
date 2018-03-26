import Ember from 'ember';
import RSVP from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';


module('Integration | Component | profile-image', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        this.owner.register('service:skype', Ember.Service.extend());
        this.owner.register('service:store', Ember.Service.extend());
    });

    test('displays initials on image load failure', async function (assert) {
        const person = Ember.Object.create({
            name: RSVP.resolve('Test McTesterson'),
            skypePhotoUrl: RSVP.resolve('1')
        });

        this.set('person', person);

        await render(hbs`{{profile-image person=person}}`);

        const elem = this.element.querySelector('.initials');
        assert.equal(elem.innerText, 'TM', 'Initials shown');
    });

    test('does not display initials on successful image load', async function (assert) {
        const person = Ember.Object.create({
            name: RSVP.resolve('Test McTesterson'),
            skypePhotoUrl: RSVP.resolve('https://placekitten.com/g/300/300')
        });

        this.set('person', person);

        await render(hbs`{{profile-image person=person}}`);

        await waitFor('.not-loading', {
            timeout: 2000
        });

        const elem = this.element.querySelector('.initials');
        assert.notOk(elem, 'Initials not shown');
    });
});
