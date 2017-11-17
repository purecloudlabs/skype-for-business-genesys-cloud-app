import Ember from 'ember';

const {
    computed,
    Component
} = Ember;

const ICON_MAPPING = {
    available: 'ion-checkmark-round',
    away: 'ion-clock',
    offline: 'ion-close-round'
}

export default Component.extend({
    tagName: 'span',
    classNames: ['presence-indicator'],
    classNameBindings: ['user.presenceClass', 'iconClass'],

    user: null,

    iconClass: computed('user.presence', function () {
        const presence = this.get('user.presence').toLowerCase();
        return ICON_MAPPING[presence];
    })
});
