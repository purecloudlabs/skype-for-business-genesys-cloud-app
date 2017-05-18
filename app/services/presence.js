import Ember from 'ember';

const {
    computed,
    Service
} = Ember;

export default Service.extend({
    presences: computed(function () {
        return [
            { key: 'Online', label: 'Available' },
            { key: 'Busy', label: 'Busy' },
            { key: 'DoNotDisturb', label: 'Do Not Disturb' }
        ]
    })
})
