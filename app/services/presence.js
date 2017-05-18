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
            { key: 'Online', label: 'Available' },
            { key: 'Busy', label: 'Busy' },
            { key: 'DoNotDisturb', label: 'Do Not Disturb' }
        ]
    }),

    userPresence: computed.alias('skype.application.personsAndGroupsManager.mePerson.status'),

    setStatus (status) {
        this.get('skype').application.personsAndGroupsManager.mePerson.status.set(status).then(() => {
            console.info(`status changed to ${status}`);
        }, (err) => {
            console.error(err);
        });
    }
})
