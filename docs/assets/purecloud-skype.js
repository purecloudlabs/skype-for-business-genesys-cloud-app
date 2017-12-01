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
        },


        componentFor: function componentFor(id) {
            return this.__container__.lookup('-view-registry:main')[id];
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
        computed = _ember.default.computed,
        Component = _ember.default.Component;
    exports.default = Component.extend({
        classNames: ['conversation-pane'],

        store: inject.service(),
        conversation: computed.alias('store.activeConversation'),

        target: computed.alias('conversation.conversationTarget'),

        actions: {
            keyup: function keyup(_ref) {
                var key = _ref.key,
                    keyCode = _ref.keyCode,
                    shiftKey = _ref.shiftKey,
                    target = _ref.target;

                if ((key === "Enter" || keyCode === 13) && !shiftKey) {
                    var messageText = target.value;

                    console.log("SEND", messageText);
                    this.get('conversation').sendMessage(messageText);

                    target.value = "";
                }
            }
        }
    });
});
define("purecloud-skype/components/conversation-pane/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "PJQBA/rb", "block": "{\"statements\":[[6,[\"if\"],[[28,[\"conversation\"]]],null,{\"statements\":[[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"user-header\"],[13],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"avatar\"],[13],[1,[33,[\"profile-image\"],null,[[\"person\"],[[28,[\"target\"]]]]],false],[14],[0,\"\\n        \"],[11,\"div\",[]],[15,\"class\",\"name\"],[13],[1,[28,[\"target\",\"displayName\"]],false],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"action-header\"],[13],[0,\"\\n        \"],[11,\"button\",[]],[15,\"class\",\"initiate-call\"],[13],[0,\" \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[1,[33,[\"messages-panel\"],null,[[\"messages\"],[[28,[\"conversation\",\"messages\"]]]]],false],[0,\"\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"input-footer\"],[13],[0,\"\\n        \"],[11,\"textarea\",[]],[16,\"onkeyup\",[33,[\"action\"],[[28,[null]],\"keyup\"],null],null],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"empty-panel\"],[13],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"ion-more\"],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n\"]],\"locals\":[]}]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/conversation-pane/template.hbs" } });
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
define('purecloud-skype/components/message-body/component', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = _ember.default.Component,
        computed = _ember.default.computed,
        inject = _ember.default.inject;
    exports.default = Component.extend({
        classNames: ['message-body '],
        classNameBindings: ['isYou:is-you:not-you'],

        store: inject.service(),

        message: null,
        sender: computed.alias('message.sender'),
        me: computed.alias('store.me'),

        isYou: computed('me', 'sender', function () {
            return this.get('me') === this.get('sender');
        })
    });
});
define("purecloud-skype/components/message-body/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "4SpuVbUr", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"avatar\"],[13],[0,\"\\n    \"],[1,[33,[\"profile-image\"],null,[[\"person\"],[[28,[\"message\",\"sender\"]]]]],false],[0,\"\\n\"],[14],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"body\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"user\"],[13],[0,\"\\n        \"],[1,[28,[\"message\",\"sender\",\"displayName\"]],false],[0,\"\\n        \"],[11,\"span\",[]],[15,\"class\",\"timestamp\"],[13],[0,\"\\n            \"],[1,[33,[\"moment-calendar\"],[[28,[\"message\",\"timestamp\"]]],null],false],[0,\"\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"text\"],[13],[1,[28,[\"message\",\"text\"]],false],[14],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/message-body/template.hbs" } });
});
define('purecloud-skype/components/messages-panel/component', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = _ember.default.Component,
        observer = _ember.default.observer,
        run = _ember.default.run;
    exports.default = Component.extend({
        classNames: ['messages-panel'],
        messages: null,

        messagesAdded: observer('messages.[]', function () {
            run.scheduleOnce('afterRender', this, this.scrollToBottom);
        }),
        scrollToBottom: function scrollToBottom() {
            this.element.scrollTop = this.element.scrollHeight;
        }
    });
});
define("purecloud-skype/components/messages-panel/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "TfEYuHWo", "block": "{\"statements\":[[6,[\"each\"],[[28,[\"messages\"]]],null,{\"statements\":[[0,\"    \"],[1,[33,[\"message-body\"],null,[[\"message\"],[[28,[\"message\"]]]]],false],[0,\"\\n\"]],\"locals\":[\"message\"]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/messages-panel/template.hbs" } });
});
define('purecloud-skype/components/presence-indicator/component', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var computed = _ember.default.computed,
        Component = _ember.default.Component;


    var ICON_MAPPING = {
        available: 'ion-checkmark-round',
        away: 'ion-clock',
        offline: 'ion-ios-circle-outline'
    };

    exports.default = Component.extend({
        tagName: 'span',
        classNames: ['presence-indicator'],
        classNameBindings: ['user.presenceClass', 'iconClass'],

        user: null,

        iconClass: computed('user.presence', function () {
            var presence = this.get('user.presence');
            if (presence) {
                return ICON_MAPPING[presence.toLowerCase()];
            } else {
                return ICON_MAPPING['offline'];
            }
        })
    });
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

    var run = _ember.default.run,
        observer = _ember.default.observer,
        computed = _ember.default.computed,
        Component = _ember.default.Component;
    exports.default = Component.extend({
        classNameBindings: [],

        person: null,
        showInitials: true,

        enablePresenceIndicator: true,

        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);

            this.processPhoto();
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
        }),

        processPhoto: observer('person.photoUrl', function () {
            var _this = this;

            this.get('person.photoUrl').then(function (url) {
                if (!url) {
                    run.scheduleOnce('afterRender', _this, _this.set, 'showInitials', true);
                } else {
                    run.scheduleOnce('afterRender', _this, _this.set, 'showInitials', false);
                }
            }).catch(function () {
                run.scheduleOnce('afterRender', _this, _this.set, 'showInitials', true);
            });
        })
    });
});
define("purecloud-skype/components/profile-image/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "GqPX21V6", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"image-container\"],[13],[0,\"\\n    \"],[11,\"img\",[]],[16,\"src\",[33,[\"await\"],[[28,[\"person\",\"photoUrl\"]]],null],null],[13],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"enablePresenceIndicator\"]]],null,{\"statements\":[[0,\"    \"],[1,[33,[\"presence-indicator\"],null,[[\"user\"],[[28,[\"person\"]]]]],false],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[6,[\"if\"],[[28,[\"showInitials\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"initials\"],[13],[0,\"\\n        \"],[1,[26,[\"initials\"]],false],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/profile-image/template.hbs" } });
});
define('purecloud-skype/components/roster-list/component', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inject = _ember.default.inject,
        computed = _ember.default.computed,
        RSVP = _ember.default.RSVP,
        Logger = _ember.default.Logger,
        Component = _ember.default.Component;
    exports.default = Component.extend({
        classNames: ['roster-list'],

        skype: inject.service(),
        store: inject.service(),

        searchQuery: null,

        generalContacts: computed.alias('store.contacts'),
        activeConversations: computed.alias('store.conversations'),

        actions: {
            selectConversation: function selectConversation(conversation) {
                this.get('store').setActiveConversation(conversation);
            },
            searchHandler: function searchHandler(event) {
                var value = event.target.value;
                _ember.default.run.debounce(this, this.set, 'searchQuery', value, 500);
            },
            selectSearchResult: function selectSearchResult(user) {
                this.$('input').val('');
                this.set('searchQuery', null);

                this.get('store').startConversation(user);
            }
        },

        hideSearch: computed('searchQuery', function () {
            return !this.get('searchQuery');
        }),

        searchResults: computed('searchQuery', function () {
            var _this = this;

            var search = this.get('searchQuery');
            if (!search) {
                return RSVP.resolve([]);
            }

            var query = this.get('skype').application.personsAndGroupsManager.createPersonSearchQuery();
            query.limit(20);
            query.text(search);

            Logger.log('Starting search for', { query: query });

            return new RSVP.Promise(function (resolve, reject) {
                query.getMore().then(function (results) {
                    var data = results.map(function (result) {
                        return _this.get('store').getUserForPerson(result.result);
                    });
                    Logger.log('Results:', { data: data });
                    resolve(data);
                }, function (error) {
                    Logger.error('Failed loading results', { error: error });
                    reject({ error: error });
                });
            });
        })
    });
});
define("purecloud-skype/components/roster-list/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "7XBZ/UYm", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"heading\"],[13],[0,\"\\n    \"],[11,\"h3\",[]],[13],[0,\"\\n        Skype Contacts\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"search-container\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"search-input\"],[13],[0,\"\\n        \"],[11,\"input\",[]],[15,\"class\",\"search-input\"],[15,\"type\",\"text\"],[15,\"placeholder\",\"Start a conversation\"],[16,\"onkeyup\",[33,[\"action\"],[[28,[null]],\"searchHandler\"],null],null],[13],[14],[0,\"\\n\\n        \"],[11,\"i\",[]],[15,\"class\",\"ion-search\"],[13],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[16,\"class\",[34,[\"search-results \",[33,[\"if\"],[[28,[\"hideSearch\"]],\"hide\"],null]]]],[13],[0,\"\\n\"],[6,[\"if\"],[[33,[\"is-pending\"],[[28,[\"searchResults\"]]],null]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"search-result loading\"],[13],[0,\"\\n                Loading results...\\n            \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[6,[\"each\"],[[33,[\"await\"],[[28,[\"searchResults\"]]],null]],null,{\"statements\":[[0,\"                \"],[11,\"div\",[]],[15,\"class\",\"search-result\"],[13],[0,\"\\n                    \"],[11,\"a\",[]],[15,\"href\",\"#\"],[5,[\"action\"],[[28,[null]],\"selectSearchResult\",[28,[\"result\"]]]],[13],[0,\"\\n                        \"],[11,\"span\",[]],[15,\"class\",\"name\"],[13],[1,[28,[\"result\",\"displayName\"]],false],[14],[0,\"\\n                    \"],[14],[0,\"\\n                \"],[14],[0,\"\\n\"]],\"locals\":[\"result\"]},{\"statements\":[[0,\"                \"],[11,\"div\",[]],[15,\"class\",\"search-result empty\"],[13],[0,\"\\n                    No results...\\n                \"],[14],[0,\"\\n\"]],\"locals\":[]}]],\"locals\":[]}],[0,\"    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"roster-group direct-messages\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"roster-heading\"],[13],[0,\"\\n        \"],[11,\"h3\",[]],[13],[0,\"\\n            Direct Messages\\n        \"],[14],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[15,\"class\",\"roster-entries\"],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"activeConversations\"]]],null,{\"statements\":[[0,\"            \"],[11,\"div\",[]],[15,\"class\",\"roster-entry\"],[5,[\"action\"],[[28,[null]],\"selectConversation\",[28,[\"conversation\"]]]],[13],[0,\"\\n                \"],[1,[33,[\"presence-indicator\"],null,[[\"user\"],[[28,[\"conversation\",\"conversationTarget\"]]]]],false],[0,\"\\n\\n                \"],[11,\"div\",[]],[15,\"class\",\"name\"],[13],[0,\"\\n                    \"],[1,[28,[\"conversation\",\"name\"]],false],[0,\"\\n                \"],[14],[0,\"\\n\\n                \"],[11,\"div\",[]],[15,\"class\",\"close\"],[13],[0,\"\\n                    \"],[11,\"i\",[]],[15,\"class\",\"ion-close-circled\"],[13],[14],[0,\"\\n                \"],[14],[0,\"\\n            \"],[14],[0,\"\\n\"]],\"locals\":[\"conversation\"]},null],[0,\"    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/roster-list/template.hbs" } });
});
define("purecloud-skype/components/user-status-bar/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "0lTTzhdS", "block": "{\"statements\":[[6,[\"basic-dropdown\"],null,null,{\"statements\":[[6,[\"component\"],[[28,[\"dropdown\",\"trigger\"]]],null,{\"statements\":[[0,\"        \"],[11,\"div\",[]],[15,\"class\",\"profile-picture\"],[13],[0,\"\\n\"],[0,\"        \"],[14],[0,\"\\n\"]],\"locals\":[]},null],[6,[\"component\"],[[28,[\"dropdown\",\"content\"]]],null,{\"statements\":[[0,\"        \"],[1,[26,[\"presence-selector\"]],false],[0,\"\\n\"]],\"locals\":[]},null]],\"locals\":[\"dropdown\"]},null],[0,\"\\n\"],[11,\"div\",[]],[15,\"class\",\"information\"],[13],[0,\"\\n    \"],[11,\"div\",[]],[15,\"class\",\"name\"],[13],[0,\"\\n        \"],[1,[28,[\"user\",\"displayName\"]],false],[0,\"\\n    \"],[14],[0,\"\\n\\n    \"],[11,\"div\",[]],[16,\"class\",[34,[\"presence \",[28,[\"user\",\"presenceClass\"]]]]],[13],[0,\"\\n        \"],[1,[28,[\"user\",\"presence\"]],false],[0,\"\\n    \"],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/user-status-bar/template.hbs" } });
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
        auth: inject.service(),

        skype: inject.service(),
        //
        // loading: false,
        //
        // init() {
        //     this.set('loading', true);
        //
        //     this.get('skype').startAuthentication().then(() => {
        //         this.set('loading', false);
        //     });
        // }
        actions: {
            startAuth: function startAuth() {
                var _arguments = arguments;

                var auth = this.get('auth');
                var skype = this.get('skype');

                auth.loginMicrosoft().then(function (token) {
                    _ember.default.Logger.log('TOKEN:', token);
                }).then(function () {
                    return skype.get('promise');
                }).then(function () {
                    return skype.signIn();
                }).then(function () {
                    _ember.default.log('done?', _arguments);
                }).catch(function (error) {
                    _ember.default.Logger.error('Error authenticating:', { error: error });
                });
            }
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
define('purecloud-skype/helpers/await', ['exports', 'ember-promise-helpers/helpers/await'], function (exports, _await) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _await.default;
    }
  });
});
define('purecloud-skype/helpers/is-after', ['exports', 'ember-moment/helpers/is-after'], function (exports, _isAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isAfter.default;
    }
  });
});
define('purecloud-skype/helpers/is-before', ['exports', 'ember-moment/helpers/is-before'], function (exports, _isBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isBefore.default;
    }
  });
});
define('purecloud-skype/helpers/is-between', ['exports', 'ember-moment/helpers/is-between'], function (exports, _isBetween) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isBetween.default;
    }
  });
});
define('purecloud-skype/helpers/is-fulfilled', ['exports', 'ember-promise-helpers/helpers/is-fulfilled'], function (exports, _isFulfilled) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isFulfilled.default;
    }
  });
  Object.defineProperty(exports, 'isFulfilled', {
    enumerable: true,
    get: function () {
      return _isFulfilled.isFulfilled;
    }
  });
});
define('purecloud-skype/helpers/is-pending', ['exports', 'ember-promise-helpers/helpers/is-pending'], function (exports, _isPending) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isPending.default;
    }
  });
  Object.defineProperty(exports, 'isPending', {
    enumerable: true,
    get: function () {
      return _isPending.isPending;
    }
  });
});
define('purecloud-skype/helpers/is-rejected', ['exports', 'ember-promise-helpers/helpers/is-rejected'], function (exports, _isRejected) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isRejected.default;
    }
  });
  Object.defineProperty(exports, 'isRejected', {
    enumerable: true,
    get: function () {
      return _isRejected.isRejected;
    }
  });
});
define('purecloud-skype/helpers/is-same-or-after', ['exports', 'ember-moment/helpers/is-same-or-after'], function (exports, _isSameOrAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSameOrAfter.default;
    }
  });
});
define('purecloud-skype/helpers/is-same-or-before', ['exports', 'ember-moment/helpers/is-same-or-before'], function (exports, _isSameOrBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSameOrBefore.default;
    }
  });
});
define('purecloud-skype/helpers/is-same', ['exports', 'ember-moment/helpers/is-same'], function (exports, _isSame) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSame.default;
    }
  });
});
define('purecloud-skype/helpers/moment-add', ['exports', 'ember-moment/helpers/moment-add'], function (exports, _momentAdd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentAdd.default;
    }
  });
});
define('purecloud-skype/helpers/moment-calendar', ['exports', 'ember-moment/helpers/moment-calendar'], function (exports, _momentCalendar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentCalendar.default;
    }
  });
});
define('purecloud-skype/helpers/moment-diff', ['exports', 'ember-moment/helpers/moment-diff'], function (exports, _momentDiff) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentDiff.default;
    }
  });
});
define('purecloud-skype/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _momentDuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentDuration.default;
    }
  });
});
define('purecloud-skype/helpers/moment-format', ['exports', 'ember-moment/helpers/moment-format'], function (exports, _momentFormat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFormat.default;
    }
  });
});
define('purecloud-skype/helpers/moment-from-now', ['exports', 'ember-moment/helpers/moment-from-now'], function (exports, _momentFromNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFromNow.default;
    }
  });
});
define('purecloud-skype/helpers/moment-from', ['exports', 'ember-moment/helpers/moment-from'], function (exports, _momentFrom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFrom.default;
    }
  });
});
define('purecloud-skype/helpers/moment-subtract', ['exports', 'ember-moment/helpers/moment-subtract'], function (exports, _momentSubtract) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentSubtract.default;
    }
  });
});
define('purecloud-skype/helpers/moment-to-date', ['exports', 'ember-moment/helpers/moment-to-date'], function (exports, _momentToDate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentToDate.default;
    }
  });
});
define('purecloud-skype/helpers/moment-to-now', ['exports', 'ember-moment/helpers/moment-to-now'], function (exports, _momentToNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentToNow.default;
    }
  });
});
define('purecloud-skype/helpers/moment-to', ['exports', 'ember-moment/helpers/moment-to'], function (exports, _momentTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentTo.default;
    }
  });
});
define('purecloud-skype/helpers/moment-unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function () {
      return _unix.unix;
    }
  });
});
define('purecloud-skype/helpers/moment', ['exports', 'ember-moment/helpers/moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _moment.default;
    }
  });
});
define('purecloud-skype/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _now) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _now.default;
    }
  });
});
define('purecloud-skype/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('purecloud-skype/helpers/promise-all', ['exports', 'ember-promise-helpers/helpers/promise-all'], function (exports, _promiseAll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _promiseAll.default;
    }
  });
  Object.defineProperty(exports, 'promiseAll', {
    enumerable: true,
    get: function () {
      return _promiseAll.promiseAll;
    }
  });
});
define('purecloud-skype/helpers/promise-hash', ['exports', 'ember-promise-helpers/helpers/promise-hash'], function (exports, _promiseHash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _promiseHash.default;
    }
  });
  Object.defineProperty(exports, 'promiseHash', {
    enumerable: true,
    get: function () {
      return _promiseHash.promiseHash;
    }
  });
});
define('purecloud-skype/helpers/promise-rejected-reason', ['exports', 'ember-promise-helpers/helpers/promise-rejected-reason'], function (exports, _promiseRejectedReason) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _promiseRejectedReason.default;
    }
  });
});
define('purecloud-skype/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('purecloud-skype/helpers/unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function () {
      return _unix.unix;
    }
  });
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
define('purecloud-skype/models/conversation', ['exports', 'ember', 'moment'], function (exports, _ember, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var get = _ember.default.get,
        inject = _ember.default.inject,
        computed = _ember.default.computed,
        observer = _ember.default.observer,
        run = _ember.default.run,
        RSVP = _ember.default.RSVP,
        Logger = _ember.default.Logger;
    exports.default = _ember.default.Object.extend({
        store: inject.service(),
        skype: inject.service(),

        conversation: null,

        messages: null,
        loadedHistory: false,

        deferred: null,
        _setupComplete: false,

        name: computed.reads('conversationTarget.displayName'),

        loaded: computed('deferred.promise', function () {
            return this.get('deferred.promise');
        }),

        isReady: computed('_setupComplete', function () {
            return this.get('_setupComplete');
        }),

        conversationTarget: computed('conversation', function () {
            var person = get(this.get('conversation').participants(), 'firstObject.person');
            if (!person) {
                return {};
            }
            return this.get('store').getUserForPerson(person);
        }),

        conversationChange: observer('conversation', function () {
            run.once(this, this._setup);
        }),

        init: function init() {
            this._super.apply(this, arguments);

            this.set('messages', []);
            this.set('deferred', RSVP.defer());

            var id = this.get('id');
            if (!id) {
                throw new Error('Conversation id is required.');
            }

            var conversation = this.get('conversation');
            if (!conversation) {
                Logger.warn('Conversation model created without skype conversation.');
                return;
            }

            this._setup();
        },
        sendMessage: function sendMessage(message) {
            this.get('conversation').chatService.sendMessage(message).then(function () {
                Logger.log('Message sent.');
            });
        },
        loadMessageHistory: function loadMessageHistory() {
            var _this = this;

            if (!this.get('loadedHistory')) {
                this.get('deferred.promise').then(function () {
                    return _this.get('conversation').historyService.getMoreActivityItems().then(function () {
                        Logger.log('HISTORY LOADED');
                        _this.set('loadedHistory', true);
                    });
                });
            }
        },
        _setup: function _setup() {
            var _this2 = this;

            if (this.get('_setupComplete')) {
                return;
            }

            this.set('_setupComplete', true);

            var conversation = this.get('conversation');

            conversation.participants.added(function (person) {
                Logger.log('conversation.participants.added', person);
                _this2.notifyPropertyChange('conversationTarget');
                _this2.get('deferred').resolve();
            });

            conversation.historyService.activityItems.added(function (message) {
                Logger.log('HISTORY', message);

                var sender = _this2.get('store').getUserForPerson(message.sender);

                var messageModel = _ember.default.Object.create({
                    direction: message.direction(),
                    status: message.status(),
                    text: message.text(),
                    timestamp: (0, _moment.default)(message.timestamp()),
                    sender: sender
                });

                Logger.log("conversation.historyService.activityItems.added", messageModel);

                _this2.get('messages').pushObject(messageModel);
            });

            conversation.state.changed(function (newValue, reason, oldValue) {
                Logger.log('conversation.state.changed', newValue, reason, oldValue);
            });
        }
    });
});
define('purecloud-skype/models/user', ['exports', 'ember', 'purecloud-skype/utils/promise-object'], function (exports, _ember, _promiseObject) {
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
        computed = _ember.default.computed,
        RSVP = _ember.default.RSVP;
    exports.default = _ember.default.Object.extend({
        auth: inject.service(),
        ajax: inject.service(),
        skype: inject.service(),

        id: null,
        person: null,

        init: function init() {
            var _this = this;

            this._super.apply(this, arguments);

            var person = this.get('person');

            var deferred = RSVP.defer();
            this.set('loaded', deferred.promise);

            if (typeof person.id.get === "function") {
                person.id.get().then(function () {
                    _this.set('id', person.id());
                    _this.set('displayName', person.displayName());

                    return person.status.get();
                }).then(function () {
                    _this.set('rawPresence', person.status());

                    return person.email ? person.email.get() : person.emails.get();
                }).then(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 1),
                        email = _ref2[0];

                    if (email && email.emailAddress) {
                        _this.set('email', email.emailAddress());
                    } else {
                        _this.set('email', person.email());
                    }

                    _this.setupPhoto();
                    deferred.resolve(_this);
                });
            } else {
                this.set('displayName', person.displayName);
                if (person.emails) {
                    this.set('email', person.emails[0]);
                } else {
                    this.set('email', person.email);
                }
                this.set('rawPresence', person.status);
                this.set('avatarUrl', person.avatarUrl);

                deferred.resolve(this);
            }

            this.subscribeToProperties();
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
                return 'offline';
            }
        }),

        photoUrl: computed('email', function () {
            var _this2 = this;

            var email = this.get('email');
            if (!email) {
                return RSVP.resolve('');
            }
            var promise = this.get('ajax').request('https://outlook.office.com/api/v2.0/Users/' + email + '/photo').then(function (photoDescriptor) {
                var avatarUrl = photoDescriptor['@odata.id'];
                var requestUrl = avatarUrl + '/$value';
                return fetch(requestUrl, {
                    method: 'GET',
                    headers: {
                        Authorization: 'bearer ' + _this2.get('auth.msftAccessToken')
                    }
                }).then(function (response) {
                    return response.blob();
                }).then(function (blob) {
                    return (window.URL || window.webkitURL).createObjectURL(blob);
                });
            });

            return _promiseObject.default.create({
                promise: promise
            });
        }),

        subscribeToProperties: function subscribeToProperties() {
            var _this3 = this;

            var person = this.get('person');
            if (person.status) {
                person.status.changed(function () {
                    return _this3.notifyPropertyChange('presence');
                });
            }
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

  Router.map(function () {
    this.route('null');
  });

  exports.default = Router;
});
define('purecloud-skype/routes/application', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inject = _ember.default.inject,
        Route = _ember.default.Route,
        Logger = _ember.default.Logger;
    exports.default = Route.extend({
        auth: inject.service(),

        beforeModel: function beforeModel(transition) {
            var _this = this;

            localforage.config({
                name: 'pureSkype',
                version: 1.0,
                storeName: 'forage',
                description: 'Storing local preferences for the Skype for Business integration app'
            });

            var ref = window.location.href;
            var tokenIndex = ref.indexOf('access_token');
            return localforage.getItem('forage.token.purecloud').then(function (cookie) {
                if (tokenIndex != -1) {
                    var token = ref.substring(tokenIndex + 13, ref.indexOf('&'));
                    _this.get('auth').set('purecloudAccessToken', token);
                    _this.get('auth').setTokenCookie(token, 'purecloud');
                } else if (cookie) {
                    _this.get('auth').set('purecloudAccessToken', cookie);
                } else {
                    _this.get('auth').purecloudAuth();
                }
            }).then(function () {
                _this.get('auth').silentLogin().then(function () {
                    var target = transition.targetName;
                    _this.transitionTo(target);
                }).catch(function (error) {
                    Logger.error('Error logging in silently', error);
                    _this.transitionTo('index');
                });
            });
        }
    });
});
define('purecloud-skype/routes/null', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Route = _ember.default.Route;
    exports.default = Route.extend({
        beforeModel: function beforeModel() {
            window.location.href = window.location.origin + '/skype-for-business-purecloud-app/';
        }
    });
});
define('purecloud-skype/services/ajax', ['exports', 'ember', 'ember-ajax/services/ajax'], function (exports, _ember, _ajax) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inject = _ember.default.inject,
        computed = _ember.default.computed;
    exports.default = _ajax.default.extend({
        auth: inject.service(),

        contentType: 'application/json; charset=utf-8',

        trustedHosts: [/outlook.office.com/, /graph.microsoft.com/, /online.lync.com/],

        headers: computed('auth.msftAccessToken', function () {
            var headers = {};
            var token = this.get('auth.msftAccessToken');
            if (token) {
                headers['Authorization'] = 'Bearer ' + token;
            }
            return headers;
        })
    });
});
define('purecloud-skype/services/auth', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inject = _ember.default.inject,
        computed = _ember.default.computed,
        RSVP = _ember.default.RSVP,
        Logger = _ember.default.Logger,
        Service = _ember.default.Service;


    function objectToQueryParameters(obj) {
        return Object.keys(obj).map(function (key) {
            var value = obj[key];
            return key + '=' + value;
        }).join('&');
    }

    exports.default = Service.extend({
        ajax: inject.service(),
        skype: inject.service(),

        // appId: '18758f68-8cf8-4f32-8785-059d4cd2e62e',
        // appId: 'ec744ffe-d332-454a-9f13-b9f7ebe8b249',
        appId: '6dd45f0c-9db2-4c5b-93c3-3ff5c703184e',
        urls: {
            auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
            grant: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
        },

        accessCode: null,
        msftAccessToken: null,
        purecloudAccessToken: null,

        MSALDeferred: null,

        init: function init() {
            var _this = this;

            this._super.apply(this, arguments);

            var logger = new Msal.Logger(function (logLevel, message) {
                _ember.default.Logger.log('MSAL:', message);
            }, { level: Msal.LogLevel.Verbose });

            this.userAgentApplication = new Msal.UserAgentApplication(this.get('appId'), null, function () {
                var deferred = RSVP.defer();
                _this.set('MSALDeferred', deferred);

                _this.userAgentApplication.acquireTokenSilent(_this.get('scope')).then(function (token) {
                    _this.set('msftAccessToken', token);
                });
            }, {
                logger: logger,
                cacheLocation: 'localStorage'
            });

            window.auth = this;
        },


        isLoggedIn: computed.and('purecloudAccessToken', 'msftAccessToken'),

        scope: computed(function () {
            return ['openid', 'Contacts.ReadWrite', 'User.ReadBasic.All', 'User.ReadWrite'];
        }),

        authorizationUrl: computed('urls.auth', 'scope.[]', function () {
            var base = this.get('urls.auth');
            var data = {
                client_id: this.get('appId'),
                redirect_uri: '' + window.location.origin + window.location.pathname,
                response_type: 'id_token+token',
                nonce: 'msft',
                response_mode: 'fragment',
                scope: this.get('scope').join(' ')
            };

            return base + '/?' + objectToQueryParameters(data);
        }),

        microsoftUser: computed('msftAccessToken', function () {
            return this.userAgentApplication.getUser();
        }),

        loginForCode: function loginForCode() {
            var _this2 = this;

            var deferred = RSVP.defer();
            var url = this.get('authorizationUrl');
            var popup = window.open(url, 'auth', 'scrollbars=no,menubar=no,width=800,height=600');
            var interval = window.setInterval(function () {
                try {
                    var search = popup.window.location.hash;
                    var match = search.match(/code=(.*)&/);
                    if (match && match[1]) {
                        popup.close();
                        window.clearInterval(interval);

                        _this2.set('accessCode', match[1]);
                        deferred.resolve(match[1]);
                    }
                } catch (e) {
                    // ignore
                }
            }, 10);
            this.set('loginDeferred', deferred);
            return deferred.promise;
        },
        loginMicrosoft: function loginMicrosoft() {
            var deferred = RSVP.defer();

            this.userAgentApplication.loginRedirect(this.get('scope'));

            this.set('loginDeferred', deferred);
            return deferred.promise;
        },
        silentLogin: function silentLogin() {
            var _this3 = this;

            if (this.get('MSALDeferred')) {
                return this.get('MSALDeferred').promise;
            }

            if (this.userAgentApplication.getUser()) {
                return this.get('skype.promise').then(function () {
                    _this3.get('skype').signIn();
                });
            }

            var msftAccessToken = localStorage.getItem('msftAccessToken');
            if (!msftAccessToken) {
                return RSVP.reject('no access token');
            }

            _ember.default.run.once(this, this.set, 'msftAccessToken', msftAccessToken);
            return this.get('ajax').request('https://graph.microsoft.com/v1.0/me/', {
                headers: {
                    Authorization: 'Bearer ' + msftAccessToken
                }
            }).then(function () {
                Logger.info('logged in!');
                return _this3.get('skype.promise');
            }).then(function () {
                _this3.get('skype').signIn();
            }).catch(function (err) {
                _ember.default.run.once(_this3, _this3.set, 'msftAccessToken', null);
                return RSVP.reject(err);
            });
        },
        exchangeCodeForToken: function exchangeCodeForToken(code) {
            var _this4 = this;

            var data = {
                code: code,
                client_id: this.get('appId'),
                scope: this.get('scope').join(' '),
                redirect_uri: '' + window.location.origin + window.location.pathname,
                grant_type: 'authorization_code',
                client_secret: 'qbbaVO8>dmjRALXY8557<>-'
            };

            return this.get('ajax').post(this.get('urls.grant'), {
                contentType: 'application/x-www-form-urlencoded',
                data: data
            }).then(function (res) {
                if (typeof res === 'string') {
                    res = JSON.parse(res);
                }
                _this4.set('msftAccessToken', res.access_token);
                window.localStorage.setItem('msftAccessToken', res.access_token);
            });
        },
        purecloudAuth: function purecloudAuth() {
            var platform = window.require('platformClient');
            var redirectUri = '' + window.location.origin + window.location.pathname;
            var clientId = '9a529fd6-cb6c-4f8b-8fc9-e9288974f0c5';
            var client = platform.ApiClient.instance;
            client.setEnvironment('inindca.com');
            client.loginImplicitGrant(clientId, redirectUri).catch(function (err) {
                Logger.error(err.error);
            });
        },
        setTokenCookie: function setTokenCookie(token, type) {
            localforage.setItem('forage.token.' + type, token).then(function () {
                Logger.log(type + ' cookie set');
            });
        }
    });
});
define('purecloud-skype/services/moment', ['exports', 'ember', 'ember-moment/services/moment', 'purecloud-skype/config/environment'], function (exports, _ember, _moment, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = _ember.default.get;
  exports.default = _moment.default.extend({
    defaultFormat: get(_environment.default, 'moment.outputFormat')
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
define('purecloud-skype/services/skype', ['exports', 'ember', 'purecloud-skype/models/user', 'purecloud-skype/models/conversation'], function (exports, _ember, _user, _conversation) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EVENTS = undefined;
    var getOwner = _ember.default.getOwner,
        RSVP = _ember.default.RSVP,
        Logger = _ember.default.Logger,
        Service = _ember.default.Service,
        Evented = _ember.default.Evented;


    var config = {
        apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255' };

    var redirectUri = window.location.host.indexOf('localhost') > -1 ? 'https://localhost:4200/skype-for-business-purecloud-app/' : 'https://mypurecloud.github.io/skype-for-business-purecloud-app/';

    var appConfigProperties = {
        "displayName": "purecloudskype",
        "applicationID": "ec744ffe-d332-454a-9f13-b9f7ebe8b249",
        "applicationType": "Web app / API",
        "objectID": "45185d32-9960-42ad-beed-6b02215f8ba2",
        "homePage": "https://mypurecloud.github.io/skype-for-business-purecloud-app/"
    };

    var EVENTS = exports.EVENTS = {
        signIn: 'SIGN_IN',
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
                apiKey: config.apiKey
            }, function (api) {
                _this.api = api;
                _this.application = new api.application({
                    settings: {
                        convLogSettings: true
                    }
                });
                deferred.resolve();
            }, function (error) {
                Logger.error('There was an error loading the api:', error);
            });
        },
        signIn: function signIn() {
            var _arguments = arguments,
                _this2 = this;

            var options = {
                client_id: appConfigProperties.applicationID,
                origins: ['https://webdir.online.lync.com/autodiscover/autodiscoverservice.svc/root'],
                cors: true,
                version: 'PurecloudSkype/0.0.0',
                redirect_uri: redirectUri
            };

            return this.application.signInManager.signIn(options).then(function () {
                Logger.log('Skype.signIn.then', _arguments);
                var me = _this2.application.personsAndGroupsManager.mePerson;
                _this2.set('me', me);
                _this2.trigger(EVENTS.signIn, me);

                _this2.registerForEvents();

                // Load current conversations
                _this2.application.conversationsManager.getMoreConversations();
            }).catch(function (err) {
                Logger.error('Skype.signIn.catch', err, _arguments);
            });
        },
        registerForEvents: function registerForEvents() {
            var _this3 = this;

            var app = this.application;
            var conversations = app.conversationsManager.conversations;
            var groups = app.personsAndGroupsManager.all.groups;
            var persons = app.personsAndGroupsManager.all.persons;

            conversations.subscribe();
            groups.subscribe();
            persons.subscribe();

            groups.added(function (group) {
                Logger.info('Group added', group);
                _this3.trigger(EVENTS.groupAdded, group);
            });
            groups.removed(function (group) {
                Logger.info('Group added', group);
                _this3.trigger(EVENTS.groupRemoved, group);
            });

            persons.added(function (person) {
                Logger.info('Person added', person);

                person.id.get().then(function () {
                    _this3.trigger(EVENTS.personAdded, person);
                });
            });

            conversations.added(function (conversation) {
                Logger.info('Skype conversation added', { conversation: conversation });

                conversation.chatService.accept();
                conversation.chatService.start();

                _this3.trigger(EVENTS.conversationAdded, conversation);
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

        startConversation: function startConversation(sip) {
            return this.application.conversationsManager.getConversation(sip);
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
        getAllGroups: function getAllGroups() {
            return this.application.personsAndGroupsManager.all.groups.get().then(function (groups) {
                return groups.filter(function (group) {
                    return !!group.id();
                });
            });
        }
    });
});
define('purecloud-skype/services/store', ['exports', 'ember', 'purecloud-skype/services/skype', 'purecloud-skype/models/conversation', 'purecloud-skype/models/user'], function (exports, _ember, _skype, _conversation, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var inject = _ember.default.inject,
        getOwner = _ember.default.getOwner,
        Logger = _ember.default.Logger,
        Service = _ember.default.Service;
    exports.default = Service.extend({
        skype: inject.service(),

        users: null,
        contacts: null,
        conversations: null,
        activeConversation: null,

        init: function init() {
            this._super.apply(this, arguments);

            this.set('users', []);
            this.set('contacts', []);
            this.set('conversations', []);

            var skype = this.get('skype');

            skype.on(_skype.EVENTS.signIn, this.signIn.bind(this));
            skype.on(_skype.EVENTS.personAdded, this.getUserForPerson.bind(this));
            skype.on(_skype.EVENTS.conversationAdded, this.addConversation.bind(this));
            skype.on(_skype.EVENTS.groupAdded, this.addGroup.bind(this));

            window.STORE = this;
        },
        signIn: function signIn(user) {
            Logger.log('Store.signIn:', user);

            var me = this.getUserForPerson(user);
            this.set('me', me);
        },
        addConversation: function addConversation(conversation) {
            Logger.info('Store.addConversation:', { conversation: conversation });

            var model = this.getConversation(conversation.id(), conversation);
            if (!this.get('activeConversation')) {
                this.setActiveConversation(model);
            }
        },
        addGroup: function addGroup() {
            Logger.log('Store.addGroup - ', arguments);
        },
        setActiveConversation: function setActiveConversation(conversation) {
            console.log('store.setActiveConversation', conversation);

            if (conversation !== this.get('activeConversation')) {
                this.set('activeConversation', conversation);
            }

            conversation.loadMessageHistory();
        },
        getConversation: function getConversation(id) {
            var skypeConversation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var conversations = this.get('conversations');
            var conversation = conversations.findBy('id', id);
            if (!conversation) {
                conversation = _conversation.default.create({
                    id: id,
                    conversation: skypeConversation
                }, getOwner(this).ownerInjection());
                this.get('conversations').addObject(conversation);
            }
            if (!conversation.get('conversation') && skypeConversation) {
                conversation.set('conversation', skypeConversation);
            }

            return conversation;
        },
        getConversationForUser: function getConversationForUser(user) {
            var conversation = this.get('conversations').findBy('conversationTarget.id', user.id);
            if (!conversation) {
                var skypeConversation = this.get('skype').startConversation(user.id);
                return this.getConversation(skypeConversation.id(), skypeConversation);
            }
            return conversation;
        },
        getUserForPerson: function getUserForPerson(person) {
            var id = person.id();
            var users = this.get('users');
            var currentUser = users.find(function (user) {
                return user.get('id') === id;
            });

            if (!currentUser) {
                currentUser = _user.default.create({
                    id: id,
                    person: person
                }, getOwner(this).ownerInjection());

                users.addObject(currentUser);
            }

            return currentUser;
        },
        startConversation: function startConversation(user) {
            var _this = this;

            var conversation = this.getConversationForUser(user);
            conversation.get('loaded').then(function () {
                _this.setActiveConversation(conversation);
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
  exports.default = Ember.HTMLBars.template({ "id": "zxMgIIQi", "block": "{\"statements\":[[6,[\"if\"],[[28,[\"auth\",\"isLoggedIn\"]]],null,{\"statements\":[[0,\"    \"],[11,\"div\",[]],[15,\"class\",\"skype-for-business-app\"],[13],[0,\"\\n        \"],[1,[26,[\"roster-list\"]],false],[0,\"\\n        \"],[1,[26,[\"conversation-pane\"]],false],[0,\"\\n    \"],[14],[0,\"\\n\"]],\"locals\":[]},{\"statements\":[[0,\"    \"],[11,\"button\",[]],[5,[\"action\"],[[28,[null]],\"startAuth\"]],[13],[0,\"Login\"],[14],[0,\"\\n\"]],\"locals\":[]}]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/templates/index.hbs" } });
});
define('purecloud-skype/utils/promise-object', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _ember.default.ObjectProxy.extend(_ember.default.PromiseProxyMixin);
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
  require("purecloud-skype/app")["default"].create({"name":"purecloud-skype","version":"0.0.0+cbc441a2"});
}
//# sourceMappingURL=purecloud-skype.map
