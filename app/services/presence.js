import Ember from 'ember';

const {
    computed,
    inject,
    Service
} = Ember;

export default Service.extend({
    skype: inject.service(),

    presences: computed(function () {
        return [
            { key: 'Available', label: 'Available' },
            { key: 'Away', label: 'Away' },
            { key: 'Busy', label: 'Busy' },
            { key: 'DoNotDisturb', label: 'Do Not Disturb' }
        ]
    }),

    userPresence: computed.alias('skype.application.personsAndGroupsManager.mePerson.status'),

    setStatus (status) {
        this.get('skype').application.personsAndGroupsManager.mePerson.status.set(status).then(() => {
            Ember.Logger.info('services/presence', `status changed to ${status}`);
        }, (error) => {
            Ember.Logger.warn('services/presence', 'set presence call failed', { error });
        });
    }
})
