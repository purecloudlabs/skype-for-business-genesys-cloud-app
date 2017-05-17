import SkypeService from '../services/skype';

export function initialize(application) {
    application.register('service:skype', SkypeService, { initialize: true, singleton: true });
    window.App = application;
}

export default {
  name: 'skype',
  initialize
};
