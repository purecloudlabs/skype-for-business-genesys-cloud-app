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
define('purecloud-skype/components/conversation-pane/component', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = _ember.default.Component;
    exports.default = Component.extend({});
});
define("purecloud-skype/components/conversation-pane/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "l3mnnJC6", "block": "{\"statements\":[[0,\"Conversation pane\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/conversation-pane/template.hbs" } });
});
define('purecloud-skype/components/roster-list/component', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = _ember.default.Component,
        inject = _ember.default.inject;
    exports.default = Component.extend({
        classNames: ['roster-list'],

        skype: inject.service()
    });
});
define("purecloud-skype/components/roster-list/template", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "jMvi5lkf", "block": "{\"statements\":[[0,\"roster\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/components/roster-list/template.hbs" } });
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
define('purecloud-skype/services/skype', ['exports', 'ember'], function (exports, _ember) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Service = _ember.default.Service;


    var config = {
        apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255', // SDK
        apiKeyCC: '9c967f6b-a846-4df2-b43d-5167e47d81e1' // SDK+UI
    };

    exports.default = Service.extend({
        init: function init() {
            var _this = this;

            this._super.apply(this, arguments);

            window.Skype.initialize({
                apiKey: config.apiKeyCC,
                supportsAudio: true,
                supportsVideo: true,
                convLogSettings: true
            }, function (api) {
                _this.api = api;
                _this.application = api.UIApplicationInstance;
            }, function (error) {
                window.alert('There was an error loading the api:', error);
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
  exports.default = Ember.HTMLBars.template({ "id": "s3jia8VG", "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"skype-for-business-app\"],[13],[0,\"\\n    \"],[1,[26,[\"roster-list\"]],false],[0,\"\\n    \"],[1,[26,[\"conversation-pane\"]],false],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "purecloud-skype/templates/index.hbs" } });
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
  require("purecloud-skype/app")["default"].create({"name":"purecloud-skype","version":"0.0.0+b10648a5"});
}
//# sourceMappingURL=purecloud-skype.map
