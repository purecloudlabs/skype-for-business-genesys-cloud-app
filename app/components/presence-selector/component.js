import Ember from 'ember';

const {
    inject,
    computed,
    Component
} = Ember;

export default Component.extend({
    skype: inject.service(),
    presence: inject.service(),

    actions: {
        setStatus(status) {
            if (status === 'Available') {
                status = 'Online';
            }

            this.get('presence').setStatus(status);
        }
    },

    user: computed.reads('skype.user'),
    presences: computed.reads('presence.presences'),

    presenceList: computed('presences', 'user.presence', function () {
        const presence = this.get('user.presence');
        const presences = this.get('presences');
        return presences.map(({ label, key }) => {
            return {
                key,
                label,
                active: key.toLowerCase() === presence.toLowerCase()
            };
        })
    })
});
