(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['markdownit'],
      __esModule: true,
    };
  }

  define('markdown-it', [], vendorModule);
})();
