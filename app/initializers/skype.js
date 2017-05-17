import SkypeService from '../services/skype';

export function initialize(application) {
    application.register('service:skype', SkypeService, { initialize: true, singleton: true });
}

export default {
  name: 'skype',
  initialize
};
