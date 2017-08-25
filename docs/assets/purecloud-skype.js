"use strict";



define('purecloud-skype/app', ['exports', 'ember', 'purecloud-skype/resolver', 'ember-load-initializers', 'purecloud-skype/config/environment'], function (exports, _ember, _resolver, _emberLoadInitializers, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    var App = void 0;

    _ember.default.MODEL_FACTORY_INJECTIONS = true;

    App = _ember.default.Application.extend({
        modulePrefix: _environment.default.modulePrefix,
        podModulePrefix: _environment.default.podModulePrefix,
        Resolver: _resolver.default,

        init: function init() {
            this._super.apply(this, arguments);

            window.App = this;
        },
        serviceFor: function serviceFor(name) {
            return this.__container__.lookup('service:' + name);
        }
    });

    (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

    exports.default = App;
});
define('purecloud-skype/components/basic-dropdown', ['exports', 'ember-basic-dropdown/components/basic-dropdown'], function (exports, _basicDropdown) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _basicDropdown.default;
    }
  });
});
define('purecloud-skype/components/basic-dropdown/content-element', ['exports', 'ember-basic-dropdown/components/basic-dropdown/content-element'], function (exports, _contentElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _contentElement.default;
    }
  });
});
define('purecloud-skype/components/basic-dropdown/content', ['exports', 'ember-basic-dropdown/components/basic-dropdown/content'], function (exports, _content) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _content.default;
    }
  });
});
define('purecloud-skype/components/basic-dropdown/trigger', ['exports', 'ember-basic-dropdown/components/basic-dropdown/trigger'], function (exports, _trigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _trigger.default;
    }
  });
});
define('purecloud-skype/components/conversation-entry/component', ['exports', 'ember', 'ember-data'], function (exports, _ember, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var computed = _ember.default.computed,
        RSVP = _ember.default.RSVP,
        Component = _ember.default.Component;
    exports.default = Component.extend({
        conversation: null,

        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);

            var conversation = this.get('conversation');
            conversation.historyService.activityItems.added(function (message) {
                debugger;
            });
        },


        displayName: computed('conversation', function () {
            var conversation = this.get('conversation');
            var promise = RSVP.resolve('Meeting');
            if (!conversation.isGroupConversation()) {
                debugger;
            }

            return _emberData.default.PromiseObject.create({ promise: promise });
        })
    });
});
define("purecloud-skype/components/conversation-entry/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "J+pXiPIQ", "block": "{\"statements\":[[1,[28,[\"displayName\",\"content\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/conversation-entry/template.hbs" } });
});
define('purecloud-skype/components/conversation-pane/component', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inject = _ember.default.inject,
        Component = _ember.default.Component;
    exports.default = Component.extend({
        classNames: ['conversation-pane'],
        skype: inject.service(),

        conversation: null,

        init: function init() {
            this._super.apply(this, arguments);
        },
        didInsertElement: function didInsertElement() {
            _ember.default.run.scheduleOnce('afterRender', this, this.renderConversation);
        },
        renderConversation: function renderConversation() {
            var conversation = this.get('conversation');
            this.get('skype').api.renderConversation(this.element, { conversation: conversation });
        }
    });
});
define("purecloud-skype/components/conversation-pane/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "GeOZWgvW", "block": "{\"statements\":[[0,\"Loading conversation...\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/conversation-pane/template.hbs" } });
});
define('purecloud-skype/components/ember-wormhole', ['exports', 'ember-wormhole/components/ember-wormhole'], function (exports, _emberWormhole) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _emberWormhole.default;
    }
  });
});
define("purecloud-skype/components/group-entry/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "MtEHpU5r", "block": "{\"statements\":[[0,\"group\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/group-entry/template.hbs" } });
});
define('purecloud-skype/components/presence-selector/component', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inject = _ember.default.inject,
        computed = _ember.default.computed,
        Component = _ember.default.Component;
    exports.default = Component.extend({
        skype: inject.service(),
        presence: inject.service(),

        actions: {
            setStatus: function setStatus(status) {
                if (status === 'Available') {
                    status = 'Online';
                }

                this.get('presence').setStatus(status);
            }
        },

        user: computed.reads('skype.user'),
        presences: computed.reads('presence.presences'),

        presenceList: computed('presences', 'user.presence', function () {
            var presence = this.get('user.presence');
            var presences = this.get('presences');
            return presences.map(function (_ref) {
                var label = _ref.label,
                    key = _ref.key;

                return {
                    key: key,
                    label: label,
                    active: key.toLowerCase() === presence.toLowerCase()
                };
            });
        })
    });
});
define("purecloud-skype/components/presence-selector/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "pxvu2vlm", "block": "{\"statements\":[[6,[\"each\"],[[28,[\"presenceList\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[16,\"class\",[34,[\"presence \",[28,[\"presence\",\"key\"]]]]],[5,[\"action\"],[[28,[null]],\"setStatus\",[28,[\"presence\",\"key\"]]]],[13],[0,\"\\n        \"],[11,\"div\",[]],[16,\"class\",[34,[\"selector \",[33,[\"if\"],[[28,[\"presence\",\"active\"]],\"active\"],null]]]],[13],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"label\"],[13],[0,\"\\n            \"],[1,[28,[\"presence\",\"label\"]],false],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[\"presence\"]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/presence-selector/template.hbs" } });
});
define('purecloud-skype/components/profile-image/component', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var computed = _ember.default.computed,
        Component = _ember.default.Component;
    exports.default = Component.extend({
        classNameBindings: ['person.presenceClass'],
        person: null,

        photoUrl: computed.reads('person.photoUrl'),

        showInitials: false,

        didInsertElement: function didInsertElement() {
            var _this = this;

            this._super.apply(this, arguments);

            this.$('img').on('load', function (event) {
                if (event.target.naturalHeight < 32) {
                    // hax
                    _this.set('showInitials', true);
                }
            }).on('error', function () {
                _this.set('showInitials', true);
            });
        },


        initials: computed('person.displayName', function () {
            var name = this.get('person.displayName');
            if (!name) {
                return '';
            }

            var _name$split = name.split(' '),
                _name$split2 = _slicedToArray(_name$split, 2),
                first = _name$split2[0],
                last = _name$split2[1];

            return '' + first.charAt(0) + last.charAt(0);
        })
    });
});
define("purecloud-skype/components/profile-image/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "+9fwmF4J", "block": "{\"statements\":[[11,\"img\",[]],[16,\"src\",[26,[\"photoUrl\"]],null],[13],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"showInitials\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"initials\"],[13],[0,\"\\n        \"],[1,[26,[\"initials\"]],false],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/profile-image/template.hbs" } });
});
define('purecloud-skype/components/roster-list/component', ['exports', 'ember', 'purecloud-skype/services/skype', 'purecloud-skype/models/user'], function (exports, _ember, _skype, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inject = _ember.default.inject,
        getOwner = _ember.default.getOwner,
        Logger = _ember.default.Logger,
        Component = _ember.default.Component;
    exports.default = Component.extend({
        classNames: ['roster-list'],

        skype: inject.service(),

        searchResults: [],

        init: function init() {
            this._super.apply(this, arguments);

            this.set('groups', []);
            this.set('generalContacts', []);

            window.GROUPS = this.get('groups');
            window.roster = this;
        },
        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);

            var skype = this.get('skype');

            skype.on(_skype.EVENTS.personAdded, this.addPerson.bind(this));
            skype.on(_skype.EVENTS.conversationAdded, this.addConversation.bind(this));
            skype.on(_skype.EVENTS.groupAdded, this.addGroup.bind(this));

            _ember.default.run.scheduleOnce('afterRender', this, this.fetchData);
        },


        actions: {
            clickContact: function clickContact(person) {
                this.get('skype').startConversation(person.get('person'));
            },
            searchHandler: function searchHandler(event) {
                var val = event.target.value;
                if (val !== '') {
                    this.set('searchLoading', true);
                    this.set('hideSearch', false);
                    _ember.default.run.debounce(this, this.handleSearch, val, 500);
                } else {
                    this.set('searchLoading', false);
                    this.set('hideSearch', true);
                    this.set('searchResults', []);
                }
            },
            addContact: function addContact(person) {
                var _this = this;

                this.get('skype').addContact(person).then(function () {
                    var group = _this.get('groups').filterBy('name', "Other Contacts")[0];
                    group.get('persons').pushObject(person);
                });
            }
        },

        handleSearch: function handleSearch(input) {
            var _this2 = this;

            if (!input) {
                this.set('searchResults', null);
                return;
            }

            var query = this.get('skype').application.personsAndGroupsManager.createPersonSearchQuery();
            query.limit(50);
            query.text(input);

            Logger.warn('Starting search for ' + input);

            query.getMore().then(function (results) {
                var list = results.map(function (result) {
                    return result.result;
                });
                _this2.set('searchResults', []);
                list.forEach(function (person) {
                    var personModel = _user.default.create({
                        person: person
                    }, getOwner(_this2).ownerInjection());

                    _this2.get('searchResults').pushObject(personModel);
                });
                _this2.set('searchLoading', false);
                Logger.log(list);
            }, function (err) {
                Logger.error(err);
            });
        },
        fetchData: function fetchData() {
            // const skype = this.get('skype');
            //
            // console.log('roster group search started');
            // skype.getAllGroups().then(groups => {
            //     console.log('roster groups: ', groups, groups.map(g => mapSkypeToPojo(g)));
            //     setTimeout(() => {
            //         console.log('roster groups delayed: ', groups, groups.map(g => mapSkypeToPojo(g)));
            //     }, 1000);
            //
            //     window.GROUPS = groups;
            //     // this.get('groups').addObjects(groups);
            // });
            //
            // console.log('roster person search started');
            // skype.get('application').personsAndGroupsManager.all.persons
            //     .get().then(function (contacts) {
            //         console.log('roster person search results: ', contacts, contacts.map(c => c.displayName()));
            //
            //     }, function (error) {
            //         console.log('roster person search error: ', error);
            //     });
        },
        addPerson: function addPerson(person) {
            var personModel = _user.default.create({
                person: person
            }, getOwner(this).ownerInjection());

            this.get('generalContacts').pushObject(personModel);
        },
        addConversation: function addConversation(conversation) {},
        addGroup: function addGroup(group) {
            var _this3 = this;

            var groupModel = _ember.default.Object.create();
            this.get('groups').unshiftObject(groupModel);

            group.id.get().then(function () {
                groupModel.set('id', group.id());
                groupModel.set('name', group.name());
                groupModel.set('persons', []);

                if (groupModel.get('name') === 'pinnedGroup') {
                    groupModel.set('name', 'Favorites');
                }
                if (groupModel.get('name') === 'Other Contacts') {
                    groupModel.set('name', 'Contacts');
                    groupModel.set('persons', _this3.get('generalContacts'));
                    return;
                }

                group.persons().forEach(function (person) {
                    var personModel = _user.default.create({
                        person: person
                    }, getOwner(_this3).ownerInjection());
                    groupModel.get('persons').pushObject(personModel);
                });
            });
        }
    });
});
define("purecloud-skype/components/roster-list/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "2fhUzYKF", "block": "{\"statements\":[[1,[33,[\"user-status-bar\"],null,[[\"user\"],[[28,[\"skype\",\"user\"]]]]],false],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"search-container\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"search\"],[13],[0,\"\\n        \"],[11,\"input\",[]],[15,\"class\",\"search-input\"],[15,\"type\",\"text\"],[15,\"placeholder\",\"Search For People\"],[16,\"onkeyup\",[33,[\"action\"],[[28,[null]],\"searchHandler\"],null],null],[13],[14],[0,\"\\n\"],[6,[\"if\"],[[28,[\"searchLoading\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"loading\"],[13],[0,\"\\n                \"],[11,\"span\",[]],[13],[0,\"Loading Results...\"],[14],[0,\"\\n            \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"each\"],[[28,[\"searchResults\"]]],null,{\"statements\":[[0,\"                \"],[11,\"div\",[]],[16,\"class\",[34,[\"search-result \",[33,[\"if\"],[[28,[\"hideSearch\"]],\"hide-search\"],null]]]],[5,[\"action\"],[[28,[null]],\"addContact\",[28,[\"result\"]]]],[13],[0,\"\\n                \"],[11,\"span\",[]],[15,\"class\",\"avatar\"],[13],[0,\"\\n                    \"],[1,[33,[\"profile-image\"],null,[[\"person\"],[[28,[\"result\"]]]]],false],[0,\"\\n                \"],[14],[0,\"\\n                    \"],[11,\"span\",[]],[15,\"class\",\"name\"],[13],[1,[28,[\"result\",\"displayName\"]],false],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[\"result\"]},null]],\"locals\":[]}],[0,\"    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"groups\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"groups\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"group-entry\"],[13],[0,\"\\n\\n            \"],[11,\"div\",[]],[15,\"class\",\"group-name\"],[13],[1,[28,[\"group\",\"name\"]],false],[14],[0,\"\\n\\n\"],[6,[\"each\"],[[28,[\"group\",\"persons\"]]],null,{\"statements\":[[0,\"                \"],[11,\"button\",[]],[15,\"class\",\"group-member\"],[16,\"onclick\",[33,[\"action\"],[[28,[null]],\"clickContact\",[28,[\"person\"]]],null],null],[13],[0,\"\\n                    \"],[11,\"span\",[]],[15,\"class\",\"avatar\"],[13],[0,\"\\n                        \"],[1,[33,[\"profile-image\"],null,[[\"person\"],[[28,[\"person\"]]]]],false],[0,\"\\n                    \"],[14],[0,\"\\n                    \"],[11,\"span\",[]],[15,\"class\",\"person-name\"],[13],[0,\"\\n                        \"],[1,[28,[\"person\",\"displayName\"]],false],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[\"person\"]},{\"statements\":[[0,\"                \"],[11,\"div\",[]],[15,\"class\",\"no-members\"],[13],[0,\"No members\"],[14],[0,\"\\n\"]],\"locals\":[]}],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[\"group\"]},null],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/roster-list/template.hbs" } });
});
define("purecloud-skype/components/user-status-bar/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "EdcQtwtS", "block": "{\"statements\":[[6,[\"basic-dropdown\"],null,null,{\"statements\":[[6,[\"component\"],[[28,[\"dropdown\",\"trigger\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"profile-picture\"],[13],[0,\"\\n            \"],[1,[33,[\"profile-image\"],null,[[\"person\"],[[28,[\"user\"]]]]],false],[0,\"\\n        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"component\"],[[28,[\"dropdown\",\"content\"]]],null,{\"statements\":[[0,\"        \"],[1,[26,[\"presence-selector\"]],false],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"dropdown\"]},null],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"information\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"name\"],[13],[0,\"\\n        \"],[1,[28,[\"user\",\"displayName\"]],false],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[16,\"class\",[34,[\"presence \",[28,[\"user\",\"presenceClass\"]]]]],[13],[0,\"\\n        \"],[1,[28,[\"user\",\"presence\"]],false],[0,\"\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/user-status-bar/template.hbs" } });
});
define('purecloud-skype/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('purecloud-skype/controllers/index', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inject = _ember.default.inject,
        Controller = _ember.default.Controller;
    exports.default = Controller.extend({
        skype: inject.service(),

        loading: false,

        init: function init() {
            var _this = this;

            this.set('loading', true);

            this.get('skype').startAuthentication().then(function () {
                _this.set('loading', false);
            });
        }
    });
});
define('purecloud-skype/helpers/app-version', ['exports', 'ember', 'purecloud-skype/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = _ember.default.Helper.helper(appVersion);
});
define('purecloud-skype/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('purecloud-skype/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('purecloud-skype/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'purecloud-skype/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _config$APP = _environment.default.APP,
      name = _config$APP.name,
      version = _config$APP.version;
  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('purecloud-skype/initializers/component-styles', ['exports', 'ember', 'ember-component-css/pod-names', 'purecloud-skype/mixins/style-namespacing-extras'], function (exports, _ember, _podNames, _styleNamespacingExtras) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  var Component = _ember.default.Component,
      ComponentLookup = _ember.default.ComponentLookup,
      computed = _ember.default.computed,
      getOwner = _ember.default.getOwner;


  ComponentLookup.reopen({
    componentFor: function componentFor(name, owner) {
      owner = owner.hasRegistration ? owner : getOwner(this);

      if (_podNames.default[name] && !owner.hasRegistration('component:' + name)) {
        owner.register('component:' + name, Component);
      }
      return this._super.apply(this, arguments);
    }
  });

  Component.reopen(_styleNamespacingExtras.default, {
    componentCssClassName: computed({
      get: function get() {
        return _podNames.default[this.get('_componentIdentifier')] || '';
      }
    }),

    init: function init() {
      this._super.apply(this, arguments);

      if (this.get('_shouldAddNamespacedClassName')) {
        this.classNames = this.classNames.concat(this.get('componentCssClassName'));
      }
    }
  });

  function initialize() {}

  exports.default = {
    name: 'component-styles',
    initialize: initialize
  };
});
define('purecloud-skype/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('purecloud-skype/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('purecloud-skype/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/index'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('purecloud-skype/initializers/export-application-global', ['exports', 'ember', 'purecloud-skype/config/environment'], function (exports, _ember, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember.default.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('purecloud-skype/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('purecloud-skype/initializers/skype', ['exports', 'purecloud-skype/services/skype'], function (exports, _skype) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(application) {
    application.register('service:skype', _skype.default, { initialize: true, singleton: true });
  }

  exports.default = {
    name: 'skype',
    initialize: initialize
  };
});
define('purecloud-skype/initializers/store', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('purecloud-skype/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("purecloud-skype/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('purecloud-skype/mixins/style-namespacing-extras', ['exports', 'ember-component-css/mixins/style-namespacing-extras'], function (exports, _styleNamespacingExtras) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _styleNamespacingExtras.default;
    }
  });
});
define('purecloud-skype/models/user', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var inject = _ember.default.inject,
        computed = _ember.default.computed;
    exports.default = _ember.default.Object.extend({
        ajax: inject.service(),
        skype: inject.service(),

        person: null,

        init: function init() {
            var _this = this;

            this._super.apply(this, arguments);

            var person = this.get('person');

            person.id.get().then(function () {
                return _this.set('id', person.id());
            });
            person.displayName.get().then(function () {
                return _this.set('displayName', person.displayName());
            });
            person.avatarUrl.get().then(function () {
                return _this.set('avatarUrl', person.avatarUrl());
            });
            if (!person.email) {
                person.emails.get().then(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 1),
                        email = _ref2[0];

                    return _this.set('email', email.emailAddress());
                });
            } else {
                person.email.get().then(function () {
                    return _this.set('email', person.email());
                });
            }
            person.status.get().then(function () {
                return _this.set('rawPresence', person.status());
            });

            this.subscribeToProperties();
            this.setupPhoto();
        },


        rawPresence: computed(function () {
            return 'Offline';
        }),

        presence: computed('rawPresence', function () {
            var status = this.get('person').status();
            var map = {
                Online: 'Available',
                Busy: 'Busy',
                DoNotDisturb: 'Do Not Disturb',
                Away: 'Away'
            };

            if (map[status]) {
                return map[status];
            }

            return status;
        }),

        presenceClass: computed('presence', function () {
            var presence = this.get('presence');
            if (presence) {
                return presence.toLowerCase();
            } else {
                return 'Offline';
            }
        }),

        photoUrl: computed('email', function () {
            var email = this.get('email');
            if (!email) {
                return null;
            }
            return 'https://outlook.office.com/owa/service.svc/s/GetPersonaPhoto?email=' + email + '&UA=0&size=HR64x64';
        }),

        setupPhoto: function setupPhoto() {
            var _this2 = this;

            var ajax = this.get('ajax');
            this.get('person').avatarUrl.get().then(function () {
                ajax.request(_this2.get('avatarUrl'), {
                    headers: {
                        Authorization: 'Bearer ' + _this2.get('skype.authData.access_token')
                    }
                });
            });
        },
        subscribeToProperties: function subscribeToProperties() {
            var _this3 = this;

            this.get('person').status.changed(function () {
                return _this3.notifyPropertyChange('presence');
            });
        }
    });
});
define('purecloud-skype/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('purecloud-skype/router', ['exports', 'ember', 'purecloud-skype/config/environment'], function (exports, _ember, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = _ember.default.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {});

  exports.default = Router;
});
define('purecloud-skype/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('purecloud-skype/services/presence', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var computed = _ember.default.computed,
        inject = _ember.default.inject,
        Service = _ember.default.Service;
    exports.default = Service.extend({
        skype: inject.service(),

        presences: computed(function () {
            return [{ key: 'Available', label: 'Available' }, { key: 'Away', label: 'Away' }, { key: 'Busy', label: 'Busy' }, { key: 'DoNotDisturb', label: 'Do Not Disturb' }];
        }),

        userPresence: computed.alias('skype.application.personsAndGroupsManager.mePerson.status'),

        setStatus: function setStatus(status) {
            this.get('skype').application.personsAndGroupsManager.mePerson.status.set(status).then(function () {
                console.info('status changed to ' + status);
            }, function (err) {
                console.error(err);
            });
        }
    });
});
define('purecloud-skype/services/skype', ['exports', 'ember', 'purecloud-skype/models/user'], function (exports, _ember, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EVENTS = undefined;

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var getOwner = _ember.default.getOwner,
        RSVP = _ember.default.RSVP,
        Logger = _ember.default.Logger,
        Service = _ember.default.Service,
        Evented = _ember.default.Evented;


    var config = {
        apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255', // SDK
        apiKeyCC: '9c967f6b-a846-4df2-b43d-5167e47d81e1' // SDK+UI
    };

    var redirectUri = window.location.host.indexOf('localhost') > -1 ? 'https://localhost:4200/skype-for-business-purecloud-app/' : 'https://mypurecloud.github.io/skype-for-business-purecloud-app/';

    var appConfigProperties = {
        // "displayName": "purecloud-skype",
        // "applicationID": "521f4c8f-9048-4337-bf18-6495ca21e415",
        // "applicationType": "Web app / API",
        // "objectID": "bd59e8f7-7455-4bb5-8e5e-7a0f1988e144",
        // "homePage": "https://mypurecloud.github.io/skype-for-business-purecloud-app/",
        "displayName": "purecloudskype",
        "applicationID": "ec744ffe-d332-454a-9f13-b9f7ebe8b249",
        "applicationType": "Web app / API",
        "objectID": "45185d32-9960-42ad-beed-6b02215f8ba2",
        "homePage": "https://mypurecloud.github.io/skype-for-business-purecloud-app/"
    };

    var EVENTS = exports.EVENTS = {
        groupAdded: 'GROUP_ADDED',
        groupRemoved: 'GROUP_REMOVED',
        personAdded: 'PERSON_ADDED',
        personRemoved: 'PERSON_REMOVED',
        conversationAdded: 'CONVERSATION_ADDED',
        conversationRemoved: 'CONVERSATION_REMOVED'
    };

    exports.default = Service.extend(Evented, {
        ajax: _ember.default.inject.service(),

        promise: null,

        init: function init() {
            var _this = this;

            window.skype = this;

            this._super.apply(this, arguments);

            var deferred = RSVP.defer();
            this.promise = deferred.promise;

            window.Skype.initialize({
                apiKey: config.apiKeyCC,
                supportsAudio: true,
                supportsVideo: true,
                convLogSettings: true
            }, function (api) {
                _this.api = api;
                _this.application = api.UIApplicationInstance;

                deferred.resolve();
            }, function (error) {
                Logger.error('There was an error loading the api:', error);
            });
        },
        startAuthentication: function startAuthentication() {
            var _this2 = this;

            return this.promise.then(function () {
                if (window.location.href.indexOf('#') > 0) {
                    return _this2.extractToken();
                }

                var baseUrl = 'https://login.microsoftonline.com/common/oauth2/authorize';
                var authData = {
                    response_type: 'token',
                    client_id: appConfigProperties.applicationID,
                    state: 'dummy',
                    redirect_uri: redirectUri,
                    resource: 'https://webdir.online.lync.com'
                };

                var params = Object.keys(authData).map(function (key) {
                    var value = authData[key];
                    return key + '=' + value;
                });

                window.location.href = baseUrl + '/?' + params.join('&');

                return new RSVP.Promise(function () {}); // never resolve
            });
        },
        extractToken: function extractToken() {
            var hash = window.location.hash.substr(1).split('&');
            var data = {};
            hash.forEach(function (info) {
                var _info$split = info.split('='),
                    _info$split2 = _slicedToArray(_info$split, 2),
                    key = _info$split2[0],
                    value = _info$split2[1];

                data[key] = value;
            });
            this.authData = data;
            return this.signIn();
        },
        signIn: function signIn() {
            var _this3 = this;

            var options = {
                client_id: appConfigProperties.applicationID,
                origins: ['https://webdir.online.lync.com/autodiscover/autodiscoverservice.svc/root'],
                cors: true,
                version: 'PurecloudSkype/0.0.0',
                redirect_uri: redirectUri
            };
            return this.application.signInManager.signIn(options).then(function () {
                var me = _this3.application.personsAndGroupsManager.mePerson;
                var user = _user.default.create({ person: me }, getOwner(_this3).ownerInjection());
                _this3.set('user', user);

                _this3.registerForEvents();
            });
        },
        registerForEvents: function registerForEvents() {
            var _this4 = this;

            var app = this.application;
            var conversations = app.conversationsManager.conversations;
            var groups = app.personsAndGroupsManager.all.groups;
            var persons = app.personsAndGroupsManager.all.persons;

            conversations.subscribe();
            groups.subscribe();
            persons.subscribe();

            groups.added(function (group) {
                Logger.info('Group added', group);
                _this4.trigger(EVENTS.groupAdded, group);
            });
            groups.removed(function (group) {
                Logger.info('Group added', group);
                _this4.trigger(EVENTS.groupRemoved, group);
            });

            persons.added(function (person) {
                Logger.info('Person added', person);
                _this4.trigger(EVENTS.personAdded, person);
            });

            conversations.added(function (conversation) {
                Logger.info('Conversation added', conversation);
                _this4.trigger(EVENTS.conversationAdded, conversation);
            });
        },
        addContact: function addContact(person) {
            var groups = this.get('application').personsAndGroupsManager.all.groups();
            var group = groups[this.get('application').personsAndGroupsManager.all.groups().map(function (p) {
                return p.name();
            }).indexOf('Other Contacts')];

            return group.persons.add(person.get('id')).then(function () {
                Logger.log('added ' + person.displayName + ' to ' + group.name());
            }, function (err) {
                Logger.error(err);
            });
        },


        // Chat

        startChat: function startChat(id) {
            var conversationManager;
            var listeners;
            var conversation = conversationManager.getConversation(id);
            // do stuff with chat listeners
            listeners.push(conversation.selfParticipant.chat.state.when('Connected', function () {
                // Connected to chat
            }));
        },
        sendMessage: function sendMessage(message) {
            var conversation;
            conversation.chatService.sendMessage(message);
        },


        // Audio & Video

        startAudio: function startAudio(id) {
            var conversationManager;
            var conversation = conversationManager.getConversation(id);
            conversation.participants.added(function (participant) {
                //participant added
                participant; //appease lint
            });
            conversation.audioService.start();
        },
        startVideo: function startVideo() {
            // appears to assume/require that an audio conversation has been started first
            var conversation;
            conversation.videoService.start(null, function (error) {
                // error handler
                error; //appease lint
            });
        },
        endConversation: function endConversation(conversation) {
            //video, audio or chat (?)
            conversation.leave();
        },
        getAllGroups: function getAllGroups() {
            return this.application.personsAndGroupsManager.all.groups.get().then(function (groups) {
                return groups.filter(function (group) {
                    return !!group.id();
                });
            });
        },
        startConversation: function startConversation(person) {
            var _this5 = this;

            this.set('activeConversation', null);

            _ember.default.run.next(function () {
                var conversation = _this5.application.conversationsManager.getConversation(person);
                _this5.set('activeConversation', conversation);
                window.CONVERSATION = conversation;
            });
        }
    });
});
define("purecloud-skype/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Hu8LtFwX", "block": "{\"statements\":[[1,[26,[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/templates/application.hbs" } });
});
define("purecloud-skype/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ybTv6FLO", "block": "{\"statements\":[[6,[\"if\"],[[28,[\"loading\"]]],null,{\"statements\":[[0,\"    \"],[11,\"h2\",[]],[13],[0,\"Loading!\"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"skype-for-business-app\"],[13],[0,\"\\n        \"],[1,[26,[\"roster-list\"]],false],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"skype\",\"activeConversation\"]]],null,{\"statements\":[[0,\"            \"],[1,[33,[\"conversation-pane\"],null,[[\"conversation\"],[[28,[\"skype\",\"activeConversation\"]]]]],false],[0,\"\\n\"]],\"locals\":[]},null],[0,\"    \"],[14],[0,\"\\n\"]],\"locals\":[]}]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/templates/index.hbs" } });
});


define('purecloud-skype/config/environment', ['ember'], function(Ember) {
  var prefix = 'purecloud-skype';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("purecloud-skype/app")["default"].create({"name":"purecloud-skype","version":"0.0.0+39373f4f"});
}
//# sourceMappingURL=purecloud-skype.map
