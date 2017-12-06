import Ember from 'ember';

const {
    computed,
    inject,
    Logger,
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
            Logger.info(`status changed to ${status}`);
        }, (err) => {
            Logger.error(err);
        });
    }
})
