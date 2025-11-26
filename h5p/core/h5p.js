/**
 * The H5P runtime library.
 */
window.H5P = window.H5P || {};

(function ($) {
  // Avoid repeated library initialization
  if (H5P.instances) {
    return;
  }

  /**
   * H5P library version.
   * @member {number}
   */
  H5P.version = 1.12;

  /**
   * Core modules.
   */
  H5P.instances = [];
  H5P.externalEmbeds = [];
  H5P.behaviors = [];

 /**
   * Config object with various settings.
   * @member {Object}
   */
  H5P.config = {};

  /**
   * This is used to transfer the library's attach library to the wrapper
   * when the wrapper has an old version of the attach library.
   * @member {function}
   */
  H5P.attachLibrary = function (wrapper, library) {
    wrapper.H5P.attachLibrary(wrapper, library);
 };

  /**
   * This is used to get the URL to the content folder for the given H5P instance.
   * This is useful if you need to fetch the path to assets for a content that is
   * not attached to the DOM.
   *
   * @param {number} contentId
   *  The id of the content
   * @returns {string}
   *  The URL to the content folder
   */
  H5P.getContentPath = function (contentId) {
    return H5PIntegration.url + '/content/' + contentId;
  };

  /**
   * This is used to get the URL to the library folder for the given library.
   * This is useful if you need to fetch the path to assets for a library.
   *
   * @param {string} library
   *  The library name and version in the format "machineName majorVersion.minorVersion"
   * @returns {string}
   *  The URL to the library folder
   */
  H5P.getLibraryPath = function (library) {
    // Find library in libraries cache
    for (var lib in H5PIntegration.libraries) {
      if (H5PIntegration.libraries[lib]) {
        var l = H5PIntegration.libraries[lib];
        if (l.name === library.split(' ')[0] && l.version === library.split(' ')[1]) {
          return H5PIntegration.url + '/libraries/' + l.path;
        }
      }
    }
    return null;
  };

  /**
   * Find the given library's representation in the DOM.
   *
   * @param {H5P.jQuery} $element
   *   The root element for the H5P content
   * @param {string} library
   *   Optional library name to look for
   * @returns {H5P.jQuery}
   *   The library's root DOM element or the complete H5P content if no library
   */
  H5P.getLibraryDomElement = function ($element, library) {
    if (library) {
      return $element.find('.h5p-' + library.replace(' ', '.').replace(' ', '-').toLowerCase());
    }
    else {
      return $element.find('.h5p-content');
    }
  };

  /**
   * Trigger an event on an H5P instance.
   *
   * @param {number} id
   *   The H5P instance id
   * @param {string} eventType
   *   Type of event to trigger
   * @param {Object} data
   *   Data to send with the event
   * @param {Object} extras
   *   Extra properties to add to the event object
   */
  H5P.triggerXAPI = function (id, eventType, data, extras) {
    var h5p = H5P.getInstanceById(id);
    if (h5p) {
      var event = new H5P.Event(eventType, data, extras);
      h5p.trigger(event);
    }
  };

  /**
   * Add JavaScript files to the current document.
   *
   * @param {Array} js
   *   List of JavaScript files to add
   * @param {function} done
   *   Callback function called when all scripts are loaded
   * @param {Object} library
   *   An optional library to use as context when determining path
   */
  H5P.addJS = function (js, done, library) {
    var left = js.length;
    if (left === 0) {
      done();
      return;
    }

    for (var i = 0; i < js.length; i++) {
      var path = js[i];
      if (path.substr(0, 4) !== 'http') {
        // Not an external library
        if (library) {
          path = H5P.getLibraryPath(library) + '/' + path;
        }
        else {
          path = H5PIntegration.url + '/libraries/' + path;
        }
      }

      H5P.getScript(path, function () {
        left--;
        if (left === 0) {
          done();
        }
      });
    }
  };

  /**
   * Add CSS files to the current document.
   *
   * @param {Array} css
   *   List of CSS files to add
   * @param {Object} library
   *   An optional library to use as context when determining path
   */
  H5P.addCSS = function (css, library) {
    for (var i = 0; i < css.length; i++) {
      var path = css[i];
      if (path.substr(0, 4) !== 'http') {
        // Not an external library
        if (library) {
          path = H5P.getLibraryPath(library) + '/' + path;
        }
        else {
          path = H5PIntegration.url + '/libraries/' + path;
        }
      }
      H5P.getCSS(path);
    }
  };

  /**
   * Shallow clone of an object.
   *
   * @param {Object} object
   * @returns {Object}
   */
  H5P.cloneObject = function (object) {
    var clone = {};
    for (var property in object) {
      if (object.hasOwnProperty(property)) {
        clone[property] = object[property];
      }
    }
    return clone;
  };

  /**
   * Deep clone of an object.
   *
   * @param {Object} object
   * @returns {Object}
   */
  H5P.cloneObjectDeep = function (object) {
    return JSON.parse(JSON.stringify(object));
  };

  /**
   * Create function for making event handling easier.
   * Compatible with old IE.
   *
   * @param {Object} target
   *   What to listen for events on
   * @param {string} type
   *   Type of event
   * @param {function} callback
   *   What to do when the event is triggered
   */
  H5P.on = function (target, type, callback) {
    if (target.addEventListener) {
      target.addEventListener(type, callback, false);
    }
    else if (target.attachEvent) {
      target.attachEvent('on' + type, callback);
    }
  };

  /**
   * Create function for making event handling easier.
   * Compatible with old IE.
   *
   * @param {Object} target
   *   What to remove event listener from
   * @param {string} type
   *   Type of event
   * @param {function} callback
   *   What to remove
   */
  H5P.off = function (target, type, callback) {
    if (target.removeEventListener) {
      target.removeEventListener(type, callback, false);
    }
    else if (target.detachEvent) {
      target.detachEvent('on' + type, callback);
    }
  };

  /**
   * Get an instance with the given id.
   *
   * @param {number} id
   * @returns {H5P.Question}
   */
  H5P.getInstanceById = function (id) {
    for (var i = 0; i < H5P.instances.length; i++) {
      if (H5P.instances[i].id === id) {
        return H5P.instances[i];
      }
    }
  };

  /**
   * Get all H5P instances on the current page.
   * 
   * @returns {Array}
   */
  H5P.getInstances = function () {
    return H5P.instances;
  };

  /**
   * Boot up all H5P content on the current page.
   */
  H5P.init = function () {
    // Find all H5P content on the page and initialize it
    var h5pElements = document.querySelectorAll('.h5p-content');
    for (var i = 0; i < h5pElements.length; i++) {
      var element = h5pElements[i];
      var contentId = element.dataset.contentId;
      if (contentId) {
        H5P.newRunnable(H5PIntegration.contents['cid-' + contentId].library,
                        contentId,
                        element,
                        true,
                        {standalone: true});
      }
    }
  };

  /**
   * Prepare the H5P content for embedding.
   * This function will be triggered by h5p.js when the content is ready to be embedded.
   *
   * @param {Object} h5pInstance
   *   The H5P instance that is being embedded
   * @param {number} contentId
   *   The id of the content
   * @param {H5P.jQuery} $element
   *   The element the content is being attached to
   */
  H5P.externalEmbed = function (h5pInstance, contentId, $element) {
    // Store for later use
    H5P.externalEmbeds.push({
      instance: h5pInstance,
      contentId: contentId,
      element: $element
    });

    // Handle resize
    H5P.on(window, 'resize', function () {
      H5P.trigger(h5pInstance, 'resize');
    });
  };

  /**
   * Create a new instance of the given library.
   *
   * @param {string} library
   *   Library name and version in the format "machineName majorVersion.minorVersion"
   * @param {number} contentId
   *   The content id
   * @param {H5P.jQuery} $element
   *   The element the library should be attached to
   * @param {boolean} skipResize
   *   Default is false, if true will not create resize event on instance
   * @param {Object} libraryParams
   *   Parameters to initialize the library with
   * @param {Object} metadata
   *   Libraries metadata
   * @returns {H5P.Library} The instance
   */
  H5P.newRunnable = function (library, contentId, $element, skipResize, libraryParams, metadata) {
    var libraryName = library.split(' ')[0];
    var libraryVersion = library.split(' ')[1];

    // Find library implementation
    if (!H5P.JoubelUI) {
      // Load the Joubel UI library if it hasn't been loaded yet
      H5P.JoubelUI = {};
    }

    // Create instance
    var instance = H5P[libraryName] ? new H5P[libraryName](libraryParams.params, contentId, {
      parent: null,
      library: library,
      metadata: metadata || libraryParams.metadata
    }) : null;

    if (instance) {
      // Add to list of instances
      instance.id = contentId;
      H5P.instances.push(instance);

      // Attach to DOM
      if ($element) {
        if (instance.attach) {
          instance.attach($element);
        } else if (instance.$container) {
          $element.append(instance.$container);
        }

        // Trigger attach event
        H5P.trigger(instance, 'attach', {$container: $element});
      }

      // Handle resize
      if (!skipResize) {
        H5P.on(window, 'resize', function () {
          H5P.trigger(instance, 'resize');
        });
      }

      // Trigger init event
      H5P.trigger(instance, 'init', instance);
    }

    return instance;
  };

  /**
   * Remove all event listeners for the given instance.
   *
   * @param {H5P.Library} instance
   */
  H5P.removeInstance = function (instance) {
    // Remove from instances list
    var index = H5P.instances.indexOf(instance);
    if (index !== -1) {
      H5P.instances.splice(index, 1);
    }
  };

  /**
   * Add a script to the document.
   *
   * @param {string} src
   * @param {function} callback
   * @returns {XMLHttpRequest|H5P.jQuery.Promise|*}
   */
  H5P.getScript = function (src, callback) {
    if (H5P.jsLoaded === undefined) {
      H5P.jsLoaded = {};
    }

    if (H5P.jsLoaded[src]) {
      // Already loaded
      if (callback) {
        callback();
      }
      return;
    }

    // Mark as loading/loaded
    H5P.jsLoaded[src] = true;

    if (window.H5PIntegration && window.H5PIntegration.loadedJs) {
      // Check if script already is loaded
      for (var i = 0; i < window.H5PIntegration.loadedJs.length; i++) {
        if (window.H5PIntegration.loadedJs[i] === src) {
          if (callback) {
            callback();
          }
          return;
        }
      }

      // Add to loaded list to avoid loading twice
      window.H5PIntegration.loadedJs.push(src);
    }

    // Load dynamically
    var script = document.createElement('script');
    script.src = src;
    if (callback) {
      var done = false;
      script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
          done = true;
          callback();
        }
      };
    }
    document.head.appendChild(script);
  };

  /**
   * Add a style to the document.
   *
   * @param {string} src
   */
  H5P.getCSS = function (src) {
    if (H5P.cssLoaded === undefined) {
      H5P.cssLoaded = {};
    }

    if (H5P.cssLoaded[src]) {
      // Already loaded
      return;
    }

    // Mark as loaded
    H5P.cssLoaded[src] = true;

    if (window.H5PIntegration && window.H5PIntegration.loadedCss) {
      // Check if style already is loaded
      for (var i = 0; i < window.H5PIntegration.loadedCss.length; i++) {
        if (window.H5PIntegration.loadedCss[i] === src) {
          return;
        }
      }

      // Add to loaded list to avoid loading twice
      window.H5PIntegration.loadedCss.push(src);
    }

    // Load dynamically
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = src;
    document.head.appendChild(style);
  };

  /**
   * Event dispatching functions.
   */
  H5P.EventDispatcher = function () {
    this.handlers = [];
  };

  H5P.EventDispatcher.prototype.trigger = function (event) {
    var self = this;
    if (typeof event === 'string') {
      event = new H5P.Event(event, {});
    }

    // Add target to event
    event.target = self;

    // Trigger all handlers
    for (var i = 0; i < self.handlers.length; i++) {
      self.handlers[i](event);
    }
 };

  H5P.EventDispatcher.prototype.on = function (event, handler) {
    var self = this;
    if (typeof event === 'string') {
      event = new H5P.Event(event, {});
    }

    // Add handler
    self.handlers.push(function (e) {
      if (e.type === event.type) {
        handler(e);
      }
    });
  };

  /**
   * H5P Event object.
   *
   * @param {string} type
   * @param {Object} data
   * @param {Object} extras
   * @returns {H5P.Event}
   */
  H5P.Event = function (type, data, extras) {
    this.type = type;
    this.data = data;
    this.xAPI = null;

    // Add extras to event
    if (extras) {
      for (var prop in extras) {
        if (extras.hasOwnProperty(prop)) {
          this[prop] = extras[prop];
        }
      }
    }
  };

  /**
   * Prevent default behavior
   */
  H5P.Event.prototype.preventDefault = function () {
    this.isDefaultPrevented = true;
  };

  /**
   * Key-value storage object for simple H5P library communication.
   */
  H5P.data = {};

  // Initialize H5P when page is fully loaded
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', H5P.init);
  } else {
    // Old IE support
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState === 'complete') {
        H5P.init();
      }
    });
  }
})(H5P.jQuery);