import Ember from 'ember';

const {
    Component,
    inject
} = Ember;

export default Component.extend({
    classNames: ['roster-list'],

    skype: inject.service()
});
