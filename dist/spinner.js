(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

module.exports = _extends;
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isBrowser = exports.isBrowser = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && (typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object' && document.nodeType === 9;

exports.default = isBrowser;
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var warning = _interopDefault(require('tiny-warning'));

var separatorRegExp = /\s*,\s*/g;
var parentRegExp = /&/g;
var refRegExp = /\$([\w-]+)/g;
/**
 * Convert nested rules to separate, remove them from original styles.
 *
 * @param {Rule} rule
 * @api public
 */

function jssNested() {
  // Get a function to be used for $ref replacement.
  function getReplaceRef(container, sheet) {
    return function (match, key) {
      var rule = container.getRule(key) || sheet && sheet.getRule(key);

      if (rule) {
        rule = rule;
        return rule.selector;
      }

      warning(false, "[JSS] Could not find the referenced rule " + key + " in " + (container.options.meta || container.toString()) + ".");
      return key;
    };
  }

  function replaceParentRefs(nestedProp, parentProp) {
    var parentSelectors = parentProp.split(separatorRegExp);
    var nestedSelectors = nestedProp.split(separatorRegExp);
    var result = '';

    for (var i = 0; i < parentSelectors.length; i++) {
      var parent = parentSelectors[i];

      for (var j = 0; j < nestedSelectors.length; j++) {
        var nested = nestedSelectors[j];
        if (result) result += ', '; // Replace all & by the parent or prefix & with the parent.

        result += nested.indexOf('&') !== -1 ? nested.replace(parentRegExp, parent) : parent + " " + nested;
      }
    }

    return result;
  }

  function getOptions(rule, container, options) {
    // Options has been already created, now we only increase index.
    if (options) return _extends({}, options, {
      index: options.index + 1
    });
    var nestingLevel = rule.options.nestingLevel;
    nestingLevel = nestingLevel === undefined ? 1 : nestingLevel + 1;
    return _extends({}, rule.options, {
      nestingLevel: nestingLevel,
      index: container.indexOf(rule) + 1
    });
  }

  function onProcessStyle(style, rule, sheet) {
    if (rule.type !== 'style') return style;
    var styleRule = rule;
    var container = styleRule.options.parent;
    var options;
    var replaceRef;

    for (var prop in style) {
      var isNested = prop.indexOf('&') !== -1;
      var isNestedConditional = prop[0] === '@';
      if (!isNested && !isNestedConditional) continue;
      options = getOptions(styleRule, container, options);

      if (isNested) {
        var selector = replaceParentRefs(prop, styleRule.selector); // Lazily create the ref replacer function just once for
        // all nested rules within the sheet.

        if (!replaceRef) replaceRef = getReplaceRef(container, sheet); // Replace all $refs.

        selector = selector.replace(refRegExp, replaceRef);
        container.addRule(selector, style[prop], _extends({}, options, {
          selector: selector
        }));
      } else if (isNestedConditional) {
        // Place conditional right after the parent rule to ensure right ordering.
        container.addRule(prop, {}, options) // Flow expects more options but they aren't required
        // And flow doesn't know this will always be a StyleRule which has the addRule method
        // $FlowFixMe
        .addRule(styleRule.key, style[prop], {
          selector: styleRule.selector
        });
      }

      delete style[prop];
    }

    return style;
  }

  return {
    onProcessStyle: onProcessStyle
  };
}

exports.default = jssNested;

},{"@babel/runtime/helpers/extends":1,"tiny-warning":36}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isInBrowser = require('is-in-browser');

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _StyleSheet = require('./StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _PluginsRegistry = require('./PluginsRegistry');

var _PluginsRegistry2 = _interopRequireDefault(_PluginsRegistry);

var _rules = require('./plugins/rules');

var _rules2 = _interopRequireDefault(_rules);

var _observables = require('./plugins/observables');

var _observables2 = _interopRequireDefault(_observables);

var _functions = require('./plugins/functions');

var _functions2 = _interopRequireDefault(_functions);

var _sheets = require('./sheets');

var _sheets2 = _interopRequireDefault(_sheets);

var _StyleRule = require('./rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _createGenerateClassName = require('./utils/createGenerateClassName');

var _createGenerateClassName2 = _interopRequireDefault(_createGenerateClassName);

var _createRule2 = require('./utils/createRule');

var _createRule3 = _interopRequireDefault(_createRule2);

var _DomRenderer = require('./renderers/DomRenderer');

var _DomRenderer2 = _interopRequireDefault(_DomRenderer);

var _VirtualRenderer = require('./renderers/VirtualRenderer');

var _VirtualRenderer2 = _interopRequireDefault(_VirtualRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultPlugins = _rules2['default'].concat([_observables2['default'], _functions2['default']]);

var instanceCounter = 0;

var Jss = function () {
  function Jss(options) {
    _classCallCheck(this, Jss);

    this.id = instanceCounter++;
    this.version = "9.8.7";
    this.plugins = new _PluginsRegistry2['default']();
    this.options = {
      createGenerateClassName: _createGenerateClassName2['default'],
      Renderer: _isInBrowser2['default'] ? _DomRenderer2['default'] : _VirtualRenderer2['default'],
      plugins: []
    };
    this.generateClassName = (0, _createGenerateClassName2['default'])();

    // eslint-disable-next-line prefer-spread
    this.use.apply(this, defaultPlugins);
    this.setup(options);
  }

  _createClass(Jss, [{
    key: 'setup',
    value: function setup() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (options.createGenerateClassName) {
        this.options.createGenerateClassName = options.createGenerateClassName;
        // $FlowFixMe
        this.generateClassName = options.createGenerateClassName();
      }

      if (options.insertionPoint != null) this.options.insertionPoint = options.insertionPoint;
      if (options.virtual || options.Renderer) {
        this.options.Renderer = options.Renderer || (options.virtual ? _VirtualRenderer2['default'] : _DomRenderer2['default']);
      }

      // eslint-disable-next-line prefer-spread
      if (options.plugins) this.use.apply(this, options.plugins);

      return this;
    }

    /**
     * Create a Style Sheet.
     */

  }, {
    key: 'createStyleSheet',
    value: function createStyleSheet(styles) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var index = options.index;
      if (typeof index !== 'number') {
        index = _sheets2['default'].index === 0 ? 0 : _sheets2['default'].index + 1;
      }
      var sheet = new _StyleSheet2['default'](styles, _extends({}, options, {
        jss: this,
        generateClassName: options.generateClassName || this.generateClassName,
        insertionPoint: this.options.insertionPoint,
        Renderer: this.options.Renderer,
        index: index
      }));
      this.plugins.onProcessSheet(sheet);

      return sheet;
    }

    /**
     * Detach the Style Sheet and remove it from the registry.
     */

  }, {
    key: 'removeStyleSheet',
    value: function removeStyleSheet(sheet) {
      sheet.detach();
      _sheets2['default'].remove(sheet);
      return this;
    }

    /**
     * Create a rule without a Style Sheet.
     */

  }, {
    key: 'createRule',
    value: function createRule(name) {
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      // Enable rule without name for inline styles.
      if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
        options = style;
        style = name;
        name = undefined;
      }

      // Cast from RuleFactoryOptions to RuleOptions
      // https://stackoverflow.com/questions/41328728/force-casting-in-flow
      var ruleOptions = options;

      ruleOptions.jss = this;
      ruleOptions.Renderer = this.options.Renderer;
      if (!ruleOptions.generateClassName) ruleOptions.generateClassName = this.generateClassName;
      if (!ruleOptions.classes) ruleOptions.classes = {};
      var rule = (0, _createRule3['default'])(name, style, ruleOptions);

      if (!ruleOptions.selector && rule instanceof _StyleRule2['default']) {
        rule.selector = '.' + ruleOptions.generateClassName(rule);
      }

      this.plugins.onProcessRule(rule);

      return rule;
    }

    /**
     * Register plugin. Passed function will be invoked with a rule instance.
     */

  }, {
    key: 'use',
    value: function use() {
      var _this = this;

      for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
        plugins[_key] = arguments[_key];
      }

      plugins.forEach(function (plugin) {
        // Avoids applying same plugin twice, at least based on ref.
        if (_this.options.plugins.indexOf(plugin) === -1) {
          _this.options.plugins.push(plugin);
          _this.plugins.use(plugin);
        }
      });

      return this;
    }
  }]);

  return Jss;
}();

exports['default'] = Jss;
},{"./PluginsRegistry":5,"./StyleSheet":9,"./plugins/functions":11,"./plugins/observables":12,"./plugins/rules":13,"./renderers/DomRenderer":14,"./renderers/VirtualRenderer":15,"./rules/StyleRule":20,"./sheets":22,"./utils/createGenerateClassName":24,"./utils/createRule":25,"is-in-browser":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PluginsRegistry = function () {
  function PluginsRegistry() {
    _classCallCheck(this, PluginsRegistry);

    this.hooks = {
      onCreateRule: [],
      onProcessRule: [],
      onProcessStyle: [],
      onProcessSheet: [],
      onChangeValue: [],
      onUpdate: []

      /**
       * Call `onCreateRule` hooks and return an object if returned by a hook.
       */
    };
  }

  _createClass(PluginsRegistry, [{
    key: 'onCreateRule',
    value: function onCreateRule(name, decl, options) {
      for (var i = 0; i < this.hooks.onCreateRule.length; i++) {
        var rule = this.hooks.onCreateRule[i](name, decl, options);
        if (rule) return rule;
      }
      return null;
    }

    /**
     * Call `onProcessRule` hooks.
     */

  }, {
    key: 'onProcessRule',
    value: function onProcessRule(rule) {
      if (rule.isProcessed) return;
      var sheet = rule.options.sheet;

      for (var i = 0; i < this.hooks.onProcessRule.length; i++) {
        this.hooks.onProcessRule[i](rule, sheet);
      }

      // $FlowFixMe
      if (rule.style) this.onProcessStyle(rule.style, rule, sheet);

      rule.isProcessed = true;
    }

    /**
     * Call `onProcessStyle` hooks.
     */

  }, {
    key: 'onProcessStyle',
    value: function onProcessStyle(style, rule, sheet) {
      var nextStyle = style;

      for (var i = 0; i < this.hooks.onProcessStyle.length; i++) {
        nextStyle = this.hooks.onProcessStyle[i](nextStyle, rule, sheet);
        // $FlowFixMe
        rule.style = nextStyle;
      }
    }

    /**
     * Call `onProcessSheet` hooks.
     */

  }, {
    key: 'onProcessSheet',
    value: function onProcessSheet(sheet) {
      for (var i = 0; i < this.hooks.onProcessSheet.length; i++) {
        this.hooks.onProcessSheet[i](sheet);
      }
    }

    /**
     * Call `onUpdate` hooks.
     */

  }, {
    key: 'onUpdate',
    value: function onUpdate(data, rule, sheet) {
      for (var i = 0; i < this.hooks.onUpdate.length; i++) {
        this.hooks.onUpdate[i](data, rule, sheet);
      }
    }

    /**
     * Call `onChangeValue` hooks.
     */

  }, {
    key: 'onChangeValue',
    value: function onChangeValue(value, prop, rule) {
      var processedValue = value;
      for (var i = 0; i < this.hooks.onChangeValue.length; i++) {
        processedValue = this.hooks.onChangeValue[i](processedValue, prop, rule);
      }
      return processedValue;
    }

    /**
     * Register a plugin.
     * If function is passed, it is a shortcut for `{onProcessRule}`.
     */

  }, {
    key: 'use',
    value: function use(plugin) {
      for (var name in plugin) {
        if (this.hooks[name]) this.hooks[name].push(plugin[name]);else (0, _warning2['default'])(false, '[JSS] Unknown hook "%s".', name);
      }
    }
  }]);

  return PluginsRegistry;
}();

exports['default'] = PluginsRegistry;
},{"warning":37}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _createRule = require('./utils/createRule');

var _createRule2 = _interopRequireDefault(_createRule);

var _linkRule = require('./utils/linkRule');

var _linkRule2 = _interopRequireDefault(_linkRule);

var _StyleRule = require('./rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _escape = require('./utils/escape');

var _escape2 = _interopRequireDefault(_escape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Contains rules objects and allows adding/removing etc.
 * Is used for e.g. by `StyleSheet` or `ConditionalRule`.
 */
var RuleList = function () {

  // Original styles object.
  function RuleList(options) {
    var _this = this;

    _classCallCheck(this, RuleList);

    this.map = {};
    this.raw = {};
    this.index = [];

    this.update = function (name, data) {
      var _options = _this.options,
          plugins = _options.jss.plugins,
          sheet = _options.sheet;

      if (typeof name === 'string') {
        plugins.onUpdate(data, _this.get(name), sheet);
      } else {
        for (var index = 0; index < _this.index.length; index++) {
          plugins.onUpdate(name, _this.index[index], sheet);
        }
      }
    };

    this.options = options;
    this.classes = options.classes;
  }

  /**
   * Create and register rule.
   *
   * Will not render after Style Sheet was rendered the first time.
   */


  // Used to ensure correct rules order.

  // Rules registry for access by .get() method.
  // It contains the same rule registered by name and by selector.


  _createClass(RuleList, [{
    key: 'add',
    value: function add(name, decl, options) {
      var _options2 = this.options,
          parent = _options2.parent,
          sheet = _options2.sheet,
          jss = _options2.jss,
          Renderer = _options2.Renderer,
          generateClassName = _options2.generateClassName;


      options = _extends({
        classes: this.classes,
        parent: parent,
        sheet: sheet,
        jss: jss,
        Renderer: Renderer,
        generateClassName: generateClassName
      }, options);

      if (!options.selector && this.classes[name]) {
        options.selector = '.' + (0, _escape2['default'])(this.classes[name]);
      }

      this.raw[name] = decl;

      var rule = (0, _createRule2['default'])(name, decl, options);

      var className = void 0;

      if (!options.selector && rule instanceof _StyleRule2['default']) {
        className = generateClassName(rule, sheet);
        rule.selector = '.' + (0, _escape2['default'])(className);
      }

      this.register(rule, className);

      var index = options.index === undefined ? this.index.length : options.index;
      this.index.splice(index, 0, rule);

      return rule;
    }

    /**
     * Get a rule.
     */

  }, {
    key: 'get',
    value: function get(name) {
      return this.map[name];
    }

    /**
     * Delete a rule.
     */

  }, {
    key: 'remove',
    value: function remove(rule) {
      this.unregister(rule);
      this.index.splice(this.indexOf(rule), 1);
    }

    /**
     * Get index of a rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(rule) {
      return this.index.indexOf(rule);
    }

    /**
     * Run `onProcessRule()` plugins on every rule.
     */

  }, {
    key: 'process',
    value: function process() {
      var plugins = this.options.jss.plugins;
      // We need to clone array because if we modify the index somewhere else during a loop
      // we end up with very hard-to-track-down side effects.

      this.index.slice(0).forEach(plugins.onProcessRule, plugins);
    }

    /**
     * Register a rule in `.map` and `.classes` maps.
     */

  }, {
    key: 'register',
    value: function register(rule, className) {
      this.map[rule.key] = rule;
      if (rule instanceof _StyleRule2['default']) {
        this.map[rule.selector] = rule;
        if (className) this.classes[rule.key] = className;
      }
    }

    /**
     * Unregister a rule.
     */

  }, {
    key: 'unregister',
    value: function unregister(rule) {
      delete this.map[rule.key];
      if (rule instanceof _StyleRule2['default']) {
        delete this.map[rule.selector];
        delete this.classes[rule.key];
      }
    }

    /**
     * Update the function values with a new data.
     */

  }, {
    key: 'link',


    /**
     * Link renderable rules with CSSRuleList.
     */
    value: function link(cssRules) {
      var map = this.options.sheet.renderer.getUnescapedKeysMap(this.index);

      for (var i = 0; i < cssRules.length; i++) {
        var cssRule = cssRules[i];
        var _key = this.options.sheet.renderer.getKey(cssRule);
        if (map[_key]) _key = map[_key];
        var rule = this.map[_key];
        if (rule) (0, _linkRule2['default'])(rule, cssRule);
      }
    }

    /**
     * Convert rules to a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      var str = '';
      var sheet = this.options.sheet;

      var link = sheet ? sheet.options.link : false;

      for (var index = 0; index < this.index.length; index++) {
        var rule = this.index[index];
        var css = rule.toString(options);

        // No need to render an empty rule.
        if (!css && !link) continue;

        if (str) str += '\n';
        str += css;
      }

      return str;
    }
  }]);

  return RuleList;
}();

exports['default'] = RuleList;
},{"./rules/StyleRule":20,"./utils/createRule":25,"./utils/escape":26,"./utils/linkRule":29}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * SheetsManager is like a WeakMap which is designed to count StyleSheet
 * instances and attach/detach automatically.
 */
var SheetsManager = function () {
  function SheetsManager() {
    _classCallCheck(this, SheetsManager);

    this.sheets = [];
    this.refs = [];
    this.keys = [];
  }

  _createClass(SheetsManager, [{
    key: 'get',
    value: function get(key) {
      var index = this.keys.indexOf(key);
      return this.sheets[index];
    }
  }, {
    key: 'add',
    value: function add(key, sheet) {
      var sheets = this.sheets,
          refs = this.refs,
          keys = this.keys;

      var index = sheets.indexOf(sheet);

      if (index !== -1) return index;

      sheets.push(sheet);
      refs.push(0);
      keys.push(key);

      return sheets.length - 1;
    }
  }, {
    key: 'manage',
    value: function manage(key) {
      var index = this.keys.indexOf(key);
      var sheet = this.sheets[index];
      if (this.refs[index] === 0) sheet.attach();
      this.refs[index]++;
      if (!this.keys[index]) this.keys.splice(index, 0, key);
      return sheet;
    }
  }, {
    key: 'unmanage',
    value: function unmanage(key) {
      var index = this.keys.indexOf(key);
      if (index === -1) {
        // eslint-ignore-next-line no-console
        (0, _warning2['default'])(false, "SheetsManager: can't find sheet to unmanage");
        return;
      }
      if (this.refs[index] > 0) {
        this.refs[index]--;
        if (this.refs[index] === 0) this.sheets[index].detach();
      }
    }
  }, {
    key: 'size',
    get: function get() {
      return this.keys.length;
    }
  }]);

  return SheetsManager;
}();

exports['default'] = SheetsManager;
},{"warning":37}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Sheets registry to access them all at one place.
 */
var SheetsRegistry = function () {
  function SheetsRegistry() {
    _classCallCheck(this, SheetsRegistry);

    this.registry = [];
  }

  _createClass(SheetsRegistry, [{
    key: 'add',


    /**
     * Register a Style Sheet.
     */
    value: function add(sheet) {
      var registry = this.registry;
      var index = sheet.options.index;


      if (registry.indexOf(sheet) !== -1) return;

      if (registry.length === 0 || index >= this.index) {
        registry.push(sheet);
        return;
      }

      // Find a position.
      for (var i = 0; i < registry.length; i++) {
        if (registry[i].options.index > index) {
          registry.splice(i, 0, sheet);
          return;
        }
      }
    }

    /**
     * Reset the registry.
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.registry = [];
    }

    /**
     * Remove a Style Sheet.
     */

  }, {
    key: 'remove',
    value: function remove(sheet) {
      var index = this.registry.indexOf(sheet);
      this.registry.splice(index, 1);
    }

    /**
     * Convert all attached sheets to a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      return this.registry.filter(function (sheet) {
        return sheet.attached;
      }).map(function (sheet) {
        return sheet.toString(options);
      }).join('\n');
    }
  }, {
    key: 'index',


    /**
     * Current highest index number.
     */
    get: function get() {
      return this.registry.length === 0 ? 0 : this.registry[this.registry.length - 1].options.index;
    }
  }]);

  return SheetsRegistry;
}();

exports['default'] = SheetsRegistry;
},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _linkRule = require('./utils/linkRule');

var _linkRule2 = _interopRequireDefault(_linkRule);

var _RuleList = require('./RuleList');

var _RuleList2 = _interopRequireDefault(_RuleList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable-next-line no-use-before-define */
var StyleSheet = function () {
  function StyleSheet(styles, options) {
    var _this = this;

    _classCallCheck(this, StyleSheet);

    this.update = function (name, data) {
      if (typeof name === 'string') {
        _this.rules.update(name, data);
      } else {
        _this.rules.update(name);
      }
      return _this;
    };

    this.attached = false;
    this.deployed = false;
    this.linked = false;
    this.classes = {};
    this.options = _extends({}, options, {
      sheet: this,
      parent: this,
      classes: this.classes
    });
    this.renderer = new options.Renderer(this);
    this.rules = new _RuleList2['default'](this.options);

    for (var _name in styles) {
      this.rules.add(_name, styles[_name]);
    }

    this.rules.process();
  }

  /**
   * Attach renderable to the render tree.
   */


  _createClass(StyleSheet, [{
    key: 'attach',
    value: function attach() {
      if (this.attached) return this;
      if (!this.deployed) this.deploy();
      this.renderer.attach();
      if (!this.linked && this.options.link) this.link();
      this.attached = true;
      return this;
    }

    /**
     * Remove renderable from render tree.
     */

  }, {
    key: 'detach',
    value: function detach() {
      if (!this.attached) return this;
      this.renderer.detach();
      this.attached = false;
      return this;
    }

    /**
     * Add a rule to the current stylesheet.
     * Will insert a rule also after the stylesheet has been rendered first time.
     */

  }, {
    key: 'addRule',
    value: function addRule(name, decl, options) {
      var queue = this.queue;

      // Plugins can create rules.
      // In order to preserve the right order, we need to queue all `.addRule` calls,
      // which happen after the first `rules.add()` call.

      if (this.attached && !queue) this.queue = [];

      var rule = this.rules.add(name, decl, options);
      this.options.jss.plugins.onProcessRule(rule);

      if (this.attached) {
        if (!this.deployed) return rule;
        // Don't insert rule directly if there is no stringified version yet.
        // It will be inserted all together when .attach is called.
        if (queue) queue.push(rule);else {
          this.insertRule(rule);
          if (this.queue) {
            this.queue.forEach(this.insertRule, this);
            this.queue = undefined;
          }
        }
        return rule;
      }

      // We can't add rules to a detached style node.
      // We will redeploy the sheet once user will attach it.
      this.deployed = false;

      return rule;
    }

    /**
     * Insert rule into the StyleSheet
     */

  }, {
    key: 'insertRule',
    value: function insertRule(rule) {
      var renderable = this.renderer.insertRule(rule);
      if (renderable && this.options.link) (0, _linkRule2['default'])(rule, renderable);
    }

    /**
     * Create and add rules.
     * Will render also after Style Sheet was rendered the first time.
     */

  }, {
    key: 'addRules',
    value: function addRules(styles, options) {
      var added = [];
      for (var _name2 in styles) {
        added.push(this.addRule(_name2, styles[_name2], options));
      }
      return added;
    }

    /**
     * Get a rule by name.
     */

  }, {
    key: 'getRule',
    value: function getRule(name) {
      return this.rules.get(name);
    }

    /**
     * Delete a rule by name.
     * Returns `true`: if rule has been deleted from the DOM.
     */

  }, {
    key: 'deleteRule',
    value: function deleteRule(name) {
      var rule = this.rules.get(name);

      if (!rule) return false;

      this.rules.remove(rule);

      if (this.attached && rule.renderable) {
        return this.renderer.deleteRule(rule.renderable);
      }

      return true;
    }

    /**
     * Get index of a rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(rule) {
      return this.rules.indexOf(rule);
    }

    /**
     * Deploy pure CSS string to a renderable.
     */

  }, {
    key: 'deploy',
    value: function deploy() {
      this.renderer.deploy();
      this.deployed = true;
      return this;
    }

    /**
     * Link renderable CSS rules from sheet with their corresponding models.
     */

  }, {
    key: 'link',
    value: function link() {
      var cssRules = this.renderer.getRules();

      // Is undefined when VirtualRenderer is used.
      if (cssRules) this.rules.link(cssRules);
      this.linked = true;
      return this;
    }

    /**
     * Update the function values with a new data.
     */

  }, {
    key: 'toString',


    /**
     * Convert rules to a CSS string.
     */
    value: function toString(options) {
      return this.rules.toString(options);
    }
  }]);

  return StyleSheet;
}();

exports['default'] = StyleSheet;
},{"./RuleList":6,"./utils/linkRule":29}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = exports.createGenerateClassName = exports.sheets = exports.RuleList = exports.SheetsManager = exports.SheetsRegistry = exports.toCssValue = exports.getDynamicStyles = undefined;

var _getDynamicStyles = require('./utils/getDynamicStyles');

Object.defineProperty(exports, 'getDynamicStyles', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getDynamicStyles)['default'];
  }
});

var _toCssValue = require('./utils/toCssValue');

Object.defineProperty(exports, 'toCssValue', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_toCssValue)['default'];
  }
});

var _SheetsRegistry = require('./SheetsRegistry');

Object.defineProperty(exports, 'SheetsRegistry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SheetsRegistry)['default'];
  }
});

var _SheetsManager = require('./SheetsManager');

Object.defineProperty(exports, 'SheetsManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SheetsManager)['default'];
  }
});

var _RuleList = require('./RuleList');

Object.defineProperty(exports, 'RuleList', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RuleList)['default'];
  }
});

var _sheets = require('./sheets');

Object.defineProperty(exports, 'sheets', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sheets)['default'];
  }
});

var _createGenerateClassName = require('./utils/createGenerateClassName');

Object.defineProperty(exports, 'createGenerateClassName', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createGenerateClassName)['default'];
  }
});

var _Jss = require('./Jss');

var _Jss2 = _interopRequireDefault(_Jss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Creates a new instance of Jss.
 */
var create = exports.create = function create(options) {
  return new _Jss2['default'](options);
};

/**
 * A global Jss instance.
 */
exports['default'] = create();
},{"./Jss":4,"./RuleList":6,"./SheetsManager":7,"./SheetsRegistry":8,"./sheets":22,"./utils/createGenerateClassName":24,"./utils/getDynamicStyles":27,"./utils/toCssValue":32}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _RuleList = require('../RuleList');

var _RuleList2 = _interopRequireDefault(_RuleList);

var _StyleRule = require('../rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _createRule = require('../utils/createRule');

var _createRule2 = _interopRequireDefault(_createRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// A symbol replacement.
var now = Date.now();

var fnValuesNs = 'fnValues' + now;
var fnStyleNs = 'fnStyle' + ++now;

exports['default'] = {
  onCreateRule: function onCreateRule(name, decl, options) {
    if (typeof decl !== 'function') return null;
    var rule = (0, _createRule2['default'])(name, {}, options);
    rule[fnStyleNs] = decl;
    return rule;
  },
  onProcessStyle: function onProcessStyle(style, rule) {
    var fn = {};
    for (var prop in style) {
      var value = style[prop];
      if (typeof value !== 'function') continue;
      delete style[prop];
      fn[prop] = value;
    }
    rule = rule;
    rule[fnValuesNs] = fn;
    return style;
  },
  onUpdate: function onUpdate(data, rule) {
    // It is a rules container like for e.g. ConditionalRule.
    if (rule.rules instanceof _RuleList2['default']) {
      rule.rules.update(data);
      return;
    }
    if (!(rule instanceof _StyleRule2['default'])) return;

    rule = rule;

    // If we have a fn values map, it is a rule with function values.
    if (rule[fnValuesNs]) {
      for (var prop in rule[fnValuesNs]) {
        rule.prop(prop, rule[fnValuesNs][prop](data));
      }
    }

    rule = rule;

    var fnStyle = rule[fnStyleNs];

    // If we have a style function, the entire rule is dynamic and style object
    // will be returned from that function.
    if (fnStyle) {
      var style = fnStyle(data);
      for (var _prop in style) {
        rule.prop(_prop, style[_prop]);
      }
    }
  }
};
},{"../RuleList":6,"../rules/StyleRule":20,"../utils/createRule":25}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _StyleRule = require('../rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _createRule = require('../utils/createRule');

var _createRule2 = _interopRequireDefault(_createRule);

var _isObservable = require('../utils/isObservable');

var _isObservable2 = _interopRequireDefault(_isObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  onCreateRule: function onCreateRule(name, decl, options) {
    if (!(0, _isObservable2['default'])(decl)) return null;

    // Cast `decl` to `Observable`, since it passed the type guard.
    var style$ = decl;

    var rule = (0, _createRule2['default'])(name, {}, options);

    // TODO
    // Call `stream.subscribe()` returns a subscription, which should be explicitly
    // unsubscribed from when we know this sheet is no longer needed.
    style$.subscribe(function (style) {
      for (var prop in style) {
        rule.prop(prop, style[prop]);
      }
    });

    return rule;
  },
  onProcessRule: function onProcessRule(rule) {
    if (!(rule instanceof _StyleRule2['default'])) return;
    var styleRule = rule;
    var style = styleRule.style;

    var _loop = function _loop(prop) {
      var value = style[prop];
      if (!(0, _isObservable2['default'])(value)) return 'continue';
      delete style[prop];
      value.subscribe({
        next: function next(nextValue) {
          styleRule.prop(prop, nextValue);
        }
      });
    };

    for (var prop in style) {
      var _ret = _loop(prop);

      if (_ret === 'continue') continue;
    }
  }
};
},{"../rules/StyleRule":20,"../utils/createRule":25,"../utils/isObservable":28}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SimpleRule = require('../rules/SimpleRule');

var _SimpleRule2 = _interopRequireDefault(_SimpleRule);

var _KeyframesRule = require('../rules/KeyframesRule');

var _KeyframesRule2 = _interopRequireDefault(_KeyframesRule);

var _ConditionalRule = require('../rules/ConditionalRule');

var _ConditionalRule2 = _interopRequireDefault(_ConditionalRule);

var _FontFaceRule = require('../rules/FontFaceRule');

var _FontFaceRule2 = _interopRequireDefault(_FontFaceRule);

var _ViewportRule = require('../rules/ViewportRule');

var _ViewportRule2 = _interopRequireDefault(_ViewportRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var classes = {
  '@charset': _SimpleRule2['default'],
  '@import': _SimpleRule2['default'],
  '@namespace': _SimpleRule2['default'],
  '@keyframes': _KeyframesRule2['default'],
  '@media': _ConditionalRule2['default'],
  '@supports': _ConditionalRule2['default'],
  '@font-face': _FontFaceRule2['default'],
  '@viewport': _ViewportRule2['default'],
  '@-ms-viewport': _ViewportRule2['default']

  /**
   * Generate plugins which will register all rules.
   */
};
var plugins = Object.keys(classes).map(function (key) {
  // https://jsperf.com/indexof-vs-substr-vs-regex-at-the-beginning-3
  var re = new RegExp('^' + key);
  var RuleClass = classes[key];
  var onCreateRule = function onCreateRule(name, decl, options) {
    return re.test(name) ? new RuleClass(name, decl, options) : null;
  };
  return { onCreateRule: onCreateRule };
});

exports['default'] = plugins;
},{"../rules/ConditionalRule":16,"../rules/FontFaceRule":17,"../rules/KeyframesRule":18,"../rules/SimpleRule":19,"../rules/ViewportRule":21}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _sheets = require('../sheets');

var _sheets2 = _interopRequireDefault(_sheets);

var _StyleRule = require('../rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _toCssValue = require('../utils/toCssValue');

var _toCssValue2 = _interopRequireDefault(_toCssValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Cache the value from the first time a function is called.
 */
var memoize = function memoize(fn) {
  var value = void 0;
  return function () {
    if (!value) value = fn();
    return value;
  };
};

/**
 * Get a style property value.
 */
function getPropertyValue(cssRule, prop) {
  try {
    return cssRule.style.getPropertyValue(prop);
  } catch (err) {
    // IE may throw if property is unknown.
    return '';
  }
}

/**
 * Set a style property.
 */
function setProperty(cssRule, prop, value) {
  try {
    var cssValue = value;

    if (Array.isArray(value)) {
      cssValue = (0, _toCssValue2['default'])(value, true);

      if (value[value.length - 1] === '!important') {
        cssRule.style.setProperty(prop, cssValue, 'important');
        return true;
      }
    }

    cssRule.style.setProperty(prop, cssValue);
  } catch (err) {
    // IE may throw if property is unknown.
    return false;
  }
  return true;
}

/**
 * Remove a style property.
 */
function removeProperty(cssRule, prop) {
  try {
    cssRule.style.removeProperty(prop);
  } catch (err) {
    (0, _warning2['default'])(false, '[JSS] DOMException "%s" was thrown. Tried to remove property "%s".', err.message, prop);
  }
}

var CSSRuleTypes = {
  STYLE_RULE: 1,
  KEYFRAMES_RULE: 7

  /**
   * Get the CSS Rule key.
   */

};var getKey = function () {
  var extractKey = function extractKey(cssText) {
    var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return cssText.substr(from, cssText.indexOf('{') - 1);
  };

  return function (cssRule) {
    if (cssRule.type === CSSRuleTypes.STYLE_RULE) return cssRule.selectorText;
    if (cssRule.type === CSSRuleTypes.KEYFRAMES_RULE) {
      var name = cssRule.name;

      if (name) return '@keyframes ' + name;

      // There is no rule.name in the following browsers:
      // - IE 9
      // - Safari 7.1.8
      // - Mobile Safari 9.0.0
      var cssText = cssRule.cssText;

      return '@' + extractKey(cssText, cssText.indexOf('keyframes'));
    }

    // Conditionals.
    return extractKey(cssRule.cssText);
  };
}();

/**
 * Set the selector.
 */
function setSelector(cssRule, selectorText) {
  cssRule.selectorText = selectorText;

  // Return false if setter was not successful.
  // Currently works in chrome only.
  return cssRule.selectorText === selectorText;
}

/**
 * Gets the `head` element upon the first call and caches it.
 */
var getHead = memoize(function () {
  return document.head || document.getElementsByTagName('head')[0];
});

/**
 * Gets a map of rule keys, where the property is an unescaped key and value
 * is a potentially escaped one.
 * It is used to identify CSS rules and the corresponding JSS rules. As an identifier
 * for CSSStyleRule we normally use `selectorText`. Though if original selector text
 * contains escaped code points e.g. `:not(#\\20)`, CSSOM will compile it to `:not(# )`
 * and so CSS rule's `selectorText` won't match JSS rule selector.
 *
 * https://www.w3.org/International/questions/qa-escapes#cssescapes
 */
var getUnescapedKeysMap = function () {
  var style = void 0;
  var isAttached = false;

  return function (rules) {
    var map = {};
    // https://github.com/facebook/flow/issues/2696
    if (!style) style = document.createElement('style');
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (!(rule instanceof _StyleRule2['default'])) continue;
      var selector = rule.selector;
      // Only unescape selector over CSSOM if it contains a back slash.

      if (selector && selector.indexOf('\\') !== -1) {
        // Lazilly attach when needed.
        if (!isAttached) {
          getHead().appendChild(style);
          isAttached = true;
        }
        style.textContent = selector + ' {}';
        var _style = style,
            sheet = _style.sheet;

        if (sheet) {
          var cssRules = sheet.cssRules;

          if (cssRules) map[cssRules[0].selectorText] = rule.key;
        }
      }
    }
    if (isAttached) {
      getHead().removeChild(style);
      isAttached = false;
    }
    return map;
  };
}();

/**
 * Find attached sheet with an index higher than the passed one.
 */
function findHigherSheet(registry, options) {
  for (var i = 0; i < registry.length; i++) {
    var sheet = registry[i];
    if (sheet.attached && sheet.options.index > options.index && sheet.options.insertionPoint === options.insertionPoint) {
      return sheet;
    }
  }
  return null;
}

/**
 * Find attached sheet with the highest index.
 */
function findHighestSheet(registry, options) {
  for (var i = registry.length - 1; i >= 0; i--) {
    var sheet = registry[i];
    if (sheet.attached && sheet.options.insertionPoint === options.insertionPoint) {
      return sheet;
    }
  }
  return null;
}

/**
 * Find a comment with "jss" inside.
 */
function findCommentNode(text) {
  var head = getHead();
  for (var i = 0; i < head.childNodes.length; i++) {
    var node = head.childNodes[i];
    if (node.nodeType === 8 && node.nodeValue.trim() === text) {
      return node;
    }
  }
  return null;
}

/**
 * Find a node before which we can insert the sheet.
 */
function findPrevNode(options) {
  var registry = _sheets2['default'].registry;


  if (registry.length > 0) {
    // Try to insert before the next higher sheet.
    var sheet = findHigherSheet(registry, options);
    if (sheet) return sheet.renderer.element;

    // Otherwise insert after the last attached.
    sheet = findHighestSheet(registry, options);
    if (sheet) return sheet.renderer.element.nextElementSibling;
  }

  // Try to find a comment placeholder if registry is empty.
  var insertionPoint = options.insertionPoint;

  if (insertionPoint && typeof insertionPoint === 'string') {
    var comment = findCommentNode(insertionPoint);
    if (comment) return comment.nextSibling;
    // If user specifies an insertion point and it can't be found in the document -
    // bad specificity issues may appear.
    (0, _warning2['default'])(insertionPoint === 'jss', '[JSS] Insertion point "%s" not found.', insertionPoint);
  }

  return null;
}

/**
 * Insert style element into the DOM.
 */
function insertStyle(style, options) {
  var insertionPoint = options.insertionPoint;

  var prevNode = findPrevNode(options);

  if (prevNode) {
    var parentNode = prevNode.parentNode;

    if (parentNode) parentNode.insertBefore(style, prevNode);
    return;
  }

  // Works with iframes and any node types.
  if (insertionPoint && typeof insertionPoint.nodeType === 'number') {
    // https://stackoverflow.com/questions/41328728/force-casting-in-flow
    var insertionPointElement = insertionPoint;
    var _parentNode = insertionPointElement.parentNode;

    if (_parentNode) _parentNode.insertBefore(style, insertionPointElement.nextSibling);else (0, _warning2['default'])(false, '[JSS] Insertion point is not in the DOM.');
    return;
  }

  getHead().insertBefore(style, prevNode);
}

/**
 * Read jss nonce setting from the page if the user has set it.
 */
var getNonce = memoize(function () {
  var node = document.querySelector('meta[property="csp-nonce"]');
  return node ? node.getAttribute('content') : null;
});

var DomRenderer = function () {
  function DomRenderer(sheet) {
    _classCallCheck(this, DomRenderer);

    this.getPropertyValue = getPropertyValue;
    this.setProperty = setProperty;
    this.removeProperty = removeProperty;
    this.setSelector = setSelector;
    this.getKey = getKey;
    this.getUnescapedKeysMap = getUnescapedKeysMap;
    this.hasInsertedRules = false;

    // There is no sheet when the renderer is used from a standalone StyleRule.
    if (sheet) _sheets2['default'].add(sheet);

    this.sheet = sheet;

    var _ref = this.sheet ? this.sheet.options : {},
        media = _ref.media,
        meta = _ref.meta,
        element = _ref.element;

    this.element = element || document.createElement('style');
    this.element.setAttribute('data-jss', '');
    if (media) this.element.setAttribute('media', media);
    if (meta) this.element.setAttribute('data-meta', meta);
    var nonce = getNonce();
    if (nonce) this.element.setAttribute('nonce', nonce);
  }

  /**
   * Insert style element into render tree.
   */


  // HTMLStyleElement needs fixing https://github.com/facebook/flow/issues/2696


  _createClass(DomRenderer, [{
    key: 'attach',
    value: function attach() {
      // In the case the element node is external and it is already in the DOM.
      if (this.element.parentNode || !this.sheet) return;

      // When rules are inserted using `insertRule` API, after `sheet.detach().attach()`
      // browsers remove those rules.
      // TODO figure out if its a bug and if it is known.
      // Workaround is to redeploy the sheet before attaching as a string.
      if (this.hasInsertedRules) {
        this.deploy();
        this.hasInsertedRules = false;
      }

      insertStyle(this.element, this.sheet.options);
    }

    /**
     * Remove style element from render tree.
     */

  }, {
    key: 'detach',
    value: function detach() {
      this.element.parentNode.removeChild(this.element);
    }

    /**
     * Inject CSS string into element.
     */

  }, {
    key: 'deploy',
    value: function deploy() {
      if (!this.sheet) return;
      this.element.textContent = '\n' + this.sheet.toString() + '\n';
    }

    /**
     * Insert a rule into element.
     */

  }, {
    key: 'insertRule',
    value: function insertRule(rule, index) {
      var sheet = this.element.sheet;
      var cssRules = sheet.cssRules;

      var str = rule.toString();
      if (!index) index = cssRules.length;

      if (!str) return false;

      try {
        sheet.insertRule(str, index);
      } catch (err) {
        (0, _warning2['default'])(false, '[JSS] Can not insert an unsupported rule \n\r%s', rule);
        return false;
      }
      this.hasInsertedRules = true;

      return cssRules[index];
    }

    /**
     * Delete a rule.
     */

  }, {
    key: 'deleteRule',
    value: function deleteRule(cssRule) {
      var sheet = this.element.sheet;

      var index = this.indexOf(cssRule);
      if (index === -1) return false;
      sheet.deleteRule(index);
      return true;
    }

    /**
     * Get index of a CSS Rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(cssRule) {
      var cssRules = this.element.sheet.cssRules;

      for (var _index = 0; _index < cssRules.length; _index++) {
        if (cssRule === cssRules[_index]) return _index;
      }
      return -1;
    }

    /**
     * Generate a new CSS rule and replace the existing one.
     */

  }, {
    key: 'replaceRule',
    value: function replaceRule(cssRule, rule) {
      var index = this.indexOf(cssRule);
      var newCssRule = this.insertRule(rule, index);
      this.element.sheet.deleteRule(index);
      return newCssRule;
    }

    /**
     * Get all rules elements.
     */

  }, {
    key: 'getRules',
    value: function getRules() {
      return this.element.sheet.cssRules;
    }
  }]);

  return DomRenderer;
}();

exports['default'] = DomRenderer;
},{"../rules/StyleRule":20,"../sheets":22,"../utils/toCssValue":32,"warning":37}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable class-methods-use-this */

/**
 * Rendering backend to do nothing in nodejs.
 */
var VirtualRenderer = function () {
  function VirtualRenderer() {
    _classCallCheck(this, VirtualRenderer);
  }

  _createClass(VirtualRenderer, [{
    key: 'setProperty',
    value: function setProperty() {
      return true;
    }
  }, {
    key: 'getPropertyValue',
    value: function getPropertyValue() {
      return '';
    }
  }, {
    key: 'removeProperty',
    value: function removeProperty() {}
  }, {
    key: 'setSelector',
    value: function setSelector() {
      return true;
    }
  }, {
    key: 'getKey',
    value: function getKey() {
      return '';
    }
  }, {
    key: 'attach',
    value: function attach() {}
  }, {
    key: 'detach',
    value: function detach() {}
  }, {
    key: 'deploy',
    value: function deploy() {}
  }, {
    key: 'insertRule',
    value: function insertRule() {
      return false;
    }
  }, {
    key: 'deleteRule',
    value: function deleteRule() {
      return true;
    }
  }, {
    key: 'replaceRule',
    value: function replaceRule() {
      return false;
    }
  }, {
    key: 'getRules',
    value: function getRules() {}
  }, {
    key: 'indexOf',
    value: function indexOf() {
      return -1;
    }
  }]);

  return VirtualRenderer;
}();

exports['default'] = VirtualRenderer;
},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RuleList = require('../RuleList');

var _RuleList2 = _interopRequireDefault(_RuleList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Conditional rule for @media, @supports
 */
var ConditionalRule = function () {
  function ConditionalRule(key, styles, options) {
    _classCallCheck(this, ConditionalRule);

    this.type = 'conditional';
    this.isProcessed = false;

    this.key = key;
    this.options = options;
    this.rules = new _RuleList2['default'](_extends({}, options, { parent: this }));

    for (var name in styles) {
      this.rules.add(name, styles[name]);
    }

    this.rules.process();
  }

  /**
   * Get a rule.
   */


  _createClass(ConditionalRule, [{
    key: 'getRule',
    value: function getRule(name) {
      return this.rules.get(name);
    }

    /**
     * Get index of a rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(rule) {
      return this.rules.indexOf(rule);
    }

    /**
     * Create and register rule, run plugins.
     */

  }, {
    key: 'addRule',
    value: function addRule(name, style, options) {
      var rule = this.rules.add(name, style, options);
      this.options.jss.plugins.onProcessRule(rule);
      return rule;
    }

    /**
     * Generates a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { indent: 1 };

      var inner = this.rules.toString(options);
      return inner ? this.key + ' {\n' + inner + '\n}' : '';
    }
  }]);

  return ConditionalRule;
}();

exports['default'] = ConditionalRule;
},{"../RuleList":6}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _toCss = require('../utils/toCss');

var _toCss2 = _interopRequireDefault(_toCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FontFaceRule = function () {
  function FontFaceRule(key, style, options) {
    _classCallCheck(this, FontFaceRule);

    this.type = 'font-face';
    this.isProcessed = false;

    this.key = key;
    this.style = style;
    this.options = options;
  }

  /**
   * Generates a CSS string.
   */


  _createClass(FontFaceRule, [{
    key: 'toString',
    value: function toString(options) {
      if (Array.isArray(this.style)) {
        var str = '';
        for (var index = 0; index < this.style.length; index++) {
          str += (0, _toCss2['default'])(this.key, this.style[index]);
          if (this.style[index + 1]) str += '\n';
        }
        return str;
      }

      return (0, _toCss2['default'])(this.key, this.style, options);
    }
  }]);

  return FontFaceRule;
}();

exports['default'] = FontFaceRule;
},{"../utils/toCss":31}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RuleList = require('../RuleList');

var _RuleList2 = _interopRequireDefault(_RuleList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rule for @keyframes
 */
var KeyframesRule = function () {
  function KeyframesRule(key, frames, options) {
    _classCallCheck(this, KeyframesRule);

    this.type = 'keyframes';
    this.isProcessed = false;

    this.key = key;
    this.options = options;
    this.rules = new _RuleList2['default'](_extends({}, options, { parent: this }));

    for (var name in frames) {
      this.rules.add(name, frames[name], _extends({}, this.options, {
        parent: this,
        selector: name
      }));
    }

    this.rules.process();
  }

  /**
   * Generates a CSS string.
   */


  _createClass(KeyframesRule, [{
    key: 'toString',
    value: function toString() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { indent: 1 };

      var inner = this.rules.toString(options);
      if (inner) inner += '\n';
      return this.key + ' {\n' + inner + '}';
    }
  }]);

  return KeyframesRule;
}();

exports['default'] = KeyframesRule;
},{"../RuleList":6}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleRule = function () {
  function SimpleRule(key, value, options) {
    _classCallCheck(this, SimpleRule);

    this.type = 'simple';
    this.isProcessed = false;

    this.key = key;
    this.value = value;
    this.options = options;
  }

  /**
   * Generates a CSS string.
   */
  // eslint-disable-next-line no-unused-vars


  _createClass(SimpleRule, [{
    key: 'toString',
    value: function toString(options) {
      if (Array.isArray(this.value)) {
        var str = '';
        for (var index = 0; index < this.value.length; index++) {
          str += this.key + ' ' + this.value[index] + ';';
          if (this.value[index + 1]) str += '\n';
        }
        return str;
      }

      return this.key + ' ' + this.value + ';';
    }
  }]);

  return SimpleRule;
}();

exports['default'] = SimpleRule;
},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _toCss = require('../utils/toCss');

var _toCss2 = _interopRequireDefault(_toCss);

var _toCssValue = require('../utils/toCssValue');

var _toCssValue2 = _interopRequireDefault(_toCssValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleRule = function () {
  function StyleRule(key, style, options) {
    _classCallCheck(this, StyleRule);

    this.type = 'style';
    this.isProcessed = false;
    var sheet = options.sheet,
        Renderer = options.Renderer,
        selector = options.selector;

    this.key = key;
    this.options = options;
    this.style = style;
    if (selector) this.selectorText = selector;
    this.renderer = sheet ? sheet.renderer : new Renderer();
  }

  /**
   * Set selector string.
   * Attention: use this with caution. Most browsers didn't implement
   * selectorText setter, so this may result in rerendering of entire Style Sheet.
   */


  _createClass(StyleRule, [{
    key: 'prop',


    /**
     * Get or set a style property.
     */
    value: function prop(name, value) {
      // It's a getter.
      if (value === undefined) return this.style[name];

      // Don't do anything if the value has not changed.
      if (this.style[name] === value) return this;

      value = this.options.jss.plugins.onChangeValue(value, name, this);

      var isEmpty = value == null || value === false;
      var isDefined = name in this.style;

      // Value is empty and wasn't defined before.
      if (isEmpty && !isDefined) return this;

      // We are going to remove this value.
      var remove = isEmpty && isDefined;

      if (remove) delete this.style[name];else this.style[name] = value;

      // Renderable is defined if StyleSheet option `link` is true.
      if (this.renderable) {
        if (remove) this.renderer.removeProperty(this.renderable, name);else this.renderer.setProperty(this.renderable, name, value);
        return this;
      }

      var sheet = this.options.sheet;

      if (sheet && sheet.attached) {
        (0, _warning2['default'])(false, 'Rule is not linked. Missing sheet option "link: true".');
      }
      return this;
    }

    /**
     * Apply rule to an element inline.
     */

  }, {
    key: 'applyTo',
    value: function applyTo(renderable) {
      var json = this.toJSON();
      for (var prop in json) {
        this.renderer.setProperty(renderable, prop, json[prop]);
      }return this;
    }

    /**
     * Returns JSON representation of the rule.
     * Fallbacks are not supported.
     * Useful for inline styles.
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var json = {};
      for (var prop in this.style) {
        var value = this.style[prop];
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') json[prop] = value;else if (Array.isArray(value)) json[prop] = (0, _toCssValue2['default'])(value);
      }
      return json;
    }

    /**
     * Generates a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      var sheet = this.options.sheet;

      var link = sheet ? sheet.options.link : false;
      var opts = link ? _extends({}, options, { allowEmpty: true }) : options;
      return (0, _toCss2['default'])(this.selector, this.style, opts);
    }
  }, {
    key: 'selector',
    set: function set(selector) {
      if (selector === this.selectorText) return;

      this.selectorText = selector;

      if (!this.renderable) return;

      var hasChanged = this.renderer.setSelector(this.renderable, selector);

      // If selector setter is not implemented, rerender the rule.
      if (!hasChanged && this.renderable) {
        var renderable = this.renderer.replaceRule(this.renderable, this);
        if (renderable) this.renderable = renderable;
      }
    }

    /**
     * Get selector string.
     */
    ,
    get: function get() {
      return this.selectorText;
    }
  }]);

  return StyleRule;
}();

exports['default'] = StyleRule;
},{"../utils/toCss":31,"../utils/toCssValue":32,"warning":37}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _toCss = require('../utils/toCss');

var _toCss2 = _interopRequireDefault(_toCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewportRule = function () {
  function ViewportRule(key, style, options) {
    _classCallCheck(this, ViewportRule);

    this.type = 'viewport';
    this.isProcessed = false;

    this.key = key;
    this.style = style;
    this.options = options;
  }

  /**
   * Generates a CSS string.
   */


  _createClass(ViewportRule, [{
    key: 'toString',
    value: function toString(options) {
      return (0, _toCss2['default'])(this.key, this.style, options);
    }
  }]);

  return ViewportRule;
}();

exports['default'] = ViewportRule;
},{"../utils/toCss":31}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SheetsRegistry = require('./SheetsRegistry');

var _SheetsRegistry2 = _interopRequireDefault(_SheetsRegistry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * This is a global sheets registry. Only DomRenderer will add sheets to it.
 * On the server one should use an own SheetsRegistry instance and add the
 * sheets to it, because you need to make sure to create a new registry for
 * each request in order to not leak sheets across requests.
 */
exports['default'] = new _SheetsRegistry2['default']();
},{"./SheetsRegistry":8}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports['default'] = cloneStyle;

var _isObservable = require('./isObservable');

var _isObservable2 = _interopRequireDefault(_isObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var isArray = Array.isArray;
function cloneStyle(style) {
  // Support empty values in case user ends up with them by accident.
  if (style == null) return style;

  // Support string value for SimpleRule.
  var typeOfStyle = typeof style === 'undefined' ? 'undefined' : _typeof(style);

  if (typeOfStyle === 'string' || typeOfStyle === 'number' || typeOfStyle === 'function') {
    return style;
  }

  // Support array for FontFaceRule.
  if (isArray(style)) return style.map(cloneStyle);

  // Support Observable styles.  Observables are immutable, so we don't need to
  // copy them.
  if ((0, _isObservable2['default'])(style)) return style;

  var newStyle = {};
  for (var name in style) {
    var value = style[name];
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      newStyle[name] = cloneStyle(value);
      continue;
    }
    newStyle[name] = value;
  }

  return newStyle;
}
},{"./isObservable":28}],24:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _StyleSheet = require('../StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _moduleId = require('./moduleId');

var _moduleId2 = _interopRequireDefault(_moduleId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var maxRules = 1e10;


var env = process.env.NODE_ENV;

/**
 * Returns a function which generates unique class names based on counters.
 * When new generator function is created, rule counter is reseted.
 * We need to reset the rule counter for SSR for each request.
 */

exports['default'] = function () {
  var ruleCounter = 0;
  var defaultPrefix = env === 'production' ? 'c' : '';

  return function (rule, sheet) {
    ruleCounter += 1;

    if (ruleCounter > maxRules) {
      (0, _warning2['default'])(false, '[JSS] You might have a memory leak. Rule counter is at %s.', ruleCounter);
    }

    var prefix = defaultPrefix;
    var jssId = '';

    if (sheet) {
      prefix = sheet.options.classNamePrefix || defaultPrefix;
      if (sheet.options.jss.id != null) jssId += sheet.options.jss.id;
    }

    if (env === 'production') {
      return '' + prefix + _moduleId2['default'] + jssId + ruleCounter;
    }

    return prefix + rule.key + '-' + _moduleId2['default'] + (jssId && '-' + jssId) + '-' + ruleCounter;
  };
};
}).call(this,require('_process'))

},{"../StyleSheet":9,"./moduleId":30,"_process":33,"warning":37}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = createRule;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _StyleRule = require('../rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _cloneStyle = require('../utils/cloneStyle');

var _cloneStyle2 = _interopRequireDefault(_cloneStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Create a rule instance.
 */
function createRule() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'unnamed';
  var decl = arguments[1];
  var options = arguments[2];
  var jss = options.jss;

  var declCopy = (0, _cloneStyle2['default'])(decl);

  var rule = jss.plugins.onCreateRule(name, declCopy, options);
  if (rule) return rule;

  // It is an at-rule and it has no instance.
  if (name[0] === '@') {
    (0, _warning2['default'])(false, '[JSS] Unknown at-rule %s', name);
  }

  return new _StyleRule2['default'](name, declCopy, options);
}
},{"../rules/StyleRule":20,"../utils/cloneStyle":23,"warning":37}],26:[function(require,module,exports){
(function (process,global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CSS = global.CSS;

var env = process.env.NODE_ENV;

var escapeRegex = /([[\].#*$><+~=|^:(),"'`])/g;

exports['default'] = function (str) {
  // We don't need to escape it in production, because we are not using user's
  // input for selectors, we are generating a valid selector.
  if (env === 'production') return str;

  if (!CSS || !CSS.escape) {
    return str.replace(escapeRegex, '\\$1');
  }

  return CSS.escape(str);
};
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":33}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports['default'] = getDynamicStyles;
/**
 * Extracts a styles object with only props that contain function values.
 */
function getDynamicStyles(styles) {
  var to = null;

  for (var key in styles) {
    var value = styles[key];
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

    if (type === 'function') {
      if (!to) to = {};
      to[key] = value;
    } else if (type === 'object' && value !== null && !Array.isArray(value)) {
      var extracted = getDynamicStyles(value);
      if (extracted) {
        if (!to) to = {};
        to[key] = extracted;
      }
    }
  }

  return to;
}
},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = function (value) {
  return value && value[_symbolObservable2['default']] && value === value[_symbolObservable2['default']]();
};
},{"symbol-observable":34}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = linkRule;
/**
 * Link rule with CSSStyleRule and nested rules with corresponding nested cssRules if both exists.
 */
function linkRule(rule, cssRule) {
  rule.renderable = cssRule;
  if (rule.rules && cssRule.cssRules) rule.rules.link(cssRule.cssRules);
}
},{}],30:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ns = '2f1acc6c3a606b082e5eef5e54414ffb';
if (global[ns] == null) global[ns] = 0;

// Bundle may contain multiple JSS versions at the same time. In order to identify
// the current version with just one short number and use it for classes generation
// we use a counter. Also it is more accurate, because user can manually reevaluate
// the module.
exports['default'] = global[ns]++;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = toCss;

var _toCssValue = require('./toCssValue');

var _toCssValue2 = _interopRequireDefault(_toCssValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Indent a string.
 * http://jsperf.com/array-join-vs-for
 */
function indentStr(str, indent) {
  var result = '';
  for (var index = 0; index < indent; index++) {
    result += '  ';
  }return result + str;
}

/**
 * Converts a Rule to CSS string.
 */

function toCss(selector, style) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var result = '';

  if (!style) return result;

  var _options$indent = options.indent,
      indent = _options$indent === undefined ? 0 : _options$indent;
  var fallbacks = style.fallbacks;


  indent++;

  // Apply fallbacks first.
  if (fallbacks) {
    // Array syntax {fallbacks: [{prop: value}]}
    if (Array.isArray(fallbacks)) {
      for (var index = 0; index < fallbacks.length; index++) {
        var fallback = fallbacks[index];
        for (var prop in fallback) {
          var value = fallback[prop];
          if (value != null) {
            result += '\n' + indentStr(prop + ': ' + (0, _toCssValue2['default'])(value) + ';', indent);
          }
        }
      }
    } else {
      // Object syntax {fallbacks: {prop: value}}
      for (var _prop in fallbacks) {
        var _value = fallbacks[_prop];
        if (_value != null) {
          result += '\n' + indentStr(_prop + ': ' + (0, _toCssValue2['default'])(_value) + ';', indent);
        }
      }
    }
  }

  for (var _prop2 in style) {
    var _value2 = style[_prop2];
    if (_value2 != null && _prop2 !== 'fallbacks') {
      result += '\n' + indentStr(_prop2 + ': ' + (0, _toCssValue2['default'])(_value2) + ';', indent);
    }
  }

  // Allow empty style in this case, because properties will be added dynamically.
  if (!result && !options.allowEmpty) return result;

  indent--;
  result = indentStr(selector + ' {' + result + '\n', indent) + indentStr('}', indent);

  return result;
}
},{"./toCssValue":32}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = toCssValue;
var join = function join(value, by) {
  var result = '';
  for (var i = 0; i < value.length; i++) {
    // Remove !important from the value, it will be readded later.
    if (value[i] === '!important') break;
    if (result) result += by;
    result += value[i];
  }
  return result;
};

/**
 * Converts array values to string.
 *
 * `margin: [['5px', '10px']]` > `margin: 5px 10px;`
 * `border: ['1px', '2px']` > `border: 1px, 2px;`
 * `margin: [['5px', '10px'], '!important']` > `margin: 5px 10px !important;`
 * `color: ['red', !important]` > `color: red !important;`
 */
function toCssValue(value) {
  var ignoreImportant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!Array.isArray(value)) return value;

  var cssValue = '';

  // Support space separated values via `[['5px', '10px']]`.
  if (Array.isArray(value[0])) {
    for (var i = 0; i < value.length; i++) {
      if (value[i] === '!important') break;
      if (cssValue) cssValue += ', ';
      cssValue += join(value[i], ' ');
    }
  } else cssValue = join(value, ', ');

  // Add !important, because it was ignored.
  if (!ignoreImportant && value[value.length - 1] === '!important') {
    cssValue += ' !important';
  }

  return cssValue;
}
},{}],33:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],34:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = require('./ponyfill.js');

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./ponyfill.js":35}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};
},{}],36:[function(require,module,exports){
(function (process){
'use strict';

var isProduction = process.env.NODE_ENV === 'production';
function warning(condition, message) {
  if (!isProduction) {
    if (condition) {
      return;
    }

    var text = "Warning: " + message;

    if (typeof console !== 'undefined') {
      console.warn(text);
    }

    try {
      throw Error(text);
    } catch (x) {}
  }
}

module.exports = warning;

}).call(this,require('_process'))

},{"_process":33}],37:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

if (process.env.NODE_ENV !== 'production') {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))

},{"_process":33}],38:[function(require,module,exports){
var jss = require('jss').create();
var jssNested = require('jss-plugin-nested');

function WinnerSpinner(opts) {

  function generateRotation() {
    return Math.round(Math.random() * 4000 + (360 * 5));
  }

  function generateDuration() {
    return Math.round(Math.random() * 3000 + 2000);
  }

  jss.use(jssNested.default());

  var rotation = generateRotation();
  var duration = generateDuration();

  var styles = {
    "pie": {
      "border-radius": "100%",
      "height": '200px',
      "width": '200px',
      "overflow": "hidden",
      "position": "relative"
    },
    "pie__segment": {
      "--a": "-100%",
      "--b": "100%",
      "--degrees": "calc((var(--offset, 0) / 100) * 360)",
      "clip-path": "polygon(var(--a) var(--a), var(--b) var(--a), var(--b) var(--b), var(--a) var(--b))",
      "height": "100%",
      "position": "absolute",
      "transform": "translate(0, -50%) rotate(90deg) rotate(calc(var(--degrees) * 1deg))",
      "transform-origin": "50% 100%",
      "width": "100%",
      "z-index": "calc(1 + var(--over50))",
      "&:after, &:before": {
        "background": "var(--bg)",
        "content": '""',
        "height": "100%",
        "position": "absolute",
        "width": "100%"
      },
      "&:after": {
        "opacity": "var(--over50, 0)"
      },
      "&:before": {
        "--degrees": "calc((var(--value, 45) / 100) * 360)",
        "transform": "translate(0, 100%) rotate(calc(var(--degrees) * 1deg))",
        "transform-origin": "50% 0%"
      }
    },
    "spinning": {
      "animation-name": "spin",
      "animation-duration": duration + "ms",
      "animation-iteration-count": "1",
      "animation-timing-function": "ease-in-out",
      "animation-fill-mode": "forwards"
    },
    "@keyframes spin": {
      "from": {
        "transform": "rotate(0deg)"
      },
      "to": {
        "transform": "rotate(" + rotation +  "deg)"
      }
    }
  }

  var stylesheet = jss.createStyleSheet(styles).attach()

  var pie = document.createElement('div');
  pie.classList.add(stylesheet.classes.pie);
  body = document.getElementsByTagName('body')[0];
  body.appendChild(pie);

  for (var i = opts.segments.length - 1; i >= 0; i--) {
    var segment = opts.segments[i];
    var node = document.createElement('div');
    node.classList.add('pie__segment-0-1-2');
    node.style.cssText = '--offset: ' + (100 / opts.segments.length * i).toFixed(2) + '; --value: ' + (100 / opts.segments.length).toFixed(2) + '; --bg: ' + segment.color + ';'
    pie.appendChild(node);
  }

  pie.classList.add(stylesheet.classes.spinning);

  absRotation = rotation % 360;
  degreesPerSegment = 360 / opts.segments.length
  selectedSegmentIndex = Math.floor(absRotation / degreesPerSegment);

  setTimeout(function(){
    var selectedSegment = opts.segments[(opts.segments.length - 1) - selectedSegmentIndex]
    if (typeof selectedSegment.onSelected === "function") { 
      selectedSegment.onSelected(selectedSegment); 
    }
    else if (typeof opts.onFinish === "function") { 
      opts.onFinish(selectedSegment); 
    }
  }, duration);
}

window.WinnerSpinner = WinnerSpinner;
},{"jss":10,"jss-plugin-nested":3}]},{},[38])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9leHRlbmRzLmpzIiwibm9kZV9tb2R1bGVzL2lzLWluLWJyb3dzZXIvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qc3MtcGx1Z2luLW5lc3RlZC9kaXN0L2pzcy1wbHVnaW4tbmVzdGVkLmNqcy5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL0pzcy5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL1BsdWdpbnNSZWdpc3RyeS5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL1J1bGVMaXN0LmpzIiwibm9kZV9tb2R1bGVzL2pzcy9saWIvU2hlZXRzTWFuYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL1NoZWV0c1JlZ2lzdHJ5LmpzIiwibm9kZV9tb2R1bGVzL2pzcy9saWIvU3R5bGVTaGVldC5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2pzcy9saWIvcGx1Z2lucy9mdW5jdGlvbnMuanMiLCJub2RlX21vZHVsZXMvanNzL2xpYi9wbHVnaW5zL29ic2VydmFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2pzcy9saWIvcGx1Z2lucy9ydWxlcy5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL3JlbmRlcmVycy9Eb21SZW5kZXJlci5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL3JlbmRlcmVycy9WaXJ0dWFsUmVuZGVyZXIuanMiLCJub2RlX21vZHVsZXMvanNzL2xpYi9ydWxlcy9Db25kaXRpb25hbFJ1bGUuanMiLCJub2RlX21vZHVsZXMvanNzL2xpYi9ydWxlcy9Gb250RmFjZVJ1bGUuanMiLCJub2RlX21vZHVsZXMvanNzL2xpYi9ydWxlcy9LZXlmcmFtZXNSdWxlLmpzIiwibm9kZV9tb2R1bGVzL2pzcy9saWIvcnVsZXMvU2ltcGxlUnVsZS5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL3J1bGVzL1N0eWxlUnVsZS5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL3J1bGVzL1ZpZXdwb3J0UnVsZS5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL3NoZWV0cy5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL3V0aWxzL2Nsb25lU3R5bGUuanMiLCJub2RlX21vZHVsZXMvanNzL2xpYi91dGlscy9jcmVhdGVHZW5lcmF0ZUNsYXNzTmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL3V0aWxzL2NyZWF0ZVJ1bGUuanMiLCJub2RlX21vZHVsZXMvanNzL2xpYi91dGlscy9lc2NhcGUuanMiLCJub2RlX21vZHVsZXMvanNzL2xpYi91dGlscy9nZXREeW5hbWljU3R5bGVzLmpzIiwibm9kZV9tb2R1bGVzL2pzcy9saWIvdXRpbHMvaXNPYnNlcnZhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2pzcy9saWIvdXRpbHMvbGlua1J1bGUuanMiLCJub2RlX21vZHVsZXMvanNzL2xpYi91dGlscy9tb2R1bGVJZC5qcyIsIm5vZGVfbW9kdWxlcy9qc3MvbGliL3V0aWxzL3RvQ3NzLmpzIiwibm9kZV9tb2R1bGVzL2pzcy9saWIvdXRpbHMvdG9Dc3NWYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvc3ltYm9sLW9ic2VydmFibGUvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3N5bWJvbC1vYnNlcnZhYmxlL2xpYi9wb255ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy90aW55LXdhcm5pbmcvZGlzdC90aW55LXdhcm5pbmcuY2pzLmpzIiwibm9kZV9tb2R1bGVzL3dhcm5pbmcvYnJvd3Nlci5qcyIsInNyYy9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9PQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9leHRlbmRzOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIGlzQnJvd3NlciA9IGV4cG9ydHMuaXNCcm93c2VyID0gKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZih3aW5kb3cpKSA9PT0gXCJvYmplY3RcIiAmJiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YoZG9jdW1lbnQpKSA9PT0gJ29iamVjdCcgJiYgZG9jdW1lbnQubm9kZVR5cGUgPT09IDk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGlzQnJvd3NlcjsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wRGVmYXVsdCAoZXgpIHsgcmV0dXJuIChleCAmJiAodHlwZW9mIGV4ID09PSAnb2JqZWN0JykgJiYgJ2RlZmF1bHQnIGluIGV4KSA/IGV4WydkZWZhdWx0J10gOiBleDsgfVxuXG52YXIgX2V4dGVuZHMgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgnQGJhYmVsL3J1bnRpbWUvaGVscGVycy9leHRlbmRzJykpO1xudmFyIHdhcm5pbmcgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgndGlueS13YXJuaW5nJykpO1xuXG52YXIgc2VwYXJhdG9yUmVnRXhwID0gL1xccyosXFxzKi9nO1xudmFyIHBhcmVudFJlZ0V4cCA9IC8mL2c7XG52YXIgcmVmUmVnRXhwID0gL1xcJChbXFx3LV0rKS9nO1xuLyoqXG4gKiBDb252ZXJ0IG5lc3RlZCBydWxlcyB0byBzZXBhcmF0ZSwgcmVtb3ZlIHRoZW0gZnJvbSBvcmlnaW5hbCBzdHlsZXMuXG4gKlxuICogQHBhcmFtIHtSdWxlfSBydWxlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGpzc05lc3RlZCgpIHtcbiAgLy8gR2V0IGEgZnVuY3Rpb24gdG8gYmUgdXNlZCBmb3IgJHJlZiByZXBsYWNlbWVudC5cbiAgZnVuY3Rpb24gZ2V0UmVwbGFjZVJlZihjb250YWluZXIsIHNoZWV0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtYXRjaCwga2V5KSB7XG4gICAgICB2YXIgcnVsZSA9IGNvbnRhaW5lci5nZXRSdWxlKGtleSkgfHwgc2hlZXQgJiYgc2hlZXQuZ2V0UnVsZShrZXkpO1xuXG4gICAgICBpZiAocnVsZSkge1xuICAgICAgICBydWxlID0gcnVsZTtcbiAgICAgICAgcmV0dXJuIHJ1bGUuc2VsZWN0b3I7XG4gICAgICB9XG5cbiAgICAgIHdhcm5pbmcoZmFsc2UsIFwiW0pTU10gQ291bGQgbm90IGZpbmQgdGhlIHJlZmVyZW5jZWQgcnVsZSBcIiArIGtleSArIFwiIGluIFwiICsgKGNvbnRhaW5lci5vcHRpb25zLm1ldGEgfHwgY29udGFpbmVyLnRvU3RyaW5nKCkpICsgXCIuXCIpO1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVwbGFjZVBhcmVudFJlZnMobmVzdGVkUHJvcCwgcGFyZW50UHJvcCkge1xuICAgIHZhciBwYXJlbnRTZWxlY3RvcnMgPSBwYXJlbnRQcm9wLnNwbGl0KHNlcGFyYXRvclJlZ0V4cCk7XG4gICAgdmFyIG5lc3RlZFNlbGVjdG9ycyA9IG5lc3RlZFByb3Auc3BsaXQoc2VwYXJhdG9yUmVnRXhwKTtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmVudFNlbGVjdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBhcmVudCA9IHBhcmVudFNlbGVjdG9yc1tpXTtcblxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBuZXN0ZWRTZWxlY3RvcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdmFyIG5lc3RlZCA9IG5lc3RlZFNlbGVjdG9yc1tqXTtcbiAgICAgICAgaWYgKHJlc3VsdCkgcmVzdWx0ICs9ICcsICc7IC8vIFJlcGxhY2UgYWxsICYgYnkgdGhlIHBhcmVudCBvciBwcmVmaXggJiB3aXRoIHRoZSBwYXJlbnQuXG5cbiAgICAgICAgcmVzdWx0ICs9IG5lc3RlZC5pbmRleE9mKCcmJykgIT09IC0xID8gbmVzdGVkLnJlcGxhY2UocGFyZW50UmVnRXhwLCBwYXJlbnQpIDogcGFyZW50ICsgXCIgXCIgKyBuZXN0ZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE9wdGlvbnMocnVsZSwgY29udGFpbmVyLCBvcHRpb25zKSB7XG4gICAgLy8gT3B0aW9ucyBoYXMgYmVlbiBhbHJlYWR5IGNyZWF0ZWQsIG5vdyB3ZSBvbmx5IGluY3JlYXNlIGluZGV4LlxuICAgIGlmIChvcHRpb25zKSByZXR1cm4gX2V4dGVuZHMoe30sIG9wdGlvbnMsIHtcbiAgICAgIGluZGV4OiBvcHRpb25zLmluZGV4ICsgMVxuICAgIH0pO1xuICAgIHZhciBuZXN0aW5nTGV2ZWwgPSBydWxlLm9wdGlvbnMubmVzdGluZ0xldmVsO1xuICAgIG5lc3RpbmdMZXZlbCA9IG5lc3RpbmdMZXZlbCA9PT0gdW5kZWZpbmVkID8gMSA6IG5lc3RpbmdMZXZlbCArIDE7XG4gICAgcmV0dXJuIF9leHRlbmRzKHt9LCBydWxlLm9wdGlvbnMsIHtcbiAgICAgIG5lc3RpbmdMZXZlbDogbmVzdGluZ0xldmVsLFxuICAgICAgaW5kZXg6IGNvbnRhaW5lci5pbmRleE9mKHJ1bGUpICsgMVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25Qcm9jZXNzU3R5bGUoc3R5bGUsIHJ1bGUsIHNoZWV0KSB7XG4gICAgaWYgKHJ1bGUudHlwZSAhPT0gJ3N0eWxlJykgcmV0dXJuIHN0eWxlO1xuICAgIHZhciBzdHlsZVJ1bGUgPSBydWxlO1xuICAgIHZhciBjb250YWluZXIgPSBzdHlsZVJ1bGUub3B0aW9ucy5wYXJlbnQ7XG4gICAgdmFyIG9wdGlvbnM7XG4gICAgdmFyIHJlcGxhY2VSZWY7XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIHN0eWxlKSB7XG4gICAgICB2YXIgaXNOZXN0ZWQgPSBwcm9wLmluZGV4T2YoJyYnKSAhPT0gLTE7XG4gICAgICB2YXIgaXNOZXN0ZWRDb25kaXRpb25hbCA9IHByb3BbMF0gPT09ICdAJztcbiAgICAgIGlmICghaXNOZXN0ZWQgJiYgIWlzTmVzdGVkQ29uZGl0aW9uYWwpIGNvbnRpbnVlO1xuICAgICAgb3B0aW9ucyA9IGdldE9wdGlvbnMoc3R5bGVSdWxlLCBjb250YWluZXIsIG9wdGlvbnMpO1xuXG4gICAgICBpZiAoaXNOZXN0ZWQpIHtcbiAgICAgICAgdmFyIHNlbGVjdG9yID0gcmVwbGFjZVBhcmVudFJlZnMocHJvcCwgc3R5bGVSdWxlLnNlbGVjdG9yKTsgLy8gTGF6aWx5IGNyZWF0ZSB0aGUgcmVmIHJlcGxhY2VyIGZ1bmN0aW9uIGp1c3Qgb25jZSBmb3JcbiAgICAgICAgLy8gYWxsIG5lc3RlZCBydWxlcyB3aXRoaW4gdGhlIHNoZWV0LlxuXG4gICAgICAgIGlmICghcmVwbGFjZVJlZikgcmVwbGFjZVJlZiA9IGdldFJlcGxhY2VSZWYoY29udGFpbmVyLCBzaGVldCk7IC8vIFJlcGxhY2UgYWxsICRyZWZzLlxuXG4gICAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZShyZWZSZWdFeHAsIHJlcGxhY2VSZWYpO1xuICAgICAgICBjb250YWluZXIuYWRkUnVsZShzZWxlY3Rvciwgc3R5bGVbcHJvcF0sIF9leHRlbmRzKHt9LCBvcHRpb25zLCB7XG4gICAgICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yXG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNOZXN0ZWRDb25kaXRpb25hbCkge1xuICAgICAgICAvLyBQbGFjZSBjb25kaXRpb25hbCByaWdodCBhZnRlciB0aGUgcGFyZW50IHJ1bGUgdG8gZW5zdXJlIHJpZ2h0IG9yZGVyaW5nLlxuICAgICAgICBjb250YWluZXIuYWRkUnVsZShwcm9wLCB7fSwgb3B0aW9ucykgLy8gRmxvdyBleHBlY3RzIG1vcmUgb3B0aW9ucyBidXQgdGhleSBhcmVuJ3QgcmVxdWlyZWRcbiAgICAgICAgLy8gQW5kIGZsb3cgZG9lc24ndCBrbm93IHRoaXMgd2lsbCBhbHdheXMgYmUgYSBTdHlsZVJ1bGUgd2hpY2ggaGFzIHRoZSBhZGRSdWxlIG1ldGhvZFxuICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgIC5hZGRSdWxlKHN0eWxlUnVsZS5rZXksIHN0eWxlW3Byb3BdLCB7XG4gICAgICAgICAgc2VsZWN0b3I6IHN0eWxlUnVsZS5zZWxlY3RvclxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZGVsZXRlIHN0eWxlW3Byb3BdO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb25Qcm9jZXNzU3R5bGU6IG9uUHJvY2Vzc1N0eWxlXG4gIH07XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGpzc05lc3RlZDtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX2lzSW5Ccm93c2VyID0gcmVxdWlyZSgnaXMtaW4tYnJvd3NlcicpO1xuXG52YXIgX2lzSW5Ccm93c2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzSW5Ccm93c2VyKTtcblxudmFyIF9TdHlsZVNoZWV0ID0gcmVxdWlyZSgnLi9TdHlsZVNoZWV0Jyk7XG5cbnZhciBfU3R5bGVTaGVldDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TdHlsZVNoZWV0KTtcblxudmFyIF9QbHVnaW5zUmVnaXN0cnkgPSByZXF1aXJlKCcuL1BsdWdpbnNSZWdpc3RyeScpO1xuXG52YXIgX1BsdWdpbnNSZWdpc3RyeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9QbHVnaW5zUmVnaXN0cnkpO1xuXG52YXIgX3J1bGVzID0gcmVxdWlyZSgnLi9wbHVnaW5zL3J1bGVzJyk7XG5cbnZhciBfcnVsZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcnVsZXMpO1xuXG52YXIgX29ic2VydmFibGVzID0gcmVxdWlyZSgnLi9wbHVnaW5zL29ic2VydmFibGVzJyk7XG5cbnZhciBfb2JzZXJ2YWJsZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb2JzZXJ2YWJsZXMpO1xuXG52YXIgX2Z1bmN0aW9ucyA9IHJlcXVpcmUoJy4vcGx1Z2lucy9mdW5jdGlvbnMnKTtcblxudmFyIF9mdW5jdGlvbnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZnVuY3Rpb25zKTtcblxudmFyIF9zaGVldHMgPSByZXF1aXJlKCcuL3NoZWV0cycpO1xuXG52YXIgX3NoZWV0czIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zaGVldHMpO1xuXG52YXIgX1N0eWxlUnVsZSA9IHJlcXVpcmUoJy4vcnVsZXMvU3R5bGVSdWxlJyk7XG5cbnZhciBfU3R5bGVSdWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1N0eWxlUnVsZSk7XG5cbnZhciBfY3JlYXRlR2VuZXJhdGVDbGFzc05hbWUgPSByZXF1aXJlKCcuL3V0aWxzL2NyZWF0ZUdlbmVyYXRlQ2xhc3NOYW1lJyk7XG5cbnZhciBfY3JlYXRlR2VuZXJhdGVDbGFzc05hbWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlR2VuZXJhdGVDbGFzc05hbWUpO1xuXG52YXIgX2NyZWF0ZVJ1bGUyID0gcmVxdWlyZSgnLi91dGlscy9jcmVhdGVSdWxlJyk7XG5cbnZhciBfY3JlYXRlUnVsZTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVSdWxlMik7XG5cbnZhciBfRG9tUmVuZGVyZXIgPSByZXF1aXJlKCcuL3JlbmRlcmVycy9Eb21SZW5kZXJlcicpO1xuXG52YXIgX0RvbVJlbmRlcmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0RvbVJlbmRlcmVyKTtcblxudmFyIF9WaXJ0dWFsUmVuZGVyZXIgPSByZXF1aXJlKCcuL3JlbmRlcmVycy9WaXJ0dWFsUmVuZGVyZXInKTtcblxudmFyIF9WaXJ0dWFsUmVuZGVyZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVmlydHVhbFJlbmRlcmVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgZGVmYXVsdFBsdWdpbnMgPSBfcnVsZXMyWydkZWZhdWx0J10uY29uY2F0KFtfb2JzZXJ2YWJsZXMyWydkZWZhdWx0J10sIF9mdW5jdGlvbnMyWydkZWZhdWx0J11dKTtcblxudmFyIGluc3RhbmNlQ291bnRlciA9IDA7XG5cbnZhciBKc3MgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEpzcyhvcHRpb25zKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEpzcyk7XG5cbiAgICB0aGlzLmlkID0gaW5zdGFuY2VDb3VudGVyKys7XG4gICAgdGhpcy52ZXJzaW9uID0gXCI5LjguN1wiO1xuICAgIHRoaXMucGx1Z2lucyA9IG5ldyBfUGx1Z2luc1JlZ2lzdHJ5MlsnZGVmYXVsdCddKCk7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgY3JlYXRlR2VuZXJhdGVDbGFzc05hbWU6IF9jcmVhdGVHZW5lcmF0ZUNsYXNzTmFtZTJbJ2RlZmF1bHQnXSxcbiAgICAgIFJlbmRlcmVyOiBfaXNJbkJyb3dzZXIyWydkZWZhdWx0J10gPyBfRG9tUmVuZGVyZXIyWydkZWZhdWx0J10gOiBfVmlydHVhbFJlbmRlcmVyMlsnZGVmYXVsdCddLFxuICAgICAgcGx1Z2luczogW11cbiAgICB9O1xuICAgIHRoaXMuZ2VuZXJhdGVDbGFzc05hbWUgPSAoMCwgX2NyZWF0ZUdlbmVyYXRlQ2xhc3NOYW1lMlsnZGVmYXVsdCddKSgpO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1zcHJlYWRcbiAgICB0aGlzLnVzZS5hcHBseSh0aGlzLCBkZWZhdWx0UGx1Z2lucyk7XG4gICAgdGhpcy5zZXR1cChvcHRpb25zKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhKc3MsIFt7XG4gICAga2V5OiAnc2V0dXAnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgICAgaWYgKG9wdGlvbnMuY3JlYXRlR2VuZXJhdGVDbGFzc05hbWUpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmNyZWF0ZUdlbmVyYXRlQ2xhc3NOYW1lID0gb3B0aW9ucy5jcmVhdGVHZW5lcmF0ZUNsYXNzTmFtZTtcbiAgICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgICB0aGlzLmdlbmVyYXRlQ2xhc3NOYW1lID0gb3B0aW9ucy5jcmVhdGVHZW5lcmF0ZUNsYXNzTmFtZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5pbnNlcnRpb25Qb2ludCAhPSBudWxsKSB0aGlzLm9wdGlvbnMuaW5zZXJ0aW9uUG9pbnQgPSBvcHRpb25zLmluc2VydGlvblBvaW50O1xuICAgICAgaWYgKG9wdGlvbnMudmlydHVhbCB8fCBvcHRpb25zLlJlbmRlcmVyKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5SZW5kZXJlciA9IG9wdGlvbnMuUmVuZGVyZXIgfHwgKG9wdGlvbnMudmlydHVhbCA/IF9WaXJ0dWFsUmVuZGVyZXIyWydkZWZhdWx0J10gOiBfRG9tUmVuZGVyZXIyWydkZWZhdWx0J10pO1xuICAgICAgfVxuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLXNwcmVhZFxuICAgICAgaWYgKG9wdGlvbnMucGx1Z2lucykgdGhpcy51c2UuYXBwbHkodGhpcywgb3B0aW9ucy5wbHVnaW5zKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgU3R5bGUgU2hlZXQuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2NyZWF0ZVN0eWxlU2hlZXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVTdHlsZVNoZWV0KHN0eWxlcykge1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgICB2YXIgaW5kZXggPSBvcHRpb25zLmluZGV4O1xuICAgICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgaW5kZXggPSBfc2hlZXRzMlsnZGVmYXVsdCddLmluZGV4ID09PSAwID8gMCA6IF9zaGVldHMyWydkZWZhdWx0J10uaW5kZXggKyAxO1xuICAgICAgfVxuICAgICAgdmFyIHNoZWV0ID0gbmV3IF9TdHlsZVNoZWV0MlsnZGVmYXVsdCddKHN0eWxlcywgX2V4dGVuZHMoe30sIG9wdGlvbnMsIHtcbiAgICAgICAganNzOiB0aGlzLFxuICAgICAgICBnZW5lcmF0ZUNsYXNzTmFtZTogb3B0aW9ucy5nZW5lcmF0ZUNsYXNzTmFtZSB8fCB0aGlzLmdlbmVyYXRlQ2xhc3NOYW1lLFxuICAgICAgICBpbnNlcnRpb25Qb2ludDogdGhpcy5vcHRpb25zLmluc2VydGlvblBvaW50LFxuICAgICAgICBSZW5kZXJlcjogdGhpcy5vcHRpb25zLlJlbmRlcmVyLFxuICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMucGx1Z2lucy5vblByb2Nlc3NTaGVldChzaGVldCk7XG5cbiAgICAgIHJldHVybiBzaGVldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXRhY2ggdGhlIFN0eWxlIFNoZWV0IGFuZCByZW1vdmUgaXQgZnJvbSB0aGUgcmVnaXN0cnkuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3JlbW92ZVN0eWxlU2hlZXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVTdHlsZVNoZWV0KHNoZWV0KSB7XG4gICAgICBzaGVldC5kZXRhY2goKTtcbiAgICAgIF9zaGVldHMyWydkZWZhdWx0J10ucmVtb3ZlKHNoZWV0KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHJ1bGUgd2l0aG91dCBhIFN0eWxlIFNoZWV0LlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdjcmVhdGVSdWxlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlUnVsZShuYW1lKSB7XG4gICAgICB2YXIgc3R5bGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG4gICAgICAvLyBFbmFibGUgcnVsZSB3aXRob3V0IG5hbWUgZm9yIGlubGluZSBzdHlsZXMuXG4gICAgICBpZiAoKHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihuYW1lKSkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG9wdGlvbnMgPSBzdHlsZTtcbiAgICAgICAgc3R5bGUgPSBuYW1lO1xuICAgICAgICBuYW1lID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICAvLyBDYXN0IGZyb20gUnVsZUZhY3RvcnlPcHRpb25zIHRvIFJ1bGVPcHRpb25zXG4gICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80MTMyODcyOC9mb3JjZS1jYXN0aW5nLWluLWZsb3dcbiAgICAgIHZhciBydWxlT3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICAgIHJ1bGVPcHRpb25zLmpzcyA9IHRoaXM7XG4gICAgICBydWxlT3B0aW9ucy5SZW5kZXJlciA9IHRoaXMub3B0aW9ucy5SZW5kZXJlcjtcbiAgICAgIGlmICghcnVsZU9wdGlvbnMuZ2VuZXJhdGVDbGFzc05hbWUpIHJ1bGVPcHRpb25zLmdlbmVyYXRlQ2xhc3NOYW1lID0gdGhpcy5nZW5lcmF0ZUNsYXNzTmFtZTtcbiAgICAgIGlmICghcnVsZU9wdGlvbnMuY2xhc3NlcykgcnVsZU9wdGlvbnMuY2xhc3NlcyA9IHt9O1xuICAgICAgdmFyIHJ1bGUgPSAoMCwgX2NyZWF0ZVJ1bGUzWydkZWZhdWx0J10pKG5hbWUsIHN0eWxlLCBydWxlT3B0aW9ucyk7XG5cbiAgICAgIGlmICghcnVsZU9wdGlvbnMuc2VsZWN0b3IgJiYgcnVsZSBpbnN0YW5jZW9mIF9TdHlsZVJ1bGUyWydkZWZhdWx0J10pIHtcbiAgICAgICAgcnVsZS5zZWxlY3RvciA9ICcuJyArIHJ1bGVPcHRpb25zLmdlbmVyYXRlQ2xhc3NOYW1lKHJ1bGUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBsdWdpbnMub25Qcm9jZXNzUnVsZShydWxlKTtcblxuICAgICAgcmV0dXJuIHJ1bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgcGx1Z2luLiBQYXNzZWQgZnVuY3Rpb24gd2lsbCBiZSBpbnZva2VkIHdpdGggYSBydWxlIGluc3RhbmNlLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd1c2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1c2UoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgcGx1Z2lucyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBwbHVnaW5zW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgICAvLyBBdm9pZHMgYXBwbHlpbmcgc2FtZSBwbHVnaW4gdHdpY2UsIGF0IGxlYXN0IGJhc2VkIG9uIHJlZi5cbiAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMucGx1Z2lucy5pbmRleE9mKHBsdWdpbikgPT09IC0xKSB7XG4gICAgICAgICAgX3RoaXMub3B0aW9ucy5wbHVnaW5zLnB1c2gocGx1Z2luKTtcbiAgICAgICAgICBfdGhpcy5wbHVnaW5zLnVzZShwbHVnaW4pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEpzcztcbn0oKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gSnNzOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF93YXJuaW5nID0gcmVxdWlyZSgnd2FybmluZycpO1xuXG52YXIgX3dhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2FybmluZyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFBsdWdpbnNSZWdpc3RyeSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUGx1Z2luc1JlZ2lzdHJ5KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQbHVnaW5zUmVnaXN0cnkpO1xuXG4gICAgdGhpcy5ob29rcyA9IHtcbiAgICAgIG9uQ3JlYXRlUnVsZTogW10sXG4gICAgICBvblByb2Nlc3NSdWxlOiBbXSxcbiAgICAgIG9uUHJvY2Vzc1N0eWxlOiBbXSxcbiAgICAgIG9uUHJvY2Vzc1NoZWV0OiBbXSxcbiAgICAgIG9uQ2hhbmdlVmFsdWU6IFtdLFxuICAgICAgb25VcGRhdGU6IFtdXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsbCBgb25DcmVhdGVSdWxlYCBob29rcyBhbmQgcmV0dXJuIGFuIG9iamVjdCBpZiByZXR1cm5lZCBieSBhIGhvb2suXG4gICAgICAgKi9cbiAgICB9O1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFBsdWdpbnNSZWdpc3RyeSwgW3tcbiAgICBrZXk6ICdvbkNyZWF0ZVJ1bGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNyZWF0ZVJ1bGUobmFtZSwgZGVjbCwgb3B0aW9ucykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmhvb2tzLm9uQ3JlYXRlUnVsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcnVsZSA9IHRoaXMuaG9va3Mub25DcmVhdGVSdWxlW2ldKG5hbWUsIGRlY2wsIG9wdGlvbnMpO1xuICAgICAgICBpZiAocnVsZSkgcmV0dXJuIHJ1bGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsIGBvblByb2Nlc3NSdWxlYCBob29rcy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnb25Qcm9jZXNzUnVsZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uUHJvY2Vzc1J1bGUocnVsZSkge1xuICAgICAgaWYgKHJ1bGUuaXNQcm9jZXNzZWQpIHJldHVybjtcbiAgICAgIHZhciBzaGVldCA9IHJ1bGUub3B0aW9ucy5zaGVldDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmhvb2tzLm9uUHJvY2Vzc1J1bGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5ob29rcy5vblByb2Nlc3NSdWxlW2ldKHJ1bGUsIHNoZWV0KTtcbiAgICAgIH1cblxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgaWYgKHJ1bGUuc3R5bGUpIHRoaXMub25Qcm9jZXNzU3R5bGUocnVsZS5zdHlsZSwgcnVsZSwgc2hlZXQpO1xuXG4gICAgICBydWxlLmlzUHJvY2Vzc2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsIGBvblByb2Nlc3NTdHlsZWAgaG9va3MuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ29uUHJvY2Vzc1N0eWxlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25Qcm9jZXNzU3R5bGUoc3R5bGUsIHJ1bGUsIHNoZWV0KSB7XG4gICAgICB2YXIgbmV4dFN0eWxlID0gc3R5bGU7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ob29rcy5vblByb2Nlc3NTdHlsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBuZXh0U3R5bGUgPSB0aGlzLmhvb2tzLm9uUHJvY2Vzc1N0eWxlW2ldKG5leHRTdHlsZSwgcnVsZSwgc2hlZXQpO1xuICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgIHJ1bGUuc3R5bGUgPSBuZXh0U3R5bGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbCBgb25Qcm9jZXNzU2hlZXRgIGhvb2tzLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdvblByb2Nlc3NTaGVldCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uUHJvY2Vzc1NoZWV0KHNoZWV0KSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaG9va3Mub25Qcm9jZXNzU2hlZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5ob29rcy5vblByb2Nlc3NTaGVldFtpXShzaGVldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbCBgb25VcGRhdGVgIGhvb2tzLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdvblVwZGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uVXBkYXRlKGRhdGEsIHJ1bGUsIHNoZWV0KSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaG9va3Mub25VcGRhdGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5ob29rcy5vblVwZGF0ZVtpXShkYXRhLCBydWxlLCBzaGVldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbCBgb25DaGFuZ2VWYWx1ZWAgaG9va3MuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ29uQ2hhbmdlVmFsdWUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNoYW5nZVZhbHVlKHZhbHVlLCBwcm9wLCBydWxlKSB7XG4gICAgICB2YXIgcHJvY2Vzc2VkVmFsdWUgPSB2YWx1ZTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ob29rcy5vbkNoYW5nZVZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHByb2Nlc3NlZFZhbHVlID0gdGhpcy5ob29rcy5vbkNoYW5nZVZhbHVlW2ldKHByb2Nlc3NlZFZhbHVlLCBwcm9wLCBydWxlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9jZXNzZWRWYWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBhIHBsdWdpbi5cbiAgICAgKiBJZiBmdW5jdGlvbiBpcyBwYXNzZWQsIGl0IGlzIGEgc2hvcnRjdXQgZm9yIGB7b25Qcm9jZXNzUnVsZX1gLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd1c2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1c2UocGx1Z2luKSB7XG4gICAgICBmb3IgKHZhciBuYW1lIGluIHBsdWdpbikge1xuICAgICAgICBpZiAodGhpcy5ob29rc1tuYW1lXSkgdGhpcy5ob29rc1tuYW1lXS5wdXNoKHBsdWdpbltuYW1lXSk7ZWxzZSAoMCwgX3dhcm5pbmcyWydkZWZhdWx0J10pKGZhbHNlLCAnW0pTU10gVW5rbm93biBob29rIFwiJXNcIi4nLCBuYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gUGx1Z2luc1JlZ2lzdHJ5O1xufSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBQbHVnaW5zUmVnaXN0cnk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX2NyZWF0ZVJ1bGUgPSByZXF1aXJlKCcuL3V0aWxzL2NyZWF0ZVJ1bGUnKTtcblxudmFyIF9jcmVhdGVSdWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZVJ1bGUpO1xuXG52YXIgX2xpbmtSdWxlID0gcmVxdWlyZSgnLi91dGlscy9saW5rUnVsZScpO1xuXG52YXIgX2xpbmtSdWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xpbmtSdWxlKTtcblxudmFyIF9TdHlsZVJ1bGUgPSByZXF1aXJlKCcuL3J1bGVzL1N0eWxlUnVsZScpO1xuXG52YXIgX1N0eWxlUnVsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TdHlsZVJ1bGUpO1xuXG52YXIgX2VzY2FwZSA9IHJlcXVpcmUoJy4vdXRpbHMvZXNjYXBlJyk7XG5cbnZhciBfZXNjYXBlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VzY2FwZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXG4gKiBDb250YWlucyBydWxlcyBvYmplY3RzIGFuZCBhbGxvd3MgYWRkaW5nL3JlbW92aW5nIGV0Yy5cbiAqIElzIHVzZWQgZm9yIGUuZy4gYnkgYFN0eWxlU2hlZXRgIG9yIGBDb25kaXRpb25hbFJ1bGVgLlxuICovXG52YXIgUnVsZUxpc3QgPSBmdW5jdGlvbiAoKSB7XG5cbiAgLy8gT3JpZ2luYWwgc3R5bGVzIG9iamVjdC5cbiAgZnVuY3Rpb24gUnVsZUxpc3Qob3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUnVsZUxpc3QpO1xuXG4gICAgdGhpcy5tYXAgPSB7fTtcbiAgICB0aGlzLnJhdyA9IHt9O1xuICAgIHRoaXMuaW5kZXggPSBbXTtcblxuICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKG5hbWUsIGRhdGEpIHtcbiAgICAgIHZhciBfb3B0aW9ucyA9IF90aGlzLm9wdGlvbnMsXG4gICAgICAgICAgcGx1Z2lucyA9IF9vcHRpb25zLmpzcy5wbHVnaW5zLFxuICAgICAgICAgIHNoZWV0ID0gX29wdGlvbnMuc2hlZXQ7XG5cbiAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcGx1Z2lucy5vblVwZGF0ZShkYXRhLCBfdGhpcy5nZXQobmFtZSksIHNoZWV0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBfdGhpcy5pbmRleC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBwbHVnaW5zLm9uVXBkYXRlKG5hbWUsIF90aGlzLmluZGV4W2luZGV4XSwgc2hlZXQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5jbGFzc2VzID0gb3B0aW9ucy5jbGFzc2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbmQgcmVnaXN0ZXIgcnVsZS5cbiAgICpcbiAgICogV2lsbCBub3QgcmVuZGVyIGFmdGVyIFN0eWxlIFNoZWV0IHdhcyByZW5kZXJlZCB0aGUgZmlyc3QgdGltZS5cbiAgICovXG5cblxuICAvLyBVc2VkIHRvIGVuc3VyZSBjb3JyZWN0IHJ1bGVzIG9yZGVyLlxuXG4gIC8vIFJ1bGVzIHJlZ2lzdHJ5IGZvciBhY2Nlc3MgYnkgLmdldCgpIG1ldGhvZC5cbiAgLy8gSXQgY29udGFpbnMgdGhlIHNhbWUgcnVsZSByZWdpc3RlcmVkIGJ5IG5hbWUgYW5kIGJ5IHNlbGVjdG9yLlxuXG5cbiAgX2NyZWF0ZUNsYXNzKFJ1bGVMaXN0LCBbe1xuICAgIGtleTogJ2FkZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChuYW1lLCBkZWNsLCBvcHRpb25zKSB7XG4gICAgICB2YXIgX29wdGlvbnMyID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIHBhcmVudCA9IF9vcHRpb25zMi5wYXJlbnQsXG4gICAgICAgICAgc2hlZXQgPSBfb3B0aW9uczIuc2hlZXQsXG4gICAgICAgICAganNzID0gX29wdGlvbnMyLmpzcyxcbiAgICAgICAgICBSZW5kZXJlciA9IF9vcHRpb25zMi5SZW5kZXJlcixcbiAgICAgICAgICBnZW5lcmF0ZUNsYXNzTmFtZSA9IF9vcHRpb25zMi5nZW5lcmF0ZUNsYXNzTmFtZTtcblxuXG4gICAgICBvcHRpb25zID0gX2V4dGVuZHMoe1xuICAgICAgICBjbGFzc2VzOiB0aGlzLmNsYXNzZXMsXG4gICAgICAgIHBhcmVudDogcGFyZW50LFxuICAgICAgICBzaGVldDogc2hlZXQsXG4gICAgICAgIGpzczoganNzLFxuICAgICAgICBSZW5kZXJlcjogUmVuZGVyZXIsXG4gICAgICAgIGdlbmVyYXRlQ2xhc3NOYW1lOiBnZW5lcmF0ZUNsYXNzTmFtZVxuICAgICAgfSwgb3B0aW9ucyk7XG5cbiAgICAgIGlmICghb3B0aW9ucy5zZWxlY3RvciAmJiB0aGlzLmNsYXNzZXNbbmFtZV0pIHtcbiAgICAgICAgb3B0aW9ucy5zZWxlY3RvciA9ICcuJyArICgwLCBfZXNjYXBlMlsnZGVmYXVsdCddKSh0aGlzLmNsYXNzZXNbbmFtZV0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJhd1tuYW1lXSA9IGRlY2w7XG5cbiAgICAgIHZhciBydWxlID0gKDAsIF9jcmVhdGVSdWxlMlsnZGVmYXVsdCddKShuYW1lLCBkZWNsLCBvcHRpb25zKTtcblxuICAgICAgdmFyIGNsYXNzTmFtZSA9IHZvaWQgMDtcblxuICAgICAgaWYgKCFvcHRpb25zLnNlbGVjdG9yICYmIHJ1bGUgaW5zdGFuY2VvZiBfU3R5bGVSdWxlMlsnZGVmYXVsdCddKSB7XG4gICAgICAgIGNsYXNzTmFtZSA9IGdlbmVyYXRlQ2xhc3NOYW1lKHJ1bGUsIHNoZWV0KTtcbiAgICAgICAgcnVsZS5zZWxlY3RvciA9ICcuJyArICgwLCBfZXNjYXBlMlsnZGVmYXVsdCddKShjbGFzc05hbWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlZ2lzdGVyKHJ1bGUsIGNsYXNzTmFtZSk7XG5cbiAgICAgIHZhciBpbmRleCA9IG9wdGlvbnMuaW5kZXggPT09IHVuZGVmaW5lZCA/IHRoaXMuaW5kZXgubGVuZ3RoIDogb3B0aW9ucy5pbmRleDtcbiAgICAgIHRoaXMuaW5kZXguc3BsaWNlKGluZGV4LCAwLCBydWxlKTtcblxuICAgICAgcmV0dXJuIHJ1bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgcnVsZS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZ2V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcFtuYW1lXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGUgYSBydWxlLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdyZW1vdmUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUocnVsZSkge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyKHJ1bGUpO1xuICAgICAgdGhpcy5pbmRleC5zcGxpY2UodGhpcy5pbmRleE9mKHJ1bGUpLCAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgaW5kZXggb2YgYSBydWxlLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdpbmRleE9mJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5kZXhPZihydWxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleC5pbmRleE9mKHJ1bGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biBgb25Qcm9jZXNzUnVsZSgpYCBwbHVnaW5zIG9uIGV2ZXJ5IHJ1bGUuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3Byb2Nlc3MnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcm9jZXNzKCkge1xuICAgICAgdmFyIHBsdWdpbnMgPSB0aGlzLm9wdGlvbnMuanNzLnBsdWdpbnM7XG4gICAgICAvLyBXZSBuZWVkIHRvIGNsb25lIGFycmF5IGJlY2F1c2UgaWYgd2UgbW9kaWZ5IHRoZSBpbmRleCBzb21ld2hlcmUgZWxzZSBkdXJpbmcgYSBsb29wXG4gICAgICAvLyB3ZSBlbmQgdXAgd2l0aCB2ZXJ5IGhhcmQtdG8tdHJhY2stZG93biBzaWRlIGVmZmVjdHMuXG5cbiAgICAgIHRoaXMuaW5kZXguc2xpY2UoMCkuZm9yRWFjaChwbHVnaW5zLm9uUHJvY2Vzc1J1bGUsIHBsdWdpbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGEgcnVsZSBpbiBgLm1hcGAgYW5kIGAuY2xhc3Nlc2AgbWFwcy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAncmVnaXN0ZXInLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWdpc3RlcihydWxlLCBjbGFzc05hbWUpIHtcbiAgICAgIHRoaXMubWFwW3J1bGUua2V5XSA9IHJ1bGU7XG4gICAgICBpZiAocnVsZSBpbnN0YW5jZW9mIF9TdHlsZVJ1bGUyWydkZWZhdWx0J10pIHtcbiAgICAgICAgdGhpcy5tYXBbcnVsZS5zZWxlY3Rvcl0gPSBydWxlO1xuICAgICAgICBpZiAoY2xhc3NOYW1lKSB0aGlzLmNsYXNzZXNbcnVsZS5rZXldID0gY2xhc3NOYW1lO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVucmVnaXN0ZXIgYSBydWxlLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd1bnJlZ2lzdGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdW5yZWdpc3RlcihydWxlKSB7XG4gICAgICBkZWxldGUgdGhpcy5tYXBbcnVsZS5rZXldO1xuICAgICAgaWYgKHJ1bGUgaW5zdGFuY2VvZiBfU3R5bGVSdWxlMlsnZGVmYXVsdCddKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLm1hcFtydWxlLnNlbGVjdG9yXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuY2xhc3Nlc1tydWxlLmtleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBmdW5jdGlvbiB2YWx1ZXMgd2l0aCBhIG5ldyBkYXRhLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdsaW5rJyxcblxuXG4gICAgLyoqXG4gICAgICogTGluayByZW5kZXJhYmxlIHJ1bGVzIHdpdGggQ1NTUnVsZUxpc3QuXG4gICAgICovXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxpbmsoY3NzUnVsZXMpIHtcbiAgICAgIHZhciBtYXAgPSB0aGlzLm9wdGlvbnMuc2hlZXQucmVuZGVyZXIuZ2V0VW5lc2NhcGVkS2V5c01hcCh0aGlzLmluZGV4KTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjc3NSdWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY3NzUnVsZSA9IGNzc1J1bGVzW2ldO1xuICAgICAgICB2YXIgX2tleSA9IHRoaXMub3B0aW9ucy5zaGVldC5yZW5kZXJlci5nZXRLZXkoY3NzUnVsZSk7XG4gICAgICAgIGlmIChtYXBbX2tleV0pIF9rZXkgPSBtYXBbX2tleV07XG4gICAgICAgIHZhciBydWxlID0gdGhpcy5tYXBbX2tleV07XG4gICAgICAgIGlmIChydWxlKSAoMCwgX2xpbmtSdWxlMlsnZGVmYXVsdCddKShydWxlLCBjc3NSdWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IHJ1bGVzIHRvIGEgQ1NTIHN0cmluZy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAndG9TdHJpbmcnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1N0cmluZyhvcHRpb25zKSB7XG4gICAgICB2YXIgc3RyID0gJyc7XG4gICAgICB2YXIgc2hlZXQgPSB0aGlzLm9wdGlvbnMuc2hlZXQ7XG5cbiAgICAgIHZhciBsaW5rID0gc2hlZXQgPyBzaGVldC5vcHRpb25zLmxpbmsgOiBmYWxzZTtcblxuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuaW5kZXgubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBydWxlID0gdGhpcy5pbmRleFtpbmRleF07XG4gICAgICAgIHZhciBjc3MgPSBydWxlLnRvU3RyaW5nKG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIE5vIG5lZWQgdG8gcmVuZGVyIGFuIGVtcHR5IHJ1bGUuXG4gICAgICAgIGlmICghY3NzICYmICFsaW5rKSBjb250aW51ZTtcblxuICAgICAgICBpZiAoc3RyKSBzdHIgKz0gJ1xcbic7XG4gICAgICAgIHN0ciArPSBjc3M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJ1bGVMaXN0O1xufSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBSdWxlTGlzdDsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJ3dhcm5pbmcnKTtcblxudmFyIF93YXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dhcm5pbmcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxuICogU2hlZXRzTWFuYWdlciBpcyBsaWtlIGEgV2Vha01hcCB3aGljaCBpcyBkZXNpZ25lZCB0byBjb3VudCBTdHlsZVNoZWV0XG4gKiBpbnN0YW5jZXMgYW5kIGF0dGFjaC9kZXRhY2ggYXV0b21hdGljYWxseS5cbiAqL1xudmFyIFNoZWV0c01hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNoZWV0c01hbmFnZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNoZWV0c01hbmFnZXIpO1xuXG4gICAgdGhpcy5zaGVldHMgPSBbXTtcbiAgICB0aGlzLnJlZnMgPSBbXTtcbiAgICB0aGlzLmtleXMgPSBbXTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTaGVldHNNYW5hZ2VyLCBbe1xuICAgIGtleTogJ2dldCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldChrZXkpIHtcbiAgICAgIHZhciBpbmRleCA9IHRoaXMua2V5cy5pbmRleE9mKGtleSk7XG4gICAgICByZXR1cm4gdGhpcy5zaGVldHNbaW5kZXhdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2FkZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChrZXksIHNoZWV0KSB7XG4gICAgICB2YXIgc2hlZXRzID0gdGhpcy5zaGVldHMsXG4gICAgICAgICAgcmVmcyA9IHRoaXMucmVmcyxcbiAgICAgICAgICBrZXlzID0gdGhpcy5rZXlzO1xuXG4gICAgICB2YXIgaW5kZXggPSBzaGVldHMuaW5kZXhPZihzaGVldCk7XG5cbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHJldHVybiBpbmRleDtcblxuICAgICAgc2hlZXRzLnB1c2goc2hlZXQpO1xuICAgICAgcmVmcy5wdXNoKDApO1xuICAgICAga2V5cy5wdXNoKGtleSk7XG5cbiAgICAgIHJldHVybiBzaGVldHMubGVuZ3RoIC0gMTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdtYW5hZ2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYW5hZ2Uoa2V5KSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLmtleXMuaW5kZXhPZihrZXkpO1xuICAgICAgdmFyIHNoZWV0ID0gdGhpcy5zaGVldHNbaW5kZXhdO1xuICAgICAgaWYgKHRoaXMucmVmc1tpbmRleF0gPT09IDApIHNoZWV0LmF0dGFjaCgpO1xuICAgICAgdGhpcy5yZWZzW2luZGV4XSsrO1xuICAgICAgaWYgKCF0aGlzLmtleXNbaW5kZXhdKSB0aGlzLmtleXMuc3BsaWNlKGluZGV4LCAwLCBrZXkpO1xuICAgICAgcmV0dXJuIHNoZWV0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3VubWFuYWdlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdW5tYW5hZ2Uoa2V5KSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLmtleXMuaW5kZXhPZihrZXkpO1xuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAvLyBlc2xpbnQtaWdub3JlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICgwLCBfd2FybmluZzJbJ2RlZmF1bHQnXSkoZmFsc2UsIFwiU2hlZXRzTWFuYWdlcjogY2FuJ3QgZmluZCBzaGVldCB0byB1bm1hbmFnZVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucmVmc1tpbmRleF0gPiAwKSB7XG4gICAgICAgIHRoaXMucmVmc1tpbmRleF0tLTtcbiAgICAgICAgaWYgKHRoaXMucmVmc1tpbmRleF0gPT09IDApIHRoaXMuc2hlZXRzW2luZGV4XS5kZXRhY2goKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzaXplJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmtleXMubGVuZ3RoO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTaGVldHNNYW5hZ2VyO1xufSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBTaGVldHNNYW5hZ2VyOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXG4gKiBTaGVldHMgcmVnaXN0cnkgdG8gYWNjZXNzIHRoZW0gYWxsIGF0IG9uZSBwbGFjZS5cbiAqL1xudmFyIFNoZWV0c1JlZ2lzdHJ5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTaGVldHNSZWdpc3RyeSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2hlZXRzUmVnaXN0cnkpO1xuXG4gICAgdGhpcy5yZWdpc3RyeSA9IFtdO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNoZWV0c1JlZ2lzdHJ5LCBbe1xuICAgIGtleTogJ2FkZCcsXG5cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGEgU3R5bGUgU2hlZXQuXG4gICAgICovXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChzaGVldCkge1xuICAgICAgdmFyIHJlZ2lzdHJ5ID0gdGhpcy5yZWdpc3RyeTtcbiAgICAgIHZhciBpbmRleCA9IHNoZWV0Lm9wdGlvbnMuaW5kZXg7XG5cblxuICAgICAgaWYgKHJlZ2lzdHJ5LmluZGV4T2Yoc2hlZXQpICE9PSAtMSkgcmV0dXJuO1xuXG4gICAgICBpZiAocmVnaXN0cnkubGVuZ3RoID09PSAwIHx8IGluZGV4ID49IHRoaXMuaW5kZXgpIHtcbiAgICAgICAgcmVnaXN0cnkucHVzaChzaGVldCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gRmluZCBhIHBvc2l0aW9uLlxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RyeS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocmVnaXN0cnlbaV0ub3B0aW9ucy5pbmRleCA+IGluZGV4KSB7XG4gICAgICAgICAgcmVnaXN0cnkuc3BsaWNlKGksIDAsIHNoZWV0KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgcmVnaXN0cnkuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3Jlc2V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5ID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgU3R5bGUgU2hlZXQuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3JlbW92ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShzaGVldCkge1xuICAgICAgdmFyIGluZGV4ID0gdGhpcy5yZWdpc3RyeS5pbmRleE9mKHNoZWV0KTtcbiAgICAgIHRoaXMucmVnaXN0cnkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IGFsbCBhdHRhY2hlZCBzaGVldHMgdG8gYSBDU1Mgc3RyaW5nLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd0b1N0cmluZycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZ2lzdHJ5LmZpbHRlcihmdW5jdGlvbiAoc2hlZXQpIHtcbiAgICAgICAgcmV0dXJuIHNoZWV0LmF0dGFjaGVkO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uIChzaGVldCkge1xuICAgICAgICByZXR1cm4gc2hlZXQudG9TdHJpbmcob3B0aW9ucyk7XG4gICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdpbmRleCcsXG5cblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgaGlnaGVzdCBpbmRleCBudW1iZXIuXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWdpc3RyeS5sZW5ndGggPT09IDAgPyAwIDogdGhpcy5yZWdpc3RyeVt0aGlzLnJlZ2lzdHJ5Lmxlbmd0aCAtIDFdLm9wdGlvbnMuaW5kZXg7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNoZWV0c1JlZ2lzdHJ5O1xufSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBTaGVldHNSZWdpc3RyeTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfbGlua1J1bGUgPSByZXF1aXJlKCcuL3V0aWxzL2xpbmtSdWxlJyk7XG5cbnZhciBfbGlua1J1bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGlua1J1bGUpO1xuXG52YXIgX1J1bGVMaXN0ID0gcmVxdWlyZSgnLi9SdWxlTGlzdCcpO1xuXG52YXIgX1J1bGVMaXN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1J1bGVMaXN0KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmUgKi9cbnZhciBTdHlsZVNoZWV0ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTdHlsZVNoZWV0KHN0eWxlcywgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU3R5bGVTaGVldCk7XG5cbiAgICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uIChuYW1lLCBkYXRhKSB7XG4gICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIF90aGlzLnJ1bGVzLnVwZGF0ZShuYW1lLCBkYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLnJ1bGVzLnVwZGF0ZShuYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfdGhpcztcbiAgICB9O1xuXG4gICAgdGhpcy5hdHRhY2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuZGVwbG95ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmxpbmtlZCA9IGZhbHNlO1xuICAgIHRoaXMuY2xhc3NlcyA9IHt9O1xuICAgIHRoaXMub3B0aW9ucyA9IF9leHRlbmRzKHt9LCBvcHRpb25zLCB7XG4gICAgICBzaGVldDogdGhpcyxcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIGNsYXNzZXM6IHRoaXMuY2xhc3Nlc1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgb3B0aW9ucy5SZW5kZXJlcih0aGlzKTtcbiAgICB0aGlzLnJ1bGVzID0gbmV3IF9SdWxlTGlzdDJbJ2RlZmF1bHQnXSh0aGlzLm9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgX25hbWUgaW4gc3R5bGVzKSB7XG4gICAgICB0aGlzLnJ1bGVzLmFkZChfbmFtZSwgc3R5bGVzW19uYW1lXSk7XG4gICAgfVxuXG4gICAgdGhpcy5ydWxlcy5wcm9jZXNzKCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoIHJlbmRlcmFibGUgdG8gdGhlIHJlbmRlciB0cmVlLlxuICAgKi9cblxuXG4gIF9jcmVhdGVDbGFzcyhTdHlsZVNoZWV0LCBbe1xuICAgIGtleTogJ2F0dGFjaCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGF0dGFjaCgpIHtcbiAgICAgIGlmICh0aGlzLmF0dGFjaGVkKSByZXR1cm4gdGhpcztcbiAgICAgIGlmICghdGhpcy5kZXBsb3llZCkgdGhpcy5kZXBsb3koKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYXR0YWNoKCk7XG4gICAgICBpZiAoIXRoaXMubGlua2VkICYmIHRoaXMub3B0aW9ucy5saW5rKSB0aGlzLmxpbmsoKTtcbiAgICAgIHRoaXMuYXR0YWNoZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHJlbmRlcmFibGUgZnJvbSByZW5kZXIgdHJlZS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZGV0YWNoJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGV0YWNoKCkge1xuICAgICAgaWYgKCF0aGlzLmF0dGFjaGVkKSByZXR1cm4gdGhpcztcbiAgICAgIHRoaXMucmVuZGVyZXIuZGV0YWNoKCk7XG4gICAgICB0aGlzLmF0dGFjaGVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBydWxlIHRvIHRoZSBjdXJyZW50IHN0eWxlc2hlZXQuXG4gICAgICogV2lsbCBpbnNlcnQgYSBydWxlIGFsc28gYWZ0ZXIgdGhlIHN0eWxlc2hlZXQgaGFzIGJlZW4gcmVuZGVyZWQgZmlyc3QgdGltZS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnYWRkUnVsZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFJ1bGUobmFtZSwgZGVjbCwgb3B0aW9ucykge1xuICAgICAgdmFyIHF1ZXVlID0gdGhpcy5xdWV1ZTtcblxuICAgICAgLy8gUGx1Z2lucyBjYW4gY3JlYXRlIHJ1bGVzLlxuICAgICAgLy8gSW4gb3JkZXIgdG8gcHJlc2VydmUgdGhlIHJpZ2h0IG9yZGVyLCB3ZSBuZWVkIHRvIHF1ZXVlIGFsbCBgLmFkZFJ1bGVgIGNhbGxzLFxuICAgICAgLy8gd2hpY2ggaGFwcGVuIGFmdGVyIHRoZSBmaXJzdCBgcnVsZXMuYWRkKClgIGNhbGwuXG5cbiAgICAgIGlmICh0aGlzLmF0dGFjaGVkICYmICFxdWV1ZSkgdGhpcy5xdWV1ZSA9IFtdO1xuXG4gICAgICB2YXIgcnVsZSA9IHRoaXMucnVsZXMuYWRkKG5hbWUsIGRlY2wsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5vcHRpb25zLmpzcy5wbHVnaW5zLm9uUHJvY2Vzc1J1bGUocnVsZSk7XG5cbiAgICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7XG4gICAgICAgIGlmICghdGhpcy5kZXBsb3llZCkgcmV0dXJuIHJ1bGU7XG4gICAgICAgIC8vIERvbid0IGluc2VydCBydWxlIGRpcmVjdGx5IGlmIHRoZXJlIGlzIG5vIHN0cmluZ2lmaWVkIHZlcnNpb24geWV0LlxuICAgICAgICAvLyBJdCB3aWxsIGJlIGluc2VydGVkIGFsbCB0b2dldGhlciB3aGVuIC5hdHRhY2ggaXMgY2FsbGVkLlxuICAgICAgICBpZiAocXVldWUpIHF1ZXVlLnB1c2gocnVsZSk7ZWxzZSB7XG4gICAgICAgICAgdGhpcy5pbnNlcnRSdWxlKHJ1bGUpO1xuICAgICAgICAgIGlmICh0aGlzLnF1ZXVlKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXVlLmZvckVhY2godGhpcy5pbnNlcnRSdWxlLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucXVldWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBydWxlO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSBjYW4ndCBhZGQgcnVsZXMgdG8gYSBkZXRhY2hlZCBzdHlsZSBub2RlLlxuICAgICAgLy8gV2Ugd2lsbCByZWRlcGxveSB0aGUgc2hlZXQgb25jZSB1c2VyIHdpbGwgYXR0YWNoIGl0LlxuICAgICAgdGhpcy5kZXBsb3llZCA9IGZhbHNlO1xuXG4gICAgICByZXR1cm4gcnVsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgcnVsZSBpbnRvIHRoZSBTdHlsZVNoZWV0XG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2luc2VydFJ1bGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbnNlcnRSdWxlKHJ1bGUpIHtcbiAgICAgIHZhciByZW5kZXJhYmxlID0gdGhpcy5yZW5kZXJlci5pbnNlcnRSdWxlKHJ1bGUpO1xuICAgICAgaWYgKHJlbmRlcmFibGUgJiYgdGhpcy5vcHRpb25zLmxpbmspICgwLCBfbGlua1J1bGUyWydkZWZhdWx0J10pKHJ1bGUsIHJlbmRlcmFibGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYWRkIHJ1bGVzLlxuICAgICAqIFdpbGwgcmVuZGVyIGFsc28gYWZ0ZXIgU3R5bGUgU2hlZXQgd2FzIHJlbmRlcmVkIHRoZSBmaXJzdCB0aW1lLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdhZGRSdWxlcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFJ1bGVzKHN0eWxlcywgb3B0aW9ucykge1xuICAgICAgdmFyIGFkZGVkID0gW107XG4gICAgICBmb3IgKHZhciBfbmFtZTIgaW4gc3R5bGVzKSB7XG4gICAgICAgIGFkZGVkLnB1c2godGhpcy5hZGRSdWxlKF9uYW1lMiwgc3R5bGVzW19uYW1lMl0sIG9wdGlvbnMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhZGRlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBydWxlIGJ5IG5hbWUuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2dldFJ1bGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRSdWxlKG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzLmdldChuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGUgYSBydWxlIGJ5IG5hbWUuXG4gICAgICogUmV0dXJucyBgdHJ1ZWA6IGlmIHJ1bGUgaGFzIGJlZW4gZGVsZXRlZCBmcm9tIHRoZSBET00uXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2RlbGV0ZVJ1bGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWxldGVSdWxlKG5hbWUpIHtcbiAgICAgIHZhciBydWxlID0gdGhpcy5ydWxlcy5nZXQobmFtZSk7XG5cbiAgICAgIGlmICghcnVsZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICB0aGlzLnJ1bGVzLnJlbW92ZShydWxlKTtcblxuICAgICAgaWYgKHRoaXMuYXR0YWNoZWQgJiYgcnVsZS5yZW5kZXJhYmxlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmRlbGV0ZVJ1bGUocnVsZS5yZW5kZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGluZGV4IG9mIGEgcnVsZS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnaW5kZXhPZicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluZGV4T2YocnVsZSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXMuaW5kZXhPZihydWxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXBsb3kgcHVyZSBDU1Mgc3RyaW5nIHRvIGEgcmVuZGVyYWJsZS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZGVwbG95JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVwbG95KCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5kZXBsb3koKTtcbiAgICAgIHRoaXMuZGVwbG95ZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGluayByZW5kZXJhYmxlIENTUyBydWxlcyBmcm9tIHNoZWV0IHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyBtb2RlbHMuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2xpbmsnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaW5rKCkge1xuICAgICAgdmFyIGNzc1J1bGVzID0gdGhpcy5yZW5kZXJlci5nZXRSdWxlcygpO1xuXG4gICAgICAvLyBJcyB1bmRlZmluZWQgd2hlbiBWaXJ0dWFsUmVuZGVyZXIgaXMgdXNlZC5cbiAgICAgIGlmIChjc3NSdWxlcykgdGhpcy5ydWxlcy5saW5rKGNzc1J1bGVzKTtcbiAgICAgIHRoaXMubGlua2VkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgZnVuY3Rpb24gdmFsdWVzIHdpdGggYSBuZXcgZGF0YS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAndG9TdHJpbmcnLFxuXG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IHJ1bGVzIHRvIGEgQ1NTIHN0cmluZy5cbiAgICAgKi9cbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXMudG9TdHJpbmcob3B0aW9ucyk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFN0eWxlU2hlZXQ7XG59KCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFN0eWxlU2hlZXQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5jcmVhdGUgPSBleHBvcnRzLmNyZWF0ZUdlbmVyYXRlQ2xhc3NOYW1lID0gZXhwb3J0cy5zaGVldHMgPSBleHBvcnRzLlJ1bGVMaXN0ID0gZXhwb3J0cy5TaGVldHNNYW5hZ2VyID0gZXhwb3J0cy5TaGVldHNSZWdpc3RyeSA9IGV4cG9ydHMudG9Dc3NWYWx1ZSA9IGV4cG9ydHMuZ2V0RHluYW1pY1N0eWxlcyA9IHVuZGVmaW5lZDtcblxudmFyIF9nZXREeW5hbWljU3R5bGVzID0gcmVxdWlyZSgnLi91dGlscy9nZXREeW5hbWljU3R5bGVzJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnZ2V0RHluYW1pY1N0eWxlcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldER5bmFtaWNTdHlsZXMpWydkZWZhdWx0J107XG4gIH1cbn0pO1xuXG52YXIgX3RvQ3NzVmFsdWUgPSByZXF1aXJlKCcuL3V0aWxzL3RvQ3NzVmFsdWUnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd0b0Nzc1ZhbHVlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdG9Dc3NWYWx1ZSlbJ2RlZmF1bHQnXTtcbiAgfVxufSk7XG5cbnZhciBfU2hlZXRzUmVnaXN0cnkgPSByZXF1aXJlKCcuL1NoZWV0c1JlZ2lzdHJ5Jyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnU2hlZXRzUmVnaXN0cnknLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TaGVldHNSZWdpc3RyeSlbJ2RlZmF1bHQnXTtcbiAgfVxufSk7XG5cbnZhciBfU2hlZXRzTWFuYWdlciA9IHJlcXVpcmUoJy4vU2hlZXRzTWFuYWdlcicpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1NoZWV0c01hbmFnZXInLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TaGVldHNNYW5hZ2VyKVsnZGVmYXVsdCddO1xuICB9XG59KTtcblxudmFyIF9SdWxlTGlzdCA9IHJlcXVpcmUoJy4vUnVsZUxpc3QnKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdSdWxlTGlzdCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1J1bGVMaXN0KVsnZGVmYXVsdCddO1xuICB9XG59KTtcblxudmFyIF9zaGVldHMgPSByZXF1aXJlKCcuL3NoZWV0cycpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NoZWV0cycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NoZWV0cylbJ2RlZmF1bHQnXTtcbiAgfVxufSk7XG5cbnZhciBfY3JlYXRlR2VuZXJhdGVDbGFzc05hbWUgPSByZXF1aXJlKCcuL3V0aWxzL2NyZWF0ZUdlbmVyYXRlQ2xhc3NOYW1lJyk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3JlYXRlR2VuZXJhdGVDbGFzc05hbWUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVHZW5lcmF0ZUNsYXNzTmFtZSlbJ2RlZmF1bHQnXTtcbiAgfVxufSk7XG5cbnZhciBfSnNzID0gcmVxdWlyZSgnLi9Kc3MnKTtcblxudmFyIF9Kc3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfSnNzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgSnNzLlxuICovXG52YXIgY3JlYXRlID0gZXhwb3J0cy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUob3B0aW9ucykge1xuICByZXR1cm4gbmV3IF9Kc3MyWydkZWZhdWx0J10ob3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIEEgZ2xvYmFsIEpzcyBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0c1snZGVmYXVsdCddID0gY3JlYXRlKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1J1bGVMaXN0ID0gcmVxdWlyZSgnLi4vUnVsZUxpc3QnKTtcblxudmFyIF9SdWxlTGlzdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9SdWxlTGlzdCk7XG5cbnZhciBfU3R5bGVSdWxlID0gcmVxdWlyZSgnLi4vcnVsZXMvU3R5bGVSdWxlJyk7XG5cbnZhciBfU3R5bGVSdWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1N0eWxlUnVsZSk7XG5cbnZhciBfY3JlYXRlUnVsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL2NyZWF0ZVJ1bGUnKTtcblxudmFyIF9jcmVhdGVSdWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZVJ1bGUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbi8vIEEgc3ltYm9sIHJlcGxhY2VtZW50LlxudmFyIG5vdyA9IERhdGUubm93KCk7XG5cbnZhciBmblZhbHVlc05zID0gJ2ZuVmFsdWVzJyArIG5vdztcbnZhciBmblN0eWxlTnMgPSAnZm5TdHlsZScgKyArK25vdztcblxuZXhwb3J0c1snZGVmYXVsdCddID0ge1xuICBvbkNyZWF0ZVJ1bGU6IGZ1bmN0aW9uIG9uQ3JlYXRlUnVsZShuYW1lLCBkZWNsLCBvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBkZWNsICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gbnVsbDtcbiAgICB2YXIgcnVsZSA9ICgwLCBfY3JlYXRlUnVsZTJbJ2RlZmF1bHQnXSkobmFtZSwge30sIG9wdGlvbnMpO1xuICAgIHJ1bGVbZm5TdHlsZU5zXSA9IGRlY2w7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH0sXG4gIG9uUHJvY2Vzc1N0eWxlOiBmdW5jdGlvbiBvblByb2Nlc3NTdHlsZShzdHlsZSwgcnVsZSkge1xuICAgIHZhciBmbiA9IHt9O1xuICAgIGZvciAodmFyIHByb3AgaW4gc3R5bGUpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHN0eWxlW3Byb3BdO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJykgY29udGludWU7XG4gICAgICBkZWxldGUgc3R5bGVbcHJvcF07XG4gICAgICBmbltwcm9wXSA9IHZhbHVlO1xuICAgIH1cbiAgICBydWxlID0gcnVsZTtcbiAgICBydWxlW2ZuVmFsdWVzTnNdID0gZm47XG4gICAgcmV0dXJuIHN0eWxlO1xuICB9LFxuICBvblVwZGF0ZTogZnVuY3Rpb24gb25VcGRhdGUoZGF0YSwgcnVsZSkge1xuICAgIC8vIEl0IGlzIGEgcnVsZXMgY29udGFpbmVyIGxpa2UgZm9yIGUuZy4gQ29uZGl0aW9uYWxSdWxlLlxuICAgIGlmIChydWxlLnJ1bGVzIGluc3RhbmNlb2YgX1J1bGVMaXN0MlsnZGVmYXVsdCddKSB7XG4gICAgICBydWxlLnJ1bGVzLnVwZGF0ZShkYXRhKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCEocnVsZSBpbnN0YW5jZW9mIF9TdHlsZVJ1bGUyWydkZWZhdWx0J10pKSByZXR1cm47XG5cbiAgICBydWxlID0gcnVsZTtcblxuICAgIC8vIElmIHdlIGhhdmUgYSBmbiB2YWx1ZXMgbWFwLCBpdCBpcyBhIHJ1bGUgd2l0aCBmdW5jdGlvbiB2YWx1ZXMuXG4gICAgaWYgKHJ1bGVbZm5WYWx1ZXNOc10pIHtcbiAgICAgIGZvciAodmFyIHByb3AgaW4gcnVsZVtmblZhbHVlc05zXSkge1xuICAgICAgICBydWxlLnByb3AocHJvcCwgcnVsZVtmblZhbHVlc05zXVtwcm9wXShkYXRhKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcnVsZSA9IHJ1bGU7XG5cbiAgICB2YXIgZm5TdHlsZSA9IHJ1bGVbZm5TdHlsZU5zXTtcblxuICAgIC8vIElmIHdlIGhhdmUgYSBzdHlsZSBmdW5jdGlvbiwgdGhlIGVudGlyZSBydWxlIGlzIGR5bmFtaWMgYW5kIHN0eWxlIG9iamVjdFxuICAgIC8vIHdpbGwgYmUgcmV0dXJuZWQgZnJvbSB0aGF0IGZ1bmN0aW9uLlxuICAgIGlmIChmblN0eWxlKSB7XG4gICAgICB2YXIgc3R5bGUgPSBmblN0eWxlKGRhdGEpO1xuICAgICAgZm9yICh2YXIgX3Byb3AgaW4gc3R5bGUpIHtcbiAgICAgICAgcnVsZS5wcm9wKF9wcm9wLCBzdHlsZVtfcHJvcF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfU3R5bGVSdWxlID0gcmVxdWlyZSgnLi4vcnVsZXMvU3R5bGVSdWxlJyk7XG5cbnZhciBfU3R5bGVSdWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1N0eWxlUnVsZSk7XG5cbnZhciBfY3JlYXRlUnVsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL2NyZWF0ZVJ1bGUnKTtcblxudmFyIF9jcmVhdGVSdWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZVJ1bGUpO1xuXG52YXIgX2lzT2JzZXJ2YWJsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzT2JzZXJ2YWJsZScpO1xuXG52YXIgX2lzT2JzZXJ2YWJsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc09ic2VydmFibGUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHtcbiAgb25DcmVhdGVSdWxlOiBmdW5jdGlvbiBvbkNyZWF0ZVJ1bGUobmFtZSwgZGVjbCwgb3B0aW9ucykge1xuICAgIGlmICghKDAsIF9pc09ic2VydmFibGUyWydkZWZhdWx0J10pKGRlY2wpKSByZXR1cm4gbnVsbDtcblxuICAgIC8vIENhc3QgYGRlY2xgIHRvIGBPYnNlcnZhYmxlYCwgc2luY2UgaXQgcGFzc2VkIHRoZSB0eXBlIGd1YXJkLlxuICAgIHZhciBzdHlsZSQgPSBkZWNsO1xuXG4gICAgdmFyIHJ1bGUgPSAoMCwgX2NyZWF0ZVJ1bGUyWydkZWZhdWx0J10pKG5hbWUsIHt9LCBvcHRpb25zKTtcblxuICAgIC8vIFRPRE9cbiAgICAvLyBDYWxsIGBzdHJlYW0uc3Vic2NyaWJlKClgIHJldHVybnMgYSBzdWJzY3JpcHRpb24sIHdoaWNoIHNob3VsZCBiZSBleHBsaWNpdGx5XG4gICAgLy8gdW5zdWJzY3JpYmVkIGZyb20gd2hlbiB3ZSBrbm93IHRoaXMgc2hlZXQgaXMgbm8gbG9uZ2VyIG5lZWRlZC5cbiAgICBzdHlsZSQuc3Vic2NyaWJlKGZ1bmN0aW9uIChzdHlsZSkge1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBzdHlsZSkge1xuICAgICAgICBydWxlLnByb3AocHJvcCwgc3R5bGVbcHJvcF0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJ1bGU7XG4gIH0sXG4gIG9uUHJvY2Vzc1J1bGU6IGZ1bmN0aW9uIG9uUHJvY2Vzc1J1bGUocnVsZSkge1xuICAgIGlmICghKHJ1bGUgaW5zdGFuY2VvZiBfU3R5bGVSdWxlMlsnZGVmYXVsdCddKSkgcmV0dXJuO1xuICAgIHZhciBzdHlsZVJ1bGUgPSBydWxlO1xuICAgIHZhciBzdHlsZSA9IHN0eWxlUnVsZS5zdHlsZTtcblxuICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKHByb3ApIHtcbiAgICAgIHZhciB2YWx1ZSA9IHN0eWxlW3Byb3BdO1xuICAgICAgaWYgKCEoMCwgX2lzT2JzZXJ2YWJsZTJbJ2RlZmF1bHQnXSkodmFsdWUpKSByZXR1cm4gJ2NvbnRpbnVlJztcbiAgICAgIGRlbGV0ZSBzdHlsZVtwcm9wXTtcbiAgICAgIHZhbHVlLnN1YnNjcmliZSh7XG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uIG5leHQobmV4dFZhbHVlKSB7XG4gICAgICAgICAgc3R5bGVSdWxlLnByb3AocHJvcCwgbmV4dFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZvciAodmFyIHByb3AgaW4gc3R5bGUpIHtcbiAgICAgIHZhciBfcmV0ID0gX2xvb3AocHJvcCk7XG5cbiAgICAgIGlmIChfcmV0ID09PSAnY29udGludWUnKSBjb250aW51ZTtcbiAgICB9XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1NpbXBsZVJ1bGUgPSByZXF1aXJlKCcuLi9ydWxlcy9TaW1wbGVSdWxlJyk7XG5cbnZhciBfU2ltcGxlUnVsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TaW1wbGVSdWxlKTtcblxudmFyIF9LZXlmcmFtZXNSdWxlID0gcmVxdWlyZSgnLi4vcnVsZXMvS2V5ZnJhbWVzUnVsZScpO1xuXG52YXIgX0tleWZyYW1lc1J1bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfS2V5ZnJhbWVzUnVsZSk7XG5cbnZhciBfQ29uZGl0aW9uYWxSdWxlID0gcmVxdWlyZSgnLi4vcnVsZXMvQ29uZGl0aW9uYWxSdWxlJyk7XG5cbnZhciBfQ29uZGl0aW9uYWxSdWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0NvbmRpdGlvbmFsUnVsZSk7XG5cbnZhciBfRm9udEZhY2VSdWxlID0gcmVxdWlyZSgnLi4vcnVsZXMvRm9udEZhY2VSdWxlJyk7XG5cbnZhciBfRm9udEZhY2VSdWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0ZvbnRGYWNlUnVsZSk7XG5cbnZhciBfVmlld3BvcnRSdWxlID0gcmVxdWlyZSgnLi4vcnVsZXMvVmlld3BvcnRSdWxlJyk7XG5cbnZhciBfVmlld3BvcnRSdWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1ZpZXdwb3J0UnVsZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIGNsYXNzZXMgPSB7XG4gICdAY2hhcnNldCc6IF9TaW1wbGVSdWxlMlsnZGVmYXVsdCddLFxuICAnQGltcG9ydCc6IF9TaW1wbGVSdWxlMlsnZGVmYXVsdCddLFxuICAnQG5hbWVzcGFjZSc6IF9TaW1wbGVSdWxlMlsnZGVmYXVsdCddLFxuICAnQGtleWZyYW1lcyc6IF9LZXlmcmFtZXNSdWxlMlsnZGVmYXVsdCddLFxuICAnQG1lZGlhJzogX0NvbmRpdGlvbmFsUnVsZTJbJ2RlZmF1bHQnXSxcbiAgJ0BzdXBwb3J0cyc6IF9Db25kaXRpb25hbFJ1bGUyWydkZWZhdWx0J10sXG4gICdAZm9udC1mYWNlJzogX0ZvbnRGYWNlUnVsZTJbJ2RlZmF1bHQnXSxcbiAgJ0B2aWV3cG9ydCc6IF9WaWV3cG9ydFJ1bGUyWydkZWZhdWx0J10sXG4gICdALW1zLXZpZXdwb3J0JzogX1ZpZXdwb3J0UnVsZTJbJ2RlZmF1bHQnXVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBwbHVnaW5zIHdoaWNoIHdpbGwgcmVnaXN0ZXIgYWxsIHJ1bGVzLlxuICAgKi9cbn07XG52YXIgcGx1Z2lucyA9IE9iamVjdC5rZXlzKGNsYXNzZXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gIC8vIGh0dHBzOi8vanNwZXJmLmNvbS9pbmRleG9mLXZzLXN1YnN0ci12cy1yZWdleC1hdC10aGUtYmVnaW5uaW5nLTNcbiAgdmFyIHJlID0gbmV3IFJlZ0V4cCgnXicgKyBrZXkpO1xuICB2YXIgUnVsZUNsYXNzID0gY2xhc3Nlc1trZXldO1xuICB2YXIgb25DcmVhdGVSdWxlID0gZnVuY3Rpb24gb25DcmVhdGVSdWxlKG5hbWUsIGRlY2wsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gcmUudGVzdChuYW1lKSA/IG5ldyBSdWxlQ2xhc3MobmFtZSwgZGVjbCwgb3B0aW9ucykgOiBudWxsO1xuICB9O1xuICByZXR1cm4geyBvbkNyZWF0ZVJ1bGU6IG9uQ3JlYXRlUnVsZSB9O1xufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHBsdWdpbnM7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3dhcm5pbmcgPSByZXF1aXJlKCd3YXJuaW5nJyk7XG5cbnZhciBfd2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93YXJuaW5nKTtcblxudmFyIF9zaGVldHMgPSByZXF1aXJlKCcuLi9zaGVldHMnKTtcblxudmFyIF9zaGVldHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2hlZXRzKTtcblxudmFyIF9TdHlsZVJ1bGUgPSByZXF1aXJlKCcuLi9ydWxlcy9TdHlsZVJ1bGUnKTtcblxudmFyIF9TdHlsZVJ1bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfU3R5bGVSdWxlKTtcblxudmFyIF90b0Nzc1ZhbHVlID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9Dc3NWYWx1ZScpO1xuXG52YXIgX3RvQ3NzVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdG9Dc3NWYWx1ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXG4gKiBDYWNoZSB0aGUgdmFsdWUgZnJvbSB0aGUgZmlyc3QgdGltZSBhIGZ1bmN0aW9uIGlzIGNhbGxlZC5cbiAqL1xudmFyIG1lbW9pemUgPSBmdW5jdGlvbiBtZW1vaXplKGZuKSB7XG4gIHZhciB2YWx1ZSA9IHZvaWQgMDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXZhbHVlKSB2YWx1ZSA9IGZuKCk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufTtcblxuLyoqXG4gKiBHZXQgYSBzdHlsZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0UHJvcGVydHlWYWx1ZShjc3NSdWxlLCBwcm9wKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGNzc1J1bGUuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgLy8gSUUgbWF5IHRocm93IGlmIHByb3BlcnR5IGlzIHVua25vd24uXG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbi8qKlxuICogU2V0IGEgc3R5bGUgcHJvcGVydHkuXG4gKi9cbmZ1bmN0aW9uIHNldFByb3BlcnR5KGNzc1J1bGUsIHByb3AsIHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgdmFyIGNzc1ZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGNzc1ZhbHVlID0gKDAsIF90b0Nzc1ZhbHVlMlsnZGVmYXVsdCddKSh2YWx1ZSwgdHJ1ZSk7XG5cbiAgICAgIGlmICh2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXSA9PT0gJyFpbXBvcnRhbnQnKSB7XG4gICAgICAgIGNzc1J1bGUuc3R5bGUuc2V0UHJvcGVydHkocHJvcCwgY3NzVmFsdWUsICdpbXBvcnRhbnQnKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY3NzUnVsZS5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wLCBjc3NWYWx1ZSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIElFIG1heSB0aHJvdyBpZiBwcm9wZXJ0eSBpcyB1bmtub3duLlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBzdHlsZSBwcm9wZXJ0eS5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlUHJvcGVydHkoY3NzUnVsZSwgcHJvcCkge1xuICB0cnkge1xuICAgIGNzc1J1bGUuc3R5bGUucmVtb3ZlUHJvcGVydHkocHJvcCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgICgwLCBfd2FybmluZzJbJ2RlZmF1bHQnXSkoZmFsc2UsICdbSlNTXSBET01FeGNlcHRpb24gXCIlc1wiIHdhcyB0aHJvd24uIFRyaWVkIHRvIHJlbW92ZSBwcm9wZXJ0eSBcIiVzXCIuJywgZXJyLm1lc3NhZ2UsIHByb3ApO1xuICB9XG59XG5cbnZhciBDU1NSdWxlVHlwZXMgPSB7XG4gIFNUWUxFX1JVTEU6IDEsXG4gIEtFWUZSQU1FU19SVUxFOiA3XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgQ1NTIFJ1bGUga2V5LlxuICAgKi9cblxufTt2YXIgZ2V0S2V5ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZXh0cmFjdEtleSA9IGZ1bmN0aW9uIGV4dHJhY3RLZXkoY3NzVGV4dCkge1xuICAgIHZhciBmcm9tID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAgIHJldHVybiBjc3NUZXh0LnN1YnN0cihmcm9tLCBjc3NUZXh0LmluZGV4T2YoJ3snKSAtIDEpO1xuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbiAoY3NzUnVsZSkge1xuICAgIGlmIChjc3NSdWxlLnR5cGUgPT09IENTU1J1bGVUeXBlcy5TVFlMRV9SVUxFKSByZXR1cm4gY3NzUnVsZS5zZWxlY3RvclRleHQ7XG4gICAgaWYgKGNzc1J1bGUudHlwZSA9PT0gQ1NTUnVsZVR5cGVzLktFWUZSQU1FU19SVUxFKSB7XG4gICAgICB2YXIgbmFtZSA9IGNzc1J1bGUubmFtZTtcblxuICAgICAgaWYgKG5hbWUpIHJldHVybiAnQGtleWZyYW1lcyAnICsgbmFtZTtcblxuICAgICAgLy8gVGhlcmUgaXMgbm8gcnVsZS5uYW1lIGluIHRoZSBmb2xsb3dpbmcgYnJvd3NlcnM6XG4gICAgICAvLyAtIElFIDlcbiAgICAgIC8vIC0gU2FmYXJpIDcuMS44XG4gICAgICAvLyAtIE1vYmlsZSBTYWZhcmkgOS4wLjBcbiAgICAgIHZhciBjc3NUZXh0ID0gY3NzUnVsZS5jc3NUZXh0O1xuXG4gICAgICByZXR1cm4gJ0AnICsgZXh0cmFjdEtleShjc3NUZXh0LCBjc3NUZXh0LmluZGV4T2YoJ2tleWZyYW1lcycpKTtcbiAgICB9XG5cbiAgICAvLyBDb25kaXRpb25hbHMuXG4gICAgcmV0dXJuIGV4dHJhY3RLZXkoY3NzUnVsZS5jc3NUZXh0KTtcbiAgfTtcbn0oKTtcblxuLyoqXG4gKiBTZXQgdGhlIHNlbGVjdG9yLlxuICovXG5mdW5jdGlvbiBzZXRTZWxlY3Rvcihjc3NSdWxlLCBzZWxlY3RvclRleHQpIHtcbiAgY3NzUnVsZS5zZWxlY3RvclRleHQgPSBzZWxlY3RvclRleHQ7XG5cbiAgLy8gUmV0dXJuIGZhbHNlIGlmIHNldHRlciB3YXMgbm90IHN1Y2Nlc3NmdWwuXG4gIC8vIEN1cnJlbnRseSB3b3JrcyBpbiBjaHJvbWUgb25seS5cbiAgcmV0dXJuIGNzc1J1bGUuc2VsZWN0b3JUZXh0ID09PSBzZWxlY3RvclRleHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgYGhlYWRgIGVsZW1lbnQgdXBvbiB0aGUgZmlyc3QgY2FsbCBhbmQgY2FjaGVzIGl0LlxuICovXG52YXIgZ2V0SGVhZCA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xufSk7XG5cbi8qKlxuICogR2V0cyBhIG1hcCBvZiBydWxlIGtleXMsIHdoZXJlIHRoZSBwcm9wZXJ0eSBpcyBhbiB1bmVzY2FwZWQga2V5IGFuZCB2YWx1ZVxuICogaXMgYSBwb3RlbnRpYWxseSBlc2NhcGVkIG9uZS5cbiAqIEl0IGlzIHVzZWQgdG8gaWRlbnRpZnkgQ1NTIHJ1bGVzIGFuZCB0aGUgY29ycmVzcG9uZGluZyBKU1MgcnVsZXMuIEFzIGFuIGlkZW50aWZpZXJcbiAqIGZvciBDU1NTdHlsZVJ1bGUgd2Ugbm9ybWFsbHkgdXNlIGBzZWxlY3RvclRleHRgLiBUaG91Z2ggaWYgb3JpZ2luYWwgc2VsZWN0b3IgdGV4dFxuICogY29udGFpbnMgZXNjYXBlZCBjb2RlIHBvaW50cyBlLmcuIGA6bm90KCNcXFxcMjApYCwgQ1NTT00gd2lsbCBjb21waWxlIGl0IHRvIGA6bm90KCMgKWBcbiAqIGFuZCBzbyBDU1MgcnVsZSdzIGBzZWxlY3RvclRleHRgIHdvbid0IG1hdGNoIEpTUyBydWxlIHNlbGVjdG9yLlxuICpcbiAqIGh0dHBzOi8vd3d3LnczLm9yZy9JbnRlcm5hdGlvbmFsL3F1ZXN0aW9ucy9xYS1lc2NhcGVzI2Nzc2VzY2FwZXNcbiAqL1xudmFyIGdldFVuZXNjYXBlZEtleXNNYXAgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdHlsZSA9IHZvaWQgMDtcbiAgdmFyIGlzQXR0YWNoZWQgPSBmYWxzZTtcblxuICByZXR1cm4gZnVuY3Rpb24gKHJ1bGVzKSB7XG4gICAgdmFyIG1hcCA9IHt9O1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy8yNjk2XG4gICAgaWYgKCFzdHlsZSkgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBydWxlID0gcnVsZXNbaV07XG4gICAgICBpZiAoIShydWxlIGluc3RhbmNlb2YgX1N0eWxlUnVsZTJbJ2RlZmF1bHQnXSkpIGNvbnRpbnVlO1xuICAgICAgdmFyIHNlbGVjdG9yID0gcnVsZS5zZWxlY3RvcjtcbiAgICAgIC8vIE9ubHkgdW5lc2NhcGUgc2VsZWN0b3Igb3ZlciBDU1NPTSBpZiBpdCBjb250YWlucyBhIGJhY2sgc2xhc2guXG5cbiAgICAgIGlmIChzZWxlY3RvciAmJiBzZWxlY3Rvci5pbmRleE9mKCdcXFxcJykgIT09IC0xKSB7XG4gICAgICAgIC8vIExhemlsbHkgYXR0YWNoIHdoZW4gbmVlZGVkLlxuICAgICAgICBpZiAoIWlzQXR0YWNoZWQpIHtcbiAgICAgICAgICBnZXRIZWFkKCkuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICAgIGlzQXR0YWNoZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gc2VsZWN0b3IgKyAnIHt9JztcbiAgICAgICAgdmFyIF9zdHlsZSA9IHN0eWxlLFxuICAgICAgICAgICAgc2hlZXQgPSBfc3R5bGUuc2hlZXQ7XG5cbiAgICAgICAgaWYgKHNoZWV0KSB7XG4gICAgICAgICAgdmFyIGNzc1J1bGVzID0gc2hlZXQuY3NzUnVsZXM7XG5cbiAgICAgICAgICBpZiAoY3NzUnVsZXMpIG1hcFtjc3NSdWxlc1swXS5zZWxlY3RvclRleHRdID0gcnVsZS5rZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzQXR0YWNoZWQpIHtcbiAgICAgIGdldEhlYWQoKS5yZW1vdmVDaGlsZChzdHlsZSk7XG4gICAgICBpc0F0dGFjaGVkID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBtYXA7XG4gIH07XG59KCk7XG5cbi8qKlxuICogRmluZCBhdHRhY2hlZCBzaGVldCB3aXRoIGFuIGluZGV4IGhpZ2hlciB0aGFuIHRoZSBwYXNzZWQgb25lLlxuICovXG5mdW5jdGlvbiBmaW5kSGlnaGVyU2hlZXQocmVnaXN0cnksIG9wdGlvbnMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RyeS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzaGVldCA9IHJlZ2lzdHJ5W2ldO1xuICAgIGlmIChzaGVldC5hdHRhY2hlZCAmJiBzaGVldC5vcHRpb25zLmluZGV4ID4gb3B0aW9ucy5pbmRleCAmJiBzaGVldC5vcHRpb25zLmluc2VydGlvblBvaW50ID09PSBvcHRpb25zLmluc2VydGlvblBvaW50KSB7XG4gICAgICByZXR1cm4gc2hlZXQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEZpbmQgYXR0YWNoZWQgc2hlZXQgd2l0aCB0aGUgaGlnaGVzdCBpbmRleC5cbiAqL1xuZnVuY3Rpb24gZmluZEhpZ2hlc3RTaGVldChyZWdpc3RyeSwgb3B0aW9ucykge1xuICBmb3IgKHZhciBpID0gcmVnaXN0cnkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgc2hlZXQgPSByZWdpc3RyeVtpXTtcbiAgICBpZiAoc2hlZXQuYXR0YWNoZWQgJiYgc2hlZXQub3B0aW9ucy5pbnNlcnRpb25Qb2ludCA9PT0gb3B0aW9ucy5pbnNlcnRpb25Qb2ludCkge1xuICAgICAgcmV0dXJuIHNoZWV0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBGaW5kIGEgY29tbWVudCB3aXRoIFwianNzXCIgaW5zaWRlLlxuICovXG5mdW5jdGlvbiBmaW5kQ29tbWVudE5vZGUodGV4dCkge1xuICB2YXIgaGVhZCA9IGdldEhlYWQoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZWFkLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IGhlYWQuY2hpbGROb2Rlc1tpXTtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCAmJiBub2RlLm5vZGVWYWx1ZS50cmltKCkgPT09IHRleHQpIHtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBGaW5kIGEgbm9kZSBiZWZvcmUgd2hpY2ggd2UgY2FuIGluc2VydCB0aGUgc2hlZXQuXG4gKi9cbmZ1bmN0aW9uIGZpbmRQcmV2Tm9kZShvcHRpb25zKSB7XG4gIHZhciByZWdpc3RyeSA9IF9zaGVldHMyWydkZWZhdWx0J10ucmVnaXN0cnk7XG5cblxuICBpZiAocmVnaXN0cnkubGVuZ3RoID4gMCkge1xuICAgIC8vIFRyeSB0byBpbnNlcnQgYmVmb3JlIHRoZSBuZXh0IGhpZ2hlciBzaGVldC5cbiAgICB2YXIgc2hlZXQgPSBmaW5kSGlnaGVyU2hlZXQocmVnaXN0cnksIG9wdGlvbnMpO1xuICAgIGlmIChzaGVldCkgcmV0dXJuIHNoZWV0LnJlbmRlcmVyLmVsZW1lbnQ7XG5cbiAgICAvLyBPdGhlcndpc2UgaW5zZXJ0IGFmdGVyIHRoZSBsYXN0IGF0dGFjaGVkLlxuICAgIHNoZWV0ID0gZmluZEhpZ2hlc3RTaGVldChyZWdpc3RyeSwgb3B0aW9ucyk7XG4gICAgaWYgKHNoZWV0KSByZXR1cm4gc2hlZXQucmVuZGVyZXIuZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gIH1cblxuICAvLyBUcnkgdG8gZmluZCBhIGNvbW1lbnQgcGxhY2Vob2xkZXIgaWYgcmVnaXN0cnkgaXMgZW1wdHkuXG4gIHZhciBpbnNlcnRpb25Qb2ludCA9IG9wdGlvbnMuaW5zZXJ0aW9uUG9pbnQ7XG5cbiAgaWYgKGluc2VydGlvblBvaW50ICYmIHR5cGVvZiBpbnNlcnRpb25Qb2ludCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgY29tbWVudCA9IGZpbmRDb21tZW50Tm9kZShpbnNlcnRpb25Qb2ludCk7XG4gICAgaWYgKGNvbW1lbnQpIHJldHVybiBjb21tZW50Lm5leHRTaWJsaW5nO1xuICAgIC8vIElmIHVzZXIgc3BlY2lmaWVzIGFuIGluc2VydGlvbiBwb2ludCBhbmQgaXQgY2FuJ3QgYmUgZm91bmQgaW4gdGhlIGRvY3VtZW50IC1cbiAgICAvLyBiYWQgc3BlY2lmaWNpdHkgaXNzdWVzIG1heSBhcHBlYXIuXG4gICAgKDAsIF93YXJuaW5nMlsnZGVmYXVsdCddKShpbnNlcnRpb25Qb2ludCA9PT0gJ2pzcycsICdbSlNTXSBJbnNlcnRpb24gcG9pbnQgXCIlc1wiIG5vdCBmb3VuZC4nLCBpbnNlcnRpb25Qb2ludCk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBJbnNlcnQgc3R5bGUgZWxlbWVudCBpbnRvIHRoZSBET00uXG4gKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlKHN0eWxlLCBvcHRpb25zKSB7XG4gIHZhciBpbnNlcnRpb25Qb2ludCA9IG9wdGlvbnMuaW5zZXJ0aW9uUG9pbnQ7XG5cbiAgdmFyIHByZXZOb2RlID0gZmluZFByZXZOb2RlKG9wdGlvbnMpO1xuXG4gIGlmIChwcmV2Tm9kZSkge1xuICAgIHZhciBwYXJlbnROb2RlID0gcHJldk5vZGUucGFyZW50Tm9kZTtcblxuICAgIGlmIChwYXJlbnROb2RlKSBwYXJlbnROb2RlLmluc2VydEJlZm9yZShzdHlsZSwgcHJldk5vZGUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFdvcmtzIHdpdGggaWZyYW1lcyBhbmQgYW55IG5vZGUgdHlwZXMuXG4gIGlmIChpbnNlcnRpb25Qb2ludCAmJiB0eXBlb2YgaW5zZXJ0aW9uUG9pbnQubm9kZVR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDEzMjg3MjgvZm9yY2UtY2FzdGluZy1pbi1mbG93XG4gICAgdmFyIGluc2VydGlvblBvaW50RWxlbWVudCA9IGluc2VydGlvblBvaW50O1xuICAgIHZhciBfcGFyZW50Tm9kZSA9IGluc2VydGlvblBvaW50RWxlbWVudC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKF9wYXJlbnROb2RlKSBfcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc3R5bGUsIGluc2VydGlvblBvaW50RWxlbWVudC5uZXh0U2libGluZyk7ZWxzZSAoMCwgX3dhcm5pbmcyWydkZWZhdWx0J10pKGZhbHNlLCAnW0pTU10gSW5zZXJ0aW9uIHBvaW50IGlzIG5vdCBpbiB0aGUgRE9NLicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGdldEhlYWQoKS5pbnNlcnRCZWZvcmUoc3R5bGUsIHByZXZOb2RlKTtcbn1cblxuLyoqXG4gKiBSZWFkIGpzcyBub25jZSBzZXR0aW5nIGZyb20gdGhlIHBhZ2UgaWYgdGhlIHVzZXIgaGFzIHNldCBpdC5cbiAqL1xudmFyIGdldE5vbmNlID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG4gIHZhciBub2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtwcm9wZXJ0eT1cImNzcC1ub25jZVwiXScpO1xuICByZXR1cm4gbm9kZSA/IG5vZGUuZ2V0QXR0cmlidXRlKCdjb250ZW50JykgOiBudWxsO1xufSk7XG5cbnZhciBEb21SZW5kZXJlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRG9tUmVuZGVyZXIoc2hlZXQpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRG9tUmVuZGVyZXIpO1xuXG4gICAgdGhpcy5nZXRQcm9wZXJ0eVZhbHVlID0gZ2V0UHJvcGVydHlWYWx1ZTtcbiAgICB0aGlzLnNldFByb3BlcnR5ID0gc2V0UHJvcGVydHk7XG4gICAgdGhpcy5yZW1vdmVQcm9wZXJ0eSA9IHJlbW92ZVByb3BlcnR5O1xuICAgIHRoaXMuc2V0U2VsZWN0b3IgPSBzZXRTZWxlY3RvcjtcbiAgICB0aGlzLmdldEtleSA9IGdldEtleTtcbiAgICB0aGlzLmdldFVuZXNjYXBlZEtleXNNYXAgPSBnZXRVbmVzY2FwZWRLZXlzTWFwO1xuICAgIHRoaXMuaGFzSW5zZXJ0ZWRSdWxlcyA9IGZhbHNlO1xuXG4gICAgLy8gVGhlcmUgaXMgbm8gc2hlZXQgd2hlbiB0aGUgcmVuZGVyZXIgaXMgdXNlZCBmcm9tIGEgc3RhbmRhbG9uZSBTdHlsZVJ1bGUuXG4gICAgaWYgKHNoZWV0KSBfc2hlZXRzMlsnZGVmYXVsdCddLmFkZChzaGVldCk7XG5cbiAgICB0aGlzLnNoZWV0ID0gc2hlZXQ7XG5cbiAgICB2YXIgX3JlZiA9IHRoaXMuc2hlZXQgPyB0aGlzLnNoZWV0Lm9wdGlvbnMgOiB7fSxcbiAgICAgICAgbWVkaWEgPSBfcmVmLm1lZGlhLFxuICAgICAgICBtZXRhID0gX3JlZi5tZXRhLFxuICAgICAgICBlbGVtZW50ID0gX3JlZi5lbGVtZW50O1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudCB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtanNzJywgJycpO1xuICAgIGlmIChtZWRpYSkgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnbWVkaWEnLCBtZWRpYSk7XG4gICAgaWYgKG1ldGEpIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbWV0YScsIG1ldGEpO1xuICAgIHZhciBub25jZSA9IGdldE5vbmNlKCk7XG4gICAgaWYgKG5vbmNlKSB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdub25jZScsIG5vbmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgc3R5bGUgZWxlbWVudCBpbnRvIHJlbmRlciB0cmVlLlxuICAgKi9cblxuXG4gIC8vIEhUTUxTdHlsZUVsZW1lbnQgbmVlZHMgZml4aW5nIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy8yNjk2XG5cblxuICBfY3JlYXRlQ2xhc3MoRG9tUmVuZGVyZXIsIFt7XG4gICAga2V5OiAnYXR0YWNoJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXR0YWNoKCkge1xuICAgICAgLy8gSW4gdGhlIGNhc2UgdGhlIGVsZW1lbnQgbm9kZSBpcyBleHRlcm5hbCBhbmQgaXQgaXMgYWxyZWFkeSBpbiB0aGUgRE9NLlxuICAgICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnROb2RlIHx8ICF0aGlzLnNoZWV0KSByZXR1cm47XG5cbiAgICAgIC8vIFdoZW4gcnVsZXMgYXJlIGluc2VydGVkIHVzaW5nIGBpbnNlcnRSdWxlYCBBUEksIGFmdGVyIGBzaGVldC5kZXRhY2goKS5hdHRhY2goKWBcbiAgICAgIC8vIGJyb3dzZXJzIHJlbW92ZSB0aG9zZSBydWxlcy5cbiAgICAgIC8vIFRPRE8gZmlndXJlIG91dCBpZiBpdHMgYSBidWcgYW5kIGlmIGl0IGlzIGtub3duLlxuICAgICAgLy8gV29ya2Fyb3VuZCBpcyB0byByZWRlcGxveSB0aGUgc2hlZXQgYmVmb3JlIGF0dGFjaGluZyBhcyBhIHN0cmluZy5cbiAgICAgIGlmICh0aGlzLmhhc0luc2VydGVkUnVsZXMpIHtcbiAgICAgICAgdGhpcy5kZXBsb3koKTtcbiAgICAgICAgdGhpcy5oYXNJbnNlcnRlZFJ1bGVzID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGluc2VydFN0eWxlKHRoaXMuZWxlbWVudCwgdGhpcy5zaGVldC5vcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgc3R5bGUgZWxlbWVudCBmcm9tIHJlbmRlciB0cmVlLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdkZXRhY2gnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXRhY2goKSB7XG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluamVjdCBDU1Mgc3RyaW5nIGludG8gZWxlbWVudC5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZGVwbG95JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVwbG95KCkge1xuICAgICAgaWYgKCF0aGlzLnNoZWV0KSByZXR1cm47XG4gICAgICB0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSAnXFxuJyArIHRoaXMuc2hlZXQudG9TdHJpbmcoKSArICdcXG4nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluc2VydCBhIHJ1bGUgaW50byBlbGVtZW50LlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdpbnNlcnRSdWxlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5zZXJ0UnVsZShydWxlLCBpbmRleCkge1xuICAgICAgdmFyIHNoZWV0ID0gdGhpcy5lbGVtZW50LnNoZWV0O1xuICAgICAgdmFyIGNzc1J1bGVzID0gc2hlZXQuY3NzUnVsZXM7XG5cbiAgICAgIHZhciBzdHIgPSBydWxlLnRvU3RyaW5nKCk7XG4gICAgICBpZiAoIWluZGV4KSBpbmRleCA9IGNzc1J1bGVzLmxlbmd0aDtcblxuICAgICAgaWYgKCFzdHIpIHJldHVybiBmYWxzZTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShzdHIsIGluZGV4KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAoMCwgX3dhcm5pbmcyWydkZWZhdWx0J10pKGZhbHNlLCAnW0pTU10gQ2FuIG5vdCBpbnNlcnQgYW4gdW5zdXBwb3J0ZWQgcnVsZSBcXG5cXHIlcycsIHJ1bGUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aGlzLmhhc0luc2VydGVkUnVsZXMgPSB0cnVlO1xuXG4gICAgICByZXR1cm4gY3NzUnVsZXNbaW5kZXhdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlbGV0ZSBhIHJ1bGUuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2RlbGV0ZVJ1bGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWxldGVSdWxlKGNzc1J1bGUpIHtcbiAgICAgIHZhciBzaGVldCA9IHRoaXMuZWxlbWVudC5zaGVldDtcblxuICAgICAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKGNzc1J1bGUpO1xuICAgICAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuIGZhbHNlO1xuICAgICAgc2hlZXQuZGVsZXRlUnVsZShpbmRleCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgaW5kZXggb2YgYSBDU1MgUnVsZS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnaW5kZXhPZicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluZGV4T2YoY3NzUnVsZSkge1xuICAgICAgdmFyIGNzc1J1bGVzID0gdGhpcy5lbGVtZW50LnNoZWV0LmNzc1J1bGVzO1xuXG4gICAgICBmb3IgKHZhciBfaW5kZXggPSAwOyBfaW5kZXggPCBjc3NSdWxlcy5sZW5ndGg7IF9pbmRleCsrKSB7XG4gICAgICAgIGlmIChjc3NSdWxlID09PSBjc3NSdWxlc1tfaW5kZXhdKSByZXR1cm4gX2luZGV4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIGEgbmV3IENTUyBydWxlIGFuZCByZXBsYWNlIHRoZSBleGlzdGluZyBvbmUuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3JlcGxhY2VSdWxlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVwbGFjZVJ1bGUoY3NzUnVsZSwgcnVsZSkge1xuICAgICAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKGNzc1J1bGUpO1xuICAgICAgdmFyIG5ld0Nzc1J1bGUgPSB0aGlzLmluc2VydFJ1bGUocnVsZSwgaW5kZXgpO1xuICAgICAgdGhpcy5lbGVtZW50LnNoZWV0LmRlbGV0ZVJ1bGUoaW5kZXgpO1xuICAgICAgcmV0dXJuIG5ld0Nzc1J1bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGFsbCBydWxlcyBlbGVtZW50cy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZ2V0UnVsZXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRSdWxlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuc2hlZXQuY3NzUnVsZXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIERvbVJlbmRlcmVyO1xufSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBEb21SZW5kZXJlcjsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qIGVzbGludC1kaXNhYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblxuLyoqXG4gKiBSZW5kZXJpbmcgYmFja2VuZCB0byBkbyBub3RoaW5nIGluIG5vZGVqcy5cbiAqL1xudmFyIFZpcnR1YWxSZW5kZXJlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gVmlydHVhbFJlbmRlcmVyKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBWaXJ0dWFsUmVuZGVyZXIpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFZpcnR1YWxSZW5kZXJlciwgW3tcbiAgICBrZXk6ICdzZXRQcm9wZXJ0eScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFByb3BlcnR5KCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0UHJvcGVydHlWYWx1ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFByb3BlcnR5VmFsdWUoKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVtb3ZlUHJvcGVydHknLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVQcm9wZXJ0eSgpIHt9XG4gIH0sIHtcbiAgICBrZXk6ICdzZXRTZWxlY3RvcicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdG9yKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0S2V5JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0S2V5KCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2F0dGFjaCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGF0dGFjaCgpIHt9XG4gIH0sIHtcbiAgICBrZXk6ICdkZXRhY2gnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXRhY2goKSB7fVxuICB9LCB7XG4gICAga2V5OiAnZGVwbG95JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVwbG95KCkge31cbiAgfSwge1xuICAgIGtleTogJ2luc2VydFJ1bGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbnNlcnRSdWxlKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2RlbGV0ZVJ1bGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWxldGVSdWxlKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVwbGFjZVJ1bGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXBsYWNlUnVsZSgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRSdWxlcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFJ1bGVzKCkge31cbiAgfSwge1xuICAgIGtleTogJ2luZGV4T2YnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbmRleE9mKCkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBWaXJ0dWFsUmVuZGVyZXI7XG59KCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFZpcnR1YWxSZW5kZXJlcjsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfUnVsZUxpc3QgPSByZXF1aXJlKCcuLi9SdWxlTGlzdCcpO1xuXG52YXIgX1J1bGVMaXN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1J1bGVMaXN0KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG4vKipcbiAqIENvbmRpdGlvbmFsIHJ1bGUgZm9yIEBtZWRpYSwgQHN1cHBvcnRzXG4gKi9cbnZhciBDb25kaXRpb25hbFJ1bGUgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENvbmRpdGlvbmFsUnVsZShrZXksIHN0eWxlcywgb3B0aW9ucykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb25kaXRpb25hbFJ1bGUpO1xuXG4gICAgdGhpcy50eXBlID0gJ2NvbmRpdGlvbmFsJztcbiAgICB0aGlzLmlzUHJvY2Vzc2VkID0gZmFsc2U7XG5cbiAgICB0aGlzLmtleSA9IGtleTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMucnVsZXMgPSBuZXcgX1J1bGVMaXN0MlsnZGVmYXVsdCddKF9leHRlbmRzKHt9LCBvcHRpb25zLCB7IHBhcmVudDogdGhpcyB9KSk7XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIHN0eWxlcykge1xuICAgICAgdGhpcy5ydWxlcy5hZGQobmFtZSwgc3R5bGVzW25hbWVdKTtcbiAgICB9XG5cbiAgICB0aGlzLnJ1bGVzLnByb2Nlc3MoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBydWxlLlxuICAgKi9cblxuXG4gIF9jcmVhdGVDbGFzcyhDb25kaXRpb25hbFJ1bGUsIFt7XG4gICAga2V5OiAnZ2V0UnVsZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFJ1bGUobmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMucnVsZXMuZ2V0KG5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBpbmRleCBvZiBhIHJ1bGUuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2luZGV4T2YnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbmRleE9mKHJ1bGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bGVzLmluZGV4T2YocnVsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCByZWdpc3RlciBydWxlLCBydW4gcGx1Z2lucy5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnYWRkUnVsZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFJ1bGUobmFtZSwgc3R5bGUsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBydWxlID0gdGhpcy5ydWxlcy5hZGQobmFtZSwgc3R5bGUsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5vcHRpb25zLmpzcy5wbHVnaW5zLm9uUHJvY2Vzc1J1bGUocnVsZSk7XG4gICAgICByZXR1cm4gcnVsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgYSBDU1Mgc3RyaW5nLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd0b1N0cmluZycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHsgaW5kZW50OiAxIH07XG5cbiAgICAgIHZhciBpbm5lciA9IHRoaXMucnVsZXMudG9TdHJpbmcob3B0aW9ucyk7XG4gICAgICByZXR1cm4gaW5uZXIgPyB0aGlzLmtleSArICcge1xcbicgKyBpbm5lciArICdcXG59JyA6ICcnO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDb25kaXRpb25hbFJ1bGU7XG59KCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IENvbmRpdGlvbmFsUnVsZTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfdG9Dc3MgPSByZXF1aXJlKCcuLi91dGlscy90b0NzcycpO1xuXG52YXIgX3RvQ3NzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RvQ3NzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgRm9udEZhY2VSdWxlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBGb250RmFjZVJ1bGUoa2V5LCBzdHlsZSwgb3B0aW9ucykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGb250RmFjZVJ1bGUpO1xuXG4gICAgdGhpcy50eXBlID0gJ2ZvbnQtZmFjZSc7XG4gICAgdGhpcy5pc1Byb2Nlc3NlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgdGhpcy5zdHlsZSA9IHN0eWxlO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgQ1NTIHN0cmluZy5cbiAgICovXG5cblxuICBfY3JlYXRlQ2xhc3MoRm9udEZhY2VSdWxlLCBbe1xuICAgIGtleTogJ3RvU3RyaW5nJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcob3B0aW9ucykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zdHlsZSkpIHtcbiAgICAgICAgdmFyIHN0ciA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5zdHlsZS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBzdHIgKz0gKDAsIF90b0NzczJbJ2RlZmF1bHQnXSkodGhpcy5rZXksIHRoaXMuc3R5bGVbaW5kZXhdKTtcbiAgICAgICAgICBpZiAodGhpcy5zdHlsZVtpbmRleCArIDFdKSBzdHIgKz0gJ1xcbic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICgwLCBfdG9Dc3MyWydkZWZhdWx0J10pKHRoaXMua2V5LCB0aGlzLnN0eWxlLCBvcHRpb25zKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRm9udEZhY2VSdWxlO1xufSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBGb250RmFjZVJ1bGU7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX1J1bGVMaXN0ID0gcmVxdWlyZSgnLi4vUnVsZUxpc3QnKTtcblxudmFyIF9SdWxlTGlzdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9SdWxlTGlzdCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXG4gKiBSdWxlIGZvciBAa2V5ZnJhbWVzXG4gKi9cbnZhciBLZXlmcmFtZXNSdWxlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBLZXlmcmFtZXNSdWxlKGtleSwgZnJhbWVzLCBvcHRpb25zKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEtleWZyYW1lc1J1bGUpO1xuXG4gICAgdGhpcy50eXBlID0gJ2tleWZyYW1lcyc7XG4gICAgdGhpcy5pc1Byb2Nlc3NlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnJ1bGVzID0gbmV3IF9SdWxlTGlzdDJbJ2RlZmF1bHQnXShfZXh0ZW5kcyh7fSwgb3B0aW9ucywgeyBwYXJlbnQ6IHRoaXMgfSkpO1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiBmcmFtZXMpIHtcbiAgICAgIHRoaXMucnVsZXMuYWRkKG5hbWUsIGZyYW1lc1tuYW1lXSwgX2V4dGVuZHMoe30sIHRoaXMub3B0aW9ucywge1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIHNlbGVjdG9yOiBuYW1lXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgdGhpcy5ydWxlcy5wcm9jZXNzKCk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgQ1NTIHN0cmluZy5cbiAgICovXG5cblxuICBfY3JlYXRlQ2xhc3MoS2V5ZnJhbWVzUnVsZSwgW3tcbiAgICBrZXk6ICd0b1N0cmluZycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHsgaW5kZW50OiAxIH07XG5cbiAgICAgIHZhciBpbm5lciA9IHRoaXMucnVsZXMudG9TdHJpbmcob3B0aW9ucyk7XG4gICAgICBpZiAoaW5uZXIpIGlubmVyICs9ICdcXG4nO1xuICAgICAgcmV0dXJuIHRoaXMua2V5ICsgJyB7XFxuJyArIGlubmVyICsgJ30nO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBLZXlmcmFtZXNSdWxlO1xufSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBLZXlmcmFtZXNSdWxlOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFNpbXBsZVJ1bGUgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNpbXBsZVJ1bGUoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTaW1wbGVSdWxlKTtcblxuICAgIHRoaXMudHlwZSA9ICdzaW1wbGUnO1xuICAgIHRoaXMuaXNQcm9jZXNzZWQgPSBmYWxzZTtcblxuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIENTUyBzdHJpbmcuXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcblxuXG4gIF9jcmVhdGVDbGFzcyhTaW1wbGVSdWxlLCBbe1xuICAgIGtleTogJ3RvU3RyaW5nJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcob3B0aW9ucykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy52YWx1ZSkpIHtcbiAgICAgICAgdmFyIHN0ciA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy52YWx1ZS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBzdHIgKz0gdGhpcy5rZXkgKyAnICcgKyB0aGlzLnZhbHVlW2luZGV4XSArICc7JztcbiAgICAgICAgICBpZiAodGhpcy52YWx1ZVtpbmRleCArIDFdKSBzdHIgKz0gJ1xcbic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMua2V5ICsgJyAnICsgdGhpcy52YWx1ZSArICc7JztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU2ltcGxlUnVsZTtcbn0oKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gU2ltcGxlUnVsZTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF93YXJuaW5nID0gcmVxdWlyZSgnd2FybmluZycpO1xuXG52YXIgX3dhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2FybmluZyk7XG5cbnZhciBfdG9Dc3MgPSByZXF1aXJlKCcuLi91dGlscy90b0NzcycpO1xuXG52YXIgX3RvQ3NzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RvQ3NzKTtcblxudmFyIF90b0Nzc1ZhbHVlID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9Dc3NWYWx1ZScpO1xuXG52YXIgX3RvQ3NzVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdG9Dc3NWYWx1ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFN0eWxlUnVsZSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3R5bGVSdWxlKGtleSwgc3R5bGUsIG9wdGlvbnMpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU3R5bGVSdWxlKTtcblxuICAgIHRoaXMudHlwZSA9ICdzdHlsZSc7XG4gICAgdGhpcy5pc1Byb2Nlc3NlZCA9IGZhbHNlO1xuICAgIHZhciBzaGVldCA9IG9wdGlvbnMuc2hlZXQsXG4gICAgICAgIFJlbmRlcmVyID0gb3B0aW9ucy5SZW5kZXJlcixcbiAgICAgICAgc2VsZWN0b3IgPSBvcHRpb25zLnNlbGVjdG9yO1xuXG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnN0eWxlID0gc3R5bGU7XG4gICAgaWYgKHNlbGVjdG9yKSB0aGlzLnNlbGVjdG9yVGV4dCA9IHNlbGVjdG9yO1xuICAgIHRoaXMucmVuZGVyZXIgPSBzaGVldCA/IHNoZWV0LnJlbmRlcmVyIDogbmV3IFJlbmRlcmVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHNlbGVjdG9yIHN0cmluZy5cbiAgICogQXR0ZW50aW9uOiB1c2UgdGhpcyB3aXRoIGNhdXRpb24uIE1vc3QgYnJvd3NlcnMgZGlkbid0IGltcGxlbWVudFxuICAgKiBzZWxlY3RvclRleHQgc2V0dGVyLCBzbyB0aGlzIG1heSByZXN1bHQgaW4gcmVyZW5kZXJpbmcgb2YgZW50aXJlIFN0eWxlIFNoZWV0LlxuICAgKi9cblxuXG4gIF9jcmVhdGVDbGFzcyhTdHlsZVJ1bGUsIFt7XG4gICAga2V5OiAncHJvcCcsXG5cblxuICAgIC8qKlxuICAgICAqIEdldCBvciBzZXQgYSBzdHlsZSBwcm9wZXJ0eS5cbiAgICAgKi9cbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJvcChuYW1lLCB2YWx1ZSkge1xuICAgICAgLy8gSXQncyBhIGdldHRlci5cbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5zdHlsZVtuYW1lXTtcblxuICAgICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgdGhlIHZhbHVlIGhhcyBub3QgY2hhbmdlZC5cbiAgICAgIGlmICh0aGlzLnN0eWxlW25hbWVdID09PSB2YWx1ZSkgcmV0dXJuIHRoaXM7XG5cbiAgICAgIHZhbHVlID0gdGhpcy5vcHRpb25zLmpzcy5wbHVnaW5zLm9uQ2hhbmdlVmFsdWUodmFsdWUsIG5hbWUsIHRoaXMpO1xuXG4gICAgICB2YXIgaXNFbXB0eSA9IHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09IGZhbHNlO1xuICAgICAgdmFyIGlzRGVmaW5lZCA9IG5hbWUgaW4gdGhpcy5zdHlsZTtcblxuICAgICAgLy8gVmFsdWUgaXMgZW1wdHkgYW5kIHdhc24ndCBkZWZpbmVkIGJlZm9yZS5cbiAgICAgIGlmIChpc0VtcHR5ICYmICFpc0RlZmluZWQpIHJldHVybiB0aGlzO1xuXG4gICAgICAvLyBXZSBhcmUgZ29pbmcgdG8gcmVtb3ZlIHRoaXMgdmFsdWUuXG4gICAgICB2YXIgcmVtb3ZlID0gaXNFbXB0eSAmJiBpc0RlZmluZWQ7XG5cbiAgICAgIGlmIChyZW1vdmUpIGRlbGV0ZSB0aGlzLnN0eWxlW25hbWVdO2Vsc2UgdGhpcy5zdHlsZVtuYW1lXSA9IHZhbHVlO1xuXG4gICAgICAvLyBSZW5kZXJhYmxlIGlzIGRlZmluZWQgaWYgU3R5bGVTaGVldCBvcHRpb24gYGxpbmtgIGlzIHRydWUuXG4gICAgICBpZiAodGhpcy5yZW5kZXJhYmxlKSB7XG4gICAgICAgIGlmIChyZW1vdmUpIHRoaXMucmVuZGVyZXIucmVtb3ZlUHJvcGVydHkodGhpcy5yZW5kZXJhYmxlLCBuYW1lKTtlbHNlIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5yZW5kZXJhYmxlLCBuYW1lLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2hlZXQgPSB0aGlzLm9wdGlvbnMuc2hlZXQ7XG5cbiAgICAgIGlmIChzaGVldCAmJiBzaGVldC5hdHRhY2hlZCkge1xuICAgICAgICAoMCwgX3dhcm5pbmcyWydkZWZhdWx0J10pKGZhbHNlLCAnUnVsZSBpcyBub3QgbGlua2VkLiBNaXNzaW5nIHNoZWV0IG9wdGlvbiBcImxpbms6IHRydWVcIi4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGx5IHJ1bGUgdG8gYW4gZWxlbWVudCBpbmxpbmUuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ2FwcGx5VG8nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhcHBseVRvKHJlbmRlcmFibGUpIHtcbiAgICAgIHZhciBqc29uID0gdGhpcy50b0pTT04oKTtcbiAgICAgIGZvciAodmFyIHByb3AgaW4ganNvbikge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHJlbmRlcmFibGUsIHByb3AsIGpzb25bcHJvcF0pO1xuICAgICAgfXJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgcnVsZS5cbiAgICAgKiBGYWxsYmFja3MgYXJlIG5vdCBzdXBwb3J0ZWQuXG4gICAgICogVXNlZnVsIGZvciBpbmxpbmUgc3R5bGVzLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd0b0pTT04nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgICB2YXIganNvbiA9IHt9O1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiB0aGlzLnN0eWxlKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuc3R5bGVbcHJvcF07XG4gICAgICAgIGlmICgodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih2YWx1ZSkpICE9PSAnb2JqZWN0JykganNvbltwcm9wXSA9IHZhbHVlO2Vsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSBqc29uW3Byb3BdID0gKDAsIF90b0Nzc1ZhbHVlMlsnZGVmYXVsdCddKSh2YWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4ganNvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgYSBDU1Mgc3RyaW5nLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICd0b1N0cmluZycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzaGVldCA9IHRoaXMub3B0aW9ucy5zaGVldDtcblxuICAgICAgdmFyIGxpbmsgPSBzaGVldCA/IHNoZWV0Lm9wdGlvbnMubGluayA6IGZhbHNlO1xuICAgICAgdmFyIG9wdHMgPSBsaW5rID8gX2V4dGVuZHMoe30sIG9wdGlvbnMsIHsgYWxsb3dFbXB0eTogdHJ1ZSB9KSA6IG9wdGlvbnM7XG4gICAgICByZXR1cm4gKDAsIF90b0NzczJbJ2RlZmF1bHQnXSkodGhpcy5zZWxlY3RvciwgdGhpcy5zdHlsZSwgb3B0cyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2VsZWN0b3InLFxuICAgIHNldDogZnVuY3Rpb24gc2V0KHNlbGVjdG9yKSB7XG4gICAgICBpZiAoc2VsZWN0b3IgPT09IHRoaXMuc2VsZWN0b3JUZXh0KSByZXR1cm47XG5cbiAgICAgIHRoaXMuc2VsZWN0b3JUZXh0ID0gc2VsZWN0b3I7XG5cbiAgICAgIGlmICghdGhpcy5yZW5kZXJhYmxlKSByZXR1cm47XG5cbiAgICAgIHZhciBoYXNDaGFuZ2VkID0gdGhpcy5yZW5kZXJlci5zZXRTZWxlY3Rvcih0aGlzLnJlbmRlcmFibGUsIHNlbGVjdG9yKTtcblxuICAgICAgLy8gSWYgc2VsZWN0b3Igc2V0dGVyIGlzIG5vdCBpbXBsZW1lbnRlZCwgcmVyZW5kZXIgdGhlIHJ1bGUuXG4gICAgICBpZiAoIWhhc0NoYW5nZWQgJiYgdGhpcy5yZW5kZXJhYmxlKSB7XG4gICAgICAgIHZhciByZW5kZXJhYmxlID0gdGhpcy5yZW5kZXJlci5yZXBsYWNlUnVsZSh0aGlzLnJlbmRlcmFibGUsIHRoaXMpO1xuICAgICAgICBpZiAocmVuZGVyYWJsZSkgdGhpcy5yZW5kZXJhYmxlID0gcmVuZGVyYWJsZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc2VsZWN0b3Igc3RyaW5nLlxuICAgICAqL1xuICAgICxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdG9yVGV4dDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU3R5bGVSdWxlO1xufSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBTdHlsZVJ1bGU7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3RvQ3NzID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9Dc3MnKTtcblxudmFyIF90b0NzczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90b0Nzcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFZpZXdwb3J0UnVsZSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gVmlld3BvcnRSdWxlKGtleSwgc3R5bGUsIG9wdGlvbnMpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVmlld3BvcnRSdWxlKTtcblxuICAgIHRoaXMudHlwZSA9ICd2aWV3cG9ydCc7XG4gICAgdGhpcy5pc1Byb2Nlc3NlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgdGhpcy5zdHlsZSA9IHN0eWxlO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgQ1NTIHN0cmluZy5cbiAgICovXG5cblxuICBfY3JlYXRlQ2xhc3MoVmlld3BvcnRSdWxlLCBbe1xuICAgIGtleTogJ3RvU3RyaW5nJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcob3B0aW9ucykge1xuICAgICAgcmV0dXJuICgwLCBfdG9Dc3MyWydkZWZhdWx0J10pKHRoaXMua2V5LCB0aGlzLnN0eWxlLCBvcHRpb25zKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gVmlld3BvcnRSdWxlO1xufSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBWaWV3cG9ydFJ1bGU7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1NoZWV0c1JlZ2lzdHJ5ID0gcmVxdWlyZSgnLi9TaGVldHNSZWdpc3RyeScpO1xuXG52YXIgX1NoZWV0c1JlZ2lzdHJ5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1NoZWV0c1JlZ2lzdHJ5KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG4vKipcbiAqIFRoaXMgaXMgYSBnbG9iYWwgc2hlZXRzIHJlZ2lzdHJ5LiBPbmx5IERvbVJlbmRlcmVyIHdpbGwgYWRkIHNoZWV0cyB0byBpdC5cbiAqIE9uIHRoZSBzZXJ2ZXIgb25lIHNob3VsZCB1c2UgYW4gb3duIFNoZWV0c1JlZ2lzdHJ5IGluc3RhbmNlIGFuZCBhZGQgdGhlXG4gKiBzaGVldHMgdG8gaXQsIGJlY2F1c2UgeW91IG5lZWQgdG8gbWFrZSBzdXJlIHRvIGNyZWF0ZSBhIG5ldyByZWdpc3RyeSBmb3JcbiAqIGVhY2ggcmVxdWVzdCBpbiBvcmRlciB0byBub3QgbGVhayBzaGVldHMgYWNyb3NzIHJlcXVlc3RzLlxuICovXG5leHBvcnRzWydkZWZhdWx0J10gPSBuZXcgX1NoZWV0c1JlZ2lzdHJ5MlsnZGVmYXVsdCddKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGNsb25lU3R5bGU7XG5cbnZhciBfaXNPYnNlcnZhYmxlID0gcmVxdWlyZSgnLi9pc09ic2VydmFibGUnKTtcblxudmFyIF9pc09ic2VydmFibGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNPYnNlcnZhYmxlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5mdW5jdGlvbiBjbG9uZVN0eWxlKHN0eWxlKSB7XG4gIC8vIFN1cHBvcnQgZW1wdHkgdmFsdWVzIGluIGNhc2UgdXNlciBlbmRzIHVwIHdpdGggdGhlbSBieSBhY2NpZGVudC5cbiAgaWYgKHN0eWxlID09IG51bGwpIHJldHVybiBzdHlsZTtcblxuICAvLyBTdXBwb3J0IHN0cmluZyB2YWx1ZSBmb3IgU2ltcGxlUnVsZS5cbiAgdmFyIHR5cGVPZlN0eWxlID0gdHlwZW9mIHN0eWxlID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihzdHlsZSk7XG5cbiAgaWYgKHR5cGVPZlN0eWxlID09PSAnc3RyaW5nJyB8fCB0eXBlT2ZTdHlsZSA9PT0gJ251bWJlcicgfHwgdHlwZU9mU3R5bGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gc3R5bGU7XG4gIH1cblxuICAvLyBTdXBwb3J0IGFycmF5IGZvciBGb250RmFjZVJ1bGUuXG4gIGlmIChpc0FycmF5KHN0eWxlKSkgcmV0dXJuIHN0eWxlLm1hcChjbG9uZVN0eWxlKTtcblxuICAvLyBTdXBwb3J0IE9ic2VydmFibGUgc3R5bGVzLiAgT2JzZXJ2YWJsZXMgYXJlIGltbXV0YWJsZSwgc28gd2UgZG9uJ3QgbmVlZCB0b1xuICAvLyBjb3B5IHRoZW0uXG4gIGlmICgoMCwgX2lzT2JzZXJ2YWJsZTJbJ2RlZmF1bHQnXSkoc3R5bGUpKSByZXR1cm4gc3R5bGU7XG5cbiAgdmFyIG5ld1N0eWxlID0ge307XG4gIGZvciAodmFyIG5hbWUgaW4gc3R5bGUpIHtcbiAgICB2YXIgdmFsdWUgPSBzdHlsZVtuYW1lXTtcbiAgICBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YodmFsdWUpKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG5ld1N0eWxlW25hbWVdID0gY2xvbmVTdHlsZSh2YWx1ZSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgbmV3U3R5bGVbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBuZXdTdHlsZTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJ3dhcm5pbmcnKTtcblxudmFyIF93YXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dhcm5pbmcpO1xuXG52YXIgX1N0eWxlU2hlZXQgPSByZXF1aXJlKCcuLi9TdHlsZVNoZWV0Jyk7XG5cbnZhciBfU3R5bGVTaGVldDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TdHlsZVNoZWV0KTtcblxudmFyIF9tb2R1bGVJZCA9IHJlcXVpcmUoJy4vbW9kdWxlSWQnKTtcblxudmFyIF9tb2R1bGVJZDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tb2R1bGVJZCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIG1heFJ1bGVzID0gMWUxMDtcblxuXG52YXIgZW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlY7XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoIGdlbmVyYXRlcyB1bmlxdWUgY2xhc3MgbmFtZXMgYmFzZWQgb24gY291bnRlcnMuXG4gKiBXaGVuIG5ldyBnZW5lcmF0b3IgZnVuY3Rpb24gaXMgY3JlYXRlZCwgcnVsZSBjb3VudGVyIGlzIHJlc2V0ZWQuXG4gKiBXZSBuZWVkIHRvIHJlc2V0IHRoZSBydWxlIGNvdW50ZXIgZm9yIFNTUiBmb3IgZWFjaCByZXF1ZXN0LlxuICovXG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJ1bGVDb3VudGVyID0gMDtcbiAgdmFyIGRlZmF1bHRQcmVmaXggPSBlbnYgPT09ICdwcm9kdWN0aW9uJyA/ICdjJyA6ICcnO1xuXG4gIHJldHVybiBmdW5jdGlvbiAocnVsZSwgc2hlZXQpIHtcbiAgICBydWxlQ291bnRlciArPSAxO1xuXG4gICAgaWYgKHJ1bGVDb3VudGVyID4gbWF4UnVsZXMpIHtcbiAgICAgICgwLCBfd2FybmluZzJbJ2RlZmF1bHQnXSkoZmFsc2UsICdbSlNTXSBZb3UgbWlnaHQgaGF2ZSBhIG1lbW9yeSBsZWFrLiBSdWxlIGNvdW50ZXIgaXMgYXQgJXMuJywgcnVsZUNvdW50ZXIpO1xuICAgIH1cblxuICAgIHZhciBwcmVmaXggPSBkZWZhdWx0UHJlZml4O1xuICAgIHZhciBqc3NJZCA9ICcnO1xuXG4gICAgaWYgKHNoZWV0KSB7XG4gICAgICBwcmVmaXggPSBzaGVldC5vcHRpb25zLmNsYXNzTmFtZVByZWZpeCB8fCBkZWZhdWx0UHJlZml4O1xuICAgICAgaWYgKHNoZWV0Lm9wdGlvbnMuanNzLmlkICE9IG51bGwpIGpzc0lkICs9IHNoZWV0Lm9wdGlvbnMuanNzLmlkO1xuICAgIH1cblxuICAgIGlmIChlbnYgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgcmV0dXJuICcnICsgcHJlZml4ICsgX21vZHVsZUlkMlsnZGVmYXVsdCddICsganNzSWQgKyBydWxlQ291bnRlcjtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJlZml4ICsgcnVsZS5rZXkgKyAnLScgKyBfbW9kdWxlSWQyWydkZWZhdWx0J10gKyAoanNzSWQgJiYgJy0nICsganNzSWQpICsgJy0nICsgcnVsZUNvdW50ZXI7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGNyZWF0ZVJ1bGU7XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJ3dhcm5pbmcnKTtcblxudmFyIF93YXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dhcm5pbmcpO1xuXG52YXIgX1N0eWxlUnVsZSA9IHJlcXVpcmUoJy4uL3J1bGVzL1N0eWxlUnVsZScpO1xuXG52YXIgX1N0eWxlUnVsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TdHlsZVJ1bGUpO1xuXG52YXIgX2Nsb25lU3R5bGUgPSByZXF1aXJlKCcuLi91dGlscy9jbG9uZVN0eWxlJyk7XG5cbnZhciBfY2xvbmVTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbG9uZVN0eWxlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG4vKipcbiAqIENyZWF0ZSBhIHJ1bGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVJ1bGUoKSB7XG4gIHZhciBuYW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAndW5uYW1lZCc7XG4gIHZhciBkZWNsID0gYXJndW1lbnRzWzFdO1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50c1syXTtcbiAgdmFyIGpzcyA9IG9wdGlvbnMuanNzO1xuXG4gIHZhciBkZWNsQ29weSA9ICgwLCBfY2xvbmVTdHlsZTJbJ2RlZmF1bHQnXSkoZGVjbCk7XG5cbiAgdmFyIHJ1bGUgPSBqc3MucGx1Z2lucy5vbkNyZWF0ZVJ1bGUobmFtZSwgZGVjbENvcHksIG9wdGlvbnMpO1xuICBpZiAocnVsZSkgcmV0dXJuIHJ1bGU7XG5cbiAgLy8gSXQgaXMgYW4gYXQtcnVsZSBhbmQgaXQgaGFzIG5vIGluc3RhbmNlLlxuICBpZiAobmFtZVswXSA9PT0gJ0AnKSB7XG4gICAgKDAsIF93YXJuaW5nMlsnZGVmYXVsdCddKShmYWxzZSwgJ1tKU1NdIFVua25vd24gYXQtcnVsZSAlcycsIG5hbWUpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBfU3R5bGVSdWxlMlsnZGVmYXVsdCddKG5hbWUsIGRlY2xDb3B5LCBvcHRpb25zKTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgQ1NTID0gZ2xvYmFsLkNTUztcblxudmFyIGVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WO1xuXG52YXIgZXNjYXBlUmVnZXggPSAvKFtbXFxdLiMqJD48K349fF46KCksXCInYF0pL2c7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgLy8gV2UgZG9uJ3QgbmVlZCB0byBlc2NhcGUgaXQgaW4gcHJvZHVjdGlvbiwgYmVjYXVzZSB3ZSBhcmUgbm90IHVzaW5nIHVzZXInc1xuICAvLyBpbnB1dCBmb3Igc2VsZWN0b3JzLCB3ZSBhcmUgZ2VuZXJhdGluZyBhIHZhbGlkIHNlbGVjdG9yLlxuICBpZiAoZW52ID09PSAncHJvZHVjdGlvbicpIHJldHVybiBzdHI7XG5cbiAgaWYgKCFDU1MgfHwgIUNTUy5lc2NhcGUpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoZXNjYXBlUmVnZXgsICdcXFxcJDEnKTtcbiAgfVxuXG4gIHJldHVybiBDU1MuZXNjYXBlKHN0cik7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBnZXREeW5hbWljU3R5bGVzO1xuLyoqXG4gKiBFeHRyYWN0cyBhIHN0eWxlcyBvYmplY3Qgd2l0aCBvbmx5IHByb3BzIHRoYXQgY29udGFpbiBmdW5jdGlvbiB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGdldER5bmFtaWNTdHlsZXMoc3R5bGVzKSB7XG4gIHZhciB0byA9IG51bGw7XG5cbiAgZm9yICh2YXIga2V5IGluIHN0eWxlcykge1xuICAgIHZhciB2YWx1ZSA9IHN0eWxlc1trZXldO1xuICAgIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih2YWx1ZSk7XG5cbiAgICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKCF0bykgdG8gPSB7fTtcbiAgICAgIHRvW2tleV0gPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdmFyIGV4dHJhY3RlZCA9IGdldER5bmFtaWNTdHlsZXModmFsdWUpO1xuICAgICAgaWYgKGV4dHJhY3RlZCkge1xuICAgICAgICBpZiAoIXRvKSB0byA9IHt9O1xuICAgICAgICB0b1trZXldID0gZXh0cmFjdGVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0bztcbn0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfc3ltYm9sT2JzZXJ2YWJsZSA9IHJlcXVpcmUoJ3N5bWJvbC1vYnNlcnZhYmxlJyk7XG5cbnZhciBfc3ltYm9sT2JzZXJ2YWJsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zeW1ib2xPYnNlcnZhYmxlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5leHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHZhbHVlW19zeW1ib2xPYnNlcnZhYmxlMlsnZGVmYXVsdCddXSAmJiB2YWx1ZSA9PT0gdmFsdWVbX3N5bWJvbE9ic2VydmFibGUyWydkZWZhdWx0J11dKCk7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBsaW5rUnVsZTtcbi8qKlxuICogTGluayBydWxlIHdpdGggQ1NTU3R5bGVSdWxlIGFuZCBuZXN0ZWQgcnVsZXMgd2l0aCBjb3JyZXNwb25kaW5nIG5lc3RlZCBjc3NSdWxlcyBpZiBib3RoIGV4aXN0cy5cbiAqL1xuZnVuY3Rpb24gbGlua1J1bGUocnVsZSwgY3NzUnVsZSkge1xuICBydWxlLnJlbmRlcmFibGUgPSBjc3NSdWxlO1xuICBpZiAocnVsZS5ydWxlcyAmJiBjc3NSdWxlLmNzc1J1bGVzKSBydWxlLnJ1bGVzLmxpbmsoY3NzUnVsZS5jc3NSdWxlcyk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIG5zID0gJzJmMWFjYzZjM2E2MDZiMDgyZTVlZWY1ZTU0NDE0ZmZiJztcbmlmIChnbG9iYWxbbnNdID09IG51bGwpIGdsb2JhbFtuc10gPSAwO1xuXG4vLyBCdW5kbGUgbWF5IGNvbnRhaW4gbXVsdGlwbGUgSlNTIHZlcnNpb25zIGF0IHRoZSBzYW1lIHRpbWUuIEluIG9yZGVyIHRvIGlkZW50aWZ5XG4vLyB0aGUgY3VycmVudCB2ZXJzaW9uIHdpdGgganVzdCBvbmUgc2hvcnQgbnVtYmVyIGFuZCB1c2UgaXQgZm9yIGNsYXNzZXMgZ2VuZXJhdGlvblxuLy8gd2UgdXNlIGEgY291bnRlci4gQWxzbyBpdCBpcyBtb3JlIGFjY3VyYXRlLCBiZWNhdXNlIHVzZXIgY2FuIG1hbnVhbGx5IHJlZXZhbHVhdGVcbi8vIHRoZSBtb2R1bGUuXG5leHBvcnRzWydkZWZhdWx0J10gPSBnbG9iYWxbbnNdKys7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gdG9Dc3M7XG5cbnZhciBfdG9Dc3NWYWx1ZSA9IHJlcXVpcmUoJy4vdG9Dc3NWYWx1ZScpO1xuXG52YXIgX3RvQ3NzVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdG9Dc3NWYWx1ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuLyoqXG4gKiBJbmRlbnQgYSBzdHJpbmcuXG4gKiBodHRwOi8vanNwZXJmLmNvbS9hcnJheS1qb2luLXZzLWZvclxuICovXG5mdW5jdGlvbiBpbmRlbnRTdHIoc3RyLCBpbmRlbnQpIHtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgaW5kZW50OyBpbmRleCsrKSB7XG4gICAgcmVzdWx0ICs9ICcgICc7XG4gIH1yZXR1cm4gcmVzdWx0ICsgc3RyO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgUnVsZSB0byBDU1Mgc3RyaW5nLlxuICovXG5cbmZ1bmN0aW9uIHRvQ3NzKHNlbGVjdG9yLCBzdHlsZSkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cbiAgdmFyIHJlc3VsdCA9ICcnO1xuXG4gIGlmICghc3R5bGUpIHJldHVybiByZXN1bHQ7XG5cbiAgdmFyIF9vcHRpb25zJGluZGVudCA9IG9wdGlvbnMuaW5kZW50LFxuICAgICAgaW5kZW50ID0gX29wdGlvbnMkaW5kZW50ID09PSB1bmRlZmluZWQgPyAwIDogX29wdGlvbnMkaW5kZW50O1xuICB2YXIgZmFsbGJhY2tzID0gc3R5bGUuZmFsbGJhY2tzO1xuXG5cbiAgaW5kZW50Kys7XG5cbiAgLy8gQXBwbHkgZmFsbGJhY2tzIGZpcnN0LlxuICBpZiAoZmFsbGJhY2tzKSB7XG4gICAgLy8gQXJyYXkgc3ludGF4IHtmYWxsYmFja3M6IFt7cHJvcDogdmFsdWV9XX1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShmYWxsYmFja3MpKSB7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgZmFsbGJhY2tzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgZmFsbGJhY2sgPSBmYWxsYmFja3NbaW5kZXhdO1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIGZhbGxiYWNrKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gZmFsbGJhY2tbcHJvcF07XG4gICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSAnXFxuJyArIGluZGVudFN0cihwcm9wICsgJzogJyArICgwLCBfdG9Dc3NWYWx1ZTJbJ2RlZmF1bHQnXSkodmFsdWUpICsgJzsnLCBpbmRlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPYmplY3Qgc3ludGF4IHtmYWxsYmFja3M6IHtwcm9wOiB2YWx1ZX19XG4gICAgICBmb3IgKHZhciBfcHJvcCBpbiBmYWxsYmFja3MpIHtcbiAgICAgICAgdmFyIF92YWx1ZSA9IGZhbGxiYWNrc1tfcHJvcF07XG4gICAgICAgIGlmIChfdmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdCArPSAnXFxuJyArIGluZGVudFN0cihfcHJvcCArICc6ICcgKyAoMCwgX3RvQ3NzVmFsdWUyWydkZWZhdWx0J10pKF92YWx1ZSkgKyAnOycsIGluZGVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBfcHJvcDIgaW4gc3R5bGUpIHtcbiAgICB2YXIgX3ZhbHVlMiA9IHN0eWxlW19wcm9wMl07XG4gICAgaWYgKF92YWx1ZTIgIT0gbnVsbCAmJiBfcHJvcDIgIT09ICdmYWxsYmFja3MnKSB7XG4gICAgICByZXN1bHQgKz0gJ1xcbicgKyBpbmRlbnRTdHIoX3Byb3AyICsgJzogJyArICgwLCBfdG9Dc3NWYWx1ZTJbJ2RlZmF1bHQnXSkoX3ZhbHVlMikgKyAnOycsIGluZGVudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWxsb3cgZW1wdHkgc3R5bGUgaW4gdGhpcyBjYXNlLCBiZWNhdXNlIHByb3BlcnRpZXMgd2lsbCBiZSBhZGRlZCBkeW5hbWljYWxseS5cbiAgaWYgKCFyZXN1bHQgJiYgIW9wdGlvbnMuYWxsb3dFbXB0eSkgcmV0dXJuIHJlc3VsdDtcblxuICBpbmRlbnQtLTtcbiAgcmVzdWx0ID0gaW5kZW50U3RyKHNlbGVjdG9yICsgJyB7JyArIHJlc3VsdCArICdcXG4nLCBpbmRlbnQpICsgaW5kZW50U3RyKCd9JywgaW5kZW50KTtcblxuICByZXR1cm4gcmVzdWx0O1xufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHRvQ3NzVmFsdWU7XG52YXIgam9pbiA9IGZ1bmN0aW9uIGpvaW4odmFsdWUsIGJ5KSB7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgIC8vIFJlbW92ZSAhaW1wb3J0YW50IGZyb20gdGhlIHZhbHVlLCBpdCB3aWxsIGJlIHJlYWRkZWQgbGF0ZXIuXG4gICAgaWYgKHZhbHVlW2ldID09PSAnIWltcG9ydGFudCcpIGJyZWFrO1xuICAgIGlmIChyZXN1bHQpIHJlc3VsdCArPSBieTtcbiAgICByZXN1bHQgKz0gdmFsdWVbaV07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQ29udmVydHMgYXJyYXkgdmFsdWVzIHRvIHN0cmluZy5cbiAqXG4gKiBgbWFyZ2luOiBbWyc1cHgnLCAnMTBweCddXWAgPiBgbWFyZ2luOiA1cHggMTBweDtgXG4gKiBgYm9yZGVyOiBbJzFweCcsICcycHgnXWAgPiBgYm9yZGVyOiAxcHgsIDJweDtgXG4gKiBgbWFyZ2luOiBbWyc1cHgnLCAnMTBweCddLCAnIWltcG9ydGFudCddYCA+IGBtYXJnaW46IDVweCAxMHB4ICFpbXBvcnRhbnQ7YFxuICogYGNvbG9yOiBbJ3JlZCcsICFpbXBvcnRhbnRdYCA+IGBjb2xvcjogcmVkICFpbXBvcnRhbnQ7YFxuICovXG5mdW5jdGlvbiB0b0Nzc1ZhbHVlKHZhbHVlKSB7XG4gIHZhciBpZ25vcmVJbXBvcnRhbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuXG4gIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcblxuICB2YXIgY3NzVmFsdWUgPSAnJztcblxuICAvLyBTdXBwb3J0IHNwYWNlIHNlcGFyYXRlZCB2YWx1ZXMgdmlhIGBbWyc1cHgnLCAnMTBweCddXWAuXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlWzBdKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZVtpXSA9PT0gJyFpbXBvcnRhbnQnKSBicmVhaztcbiAgICAgIGlmIChjc3NWYWx1ZSkgY3NzVmFsdWUgKz0gJywgJztcbiAgICAgIGNzc1ZhbHVlICs9IGpvaW4odmFsdWVbaV0sICcgJyk7XG4gICAgfVxuICB9IGVsc2UgY3NzVmFsdWUgPSBqb2luKHZhbHVlLCAnLCAnKTtcblxuICAvLyBBZGQgIWltcG9ydGFudCwgYmVjYXVzZSBpdCB3YXMgaWdub3JlZC5cbiAgaWYgKCFpZ25vcmVJbXBvcnRhbnQgJiYgdmFsdWVbdmFsdWUubGVuZ3RoIC0gMV0gPT09ICchaW1wb3J0YW50Jykge1xuICAgIGNzc1ZhbHVlICs9ICcgIWltcG9ydGFudCc7XG4gIH1cblxuICByZXR1cm4gY3NzVmFsdWU7XG59IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9wb255ZmlsbCA9IHJlcXVpcmUoJy4vcG9ueWZpbGwuanMnKTtcblxudmFyIF9wb255ZmlsbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wb255ZmlsbCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIHJvb3Q7IC8qIGdsb2JhbCB3aW5kb3cgKi9cblxuXG5pZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gIHJvb3QgPSBzZWxmO1xufSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICByb290ID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICByb290ID0gZ2xvYmFsO1xufSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICByb290ID0gbW9kdWxlO1xufSBlbHNlIHtcbiAgcm9vdCA9IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG59XG5cbnZhciByZXN1bHQgPSAoMCwgX3BvbnlmaWxsMlsnZGVmYXVsdCddKShyb290KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHJlc3VsdDsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBzeW1ib2xPYnNlcnZhYmxlUG9ueWZpbGw7XG5mdW5jdGlvbiBzeW1ib2xPYnNlcnZhYmxlUG9ueWZpbGwocm9vdCkge1xuXHR2YXIgcmVzdWx0O1xuXHR2YXIgX1N5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5cdGlmICh0eXBlb2YgX1N5bWJvbCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGlmIChfU3ltYm9sLm9ic2VydmFibGUpIHtcblx0XHRcdHJlc3VsdCA9IF9TeW1ib2wub2JzZXJ2YWJsZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gX1N5bWJvbCgnb2JzZXJ2YWJsZScpO1xuXHRcdFx0X1N5bWJvbC5vYnNlcnZhYmxlID0gcmVzdWx0O1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXN1bHQgPSAnQEBvYnNlcnZhYmxlJztcblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzUHJvZHVjdGlvbiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbic7XG5mdW5jdGlvbiB3YXJuaW5nKGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICBpZiAoIWlzUHJvZHVjdGlvbikge1xuICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdGV4dCA9IFwiV2FybmluZzogXCIgKyBtZXNzYWdlO1xuXG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKHRleHQpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aHJvdyBFcnJvcih0ZXh0KTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2FybmluZztcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB3YXJuaW5nID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGFyZ3MpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiA+IDIgPyBsZW4gLSAyIDogMCk7XG4gICAgZm9yICh2YXIga2V5ID0gMjsga2V5IDwgbGVuOyBrZXkrKykge1xuICAgICAgYXJnc1trZXkgLSAyXSA9IGFyZ3VtZW50c1trZXldO1xuICAgIH1cbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgK1xuICAgICAgICAnbWVzc2FnZSBhcmd1bWVudCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdC5sZW5ndGggPCAxMCB8fCAoL15bc1xcV10qJC8pLnRlc3QoZm9ybWF0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHdhcm5pbmcgZm9ybWF0IHNob3VsZCBiZSBhYmxlIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgJyArXG4gICAgICAgICd3YXJuaW5nLiBQbGVhc2UsIHVzZSBhIG1vcmUgZGVzY3JpcHRpdmUgZm9ybWF0IHRoYW46ICcgKyBmb3JtYXRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgICB9KTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgfSBjYXRjaCh4KSB7fVxuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nO1xuIiwidmFyIGpzcyA9IHJlcXVpcmUoJ2pzcycpLmNyZWF0ZSgpO1xudmFyIGpzc05lc3RlZCA9IHJlcXVpcmUoJ2pzcy1wbHVnaW4tbmVzdGVkJyk7XG5cbmZ1bmN0aW9uIFdpbm5lclNwaW5uZXIob3B0cykge1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlUm90YXRpb24oKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDQwMDAgKyAoMzYwICogNSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMzAwMCArIDIwMDApO1xuICB9XG5cbiAganNzLnVzZShqc3NOZXN0ZWQuZGVmYXVsdCgpKTtcblxuICB2YXIgcm90YXRpb24gPSBnZW5lcmF0ZVJvdGF0aW9uKCk7XG4gIHZhciBkdXJhdGlvbiA9IGdlbmVyYXRlRHVyYXRpb24oKTtcblxuICB2YXIgc3R5bGVzID0ge1xuICAgIFwicGllXCI6IHtcbiAgICAgIFwiYm9yZGVyLXJhZGl1c1wiOiBcIjEwMCVcIixcbiAgICAgIFwiaGVpZ2h0XCI6ICcyMDBweCcsXG4gICAgICBcIndpZHRoXCI6ICcyMDBweCcsXG4gICAgICBcIm92ZXJmbG93XCI6IFwiaGlkZGVuXCIsXG4gICAgICBcInBvc2l0aW9uXCI6IFwicmVsYXRpdmVcIlxuICAgIH0sXG4gICAgXCJwaWVfX3NlZ21lbnRcIjoge1xuICAgICAgXCItLWFcIjogXCItMTAwJVwiLFxuICAgICAgXCItLWJcIjogXCIxMDAlXCIsXG4gICAgICBcIi0tZGVncmVlc1wiOiBcImNhbGMoKHZhcigtLW9mZnNldCwgMCkgLyAxMDApICogMzYwKVwiLFxuICAgICAgXCJjbGlwLXBhdGhcIjogXCJwb2x5Z29uKHZhcigtLWEpIHZhcigtLWEpLCB2YXIoLS1iKSB2YXIoLS1hKSwgdmFyKC0tYikgdmFyKC0tYiksIHZhcigtLWEpIHZhcigtLWIpKVwiLFxuICAgICAgXCJoZWlnaHRcIjogXCIxMDAlXCIsXG4gICAgICBcInBvc2l0aW9uXCI6IFwiYWJzb2x1dGVcIixcbiAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKDAsIC01MCUpIHJvdGF0ZSg5MGRlZykgcm90YXRlKGNhbGModmFyKC0tZGVncmVlcykgKiAxZGVnKSlcIixcbiAgICAgIFwidHJhbnNmb3JtLW9yaWdpblwiOiBcIjUwJSAxMDAlXCIsXG4gICAgICBcIndpZHRoXCI6IFwiMTAwJVwiLFxuICAgICAgXCJ6LWluZGV4XCI6IFwiY2FsYygxICsgdmFyKC0tb3ZlcjUwKSlcIixcbiAgICAgIFwiJjphZnRlciwgJjpiZWZvcmVcIjoge1xuICAgICAgICBcImJhY2tncm91bmRcIjogXCJ2YXIoLS1iZylcIixcbiAgICAgICAgXCJjb250ZW50XCI6ICdcIlwiJyxcbiAgICAgICAgXCJoZWlnaHRcIjogXCIxMDAlXCIsXG4gICAgICAgIFwicG9zaXRpb25cIjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICBcIndpZHRoXCI6IFwiMTAwJVwiXG4gICAgICB9LFxuICAgICAgXCImOmFmdGVyXCI6IHtcbiAgICAgICAgXCJvcGFjaXR5XCI6IFwidmFyKC0tb3ZlcjUwLCAwKVwiXG4gICAgICB9LFxuICAgICAgXCImOmJlZm9yZVwiOiB7XG4gICAgICAgIFwiLS1kZWdyZWVzXCI6IFwiY2FsYygodmFyKC0tdmFsdWUsIDQ1KSAvIDEwMCkgKiAzNjApXCIsXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFwidHJhbnNsYXRlKDAsIDEwMCUpIHJvdGF0ZShjYWxjKHZhcigtLWRlZ3JlZXMpICogMWRlZykpXCIsXG4gICAgICAgIFwidHJhbnNmb3JtLW9yaWdpblwiOiBcIjUwJSAwJVwiXG4gICAgICB9XG4gICAgfSxcbiAgICBcInNwaW5uaW5nXCI6IHtcbiAgICAgIFwiYW5pbWF0aW9uLW5hbWVcIjogXCJzcGluXCIsXG4gICAgICBcImFuaW1hdGlvbi1kdXJhdGlvblwiOiBkdXJhdGlvbiArIFwibXNcIixcbiAgICAgIFwiYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudFwiOiBcIjFcIixcbiAgICAgIFwiYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvblwiOiBcImVhc2UtaW4tb3V0XCIsXG4gICAgICBcImFuaW1hdGlvbi1maWxsLW1vZGVcIjogXCJmb3J3YXJkc1wiXG4gICAgfSxcbiAgICBcIkBrZXlmcmFtZXMgc3BpblwiOiB7XG4gICAgICBcImZyb21cIjoge1xuICAgICAgICBcInRyYW5zZm9ybVwiOiBcInJvdGF0ZSgwZGVnKVwiXG4gICAgICB9LFxuICAgICAgXCJ0b1wiOiB7XG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFwicm90YXRlKFwiICsgcm90YXRpb24gKyAgXCJkZWcpXCJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgc3R5bGVzaGVldCA9IGpzcy5jcmVhdGVTdHlsZVNoZWV0KHN0eWxlcykuYXR0YWNoKClcblxuICB2YXIgcGllID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHBpZS5jbGFzc0xpc3QuYWRkKHN0eWxlc2hlZXQuY2xhc3Nlcy5waWUpO1xuICBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcbiAgYm9keS5hcHBlbmRDaGlsZChwaWUpO1xuXG4gIGZvciAodmFyIGkgPSBvcHRzLnNlZ21lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIHNlZ21lbnQgPSBvcHRzLnNlZ21lbnRzW2ldO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKCdwaWVfX3NlZ21lbnQtMC0xLTInKTtcbiAgICBub2RlLnN0eWxlLmNzc1RleHQgPSAnLS1vZmZzZXQ6ICcgKyAoMTAwIC8gb3B0cy5zZWdtZW50cy5sZW5ndGggKiBpKS50b0ZpeGVkKDIpICsgJzsgLS12YWx1ZTogJyArICgxMDAgLyBvcHRzLnNlZ21lbnRzLmxlbmd0aCkudG9GaXhlZCgyKSArICc7IC0tYmc6ICcgKyBzZWdtZW50LmNvbG9yICsgJzsnXG4gICAgcGllLmFwcGVuZENoaWxkKG5vZGUpO1xuICB9XG5cbiAgcGllLmNsYXNzTGlzdC5hZGQoc3R5bGVzaGVldC5jbGFzc2VzLnNwaW5uaW5nKTtcblxuICBhYnNSb3RhdGlvbiA9IHJvdGF0aW9uICUgMzYwO1xuICBkZWdyZWVzUGVyU2VnbWVudCA9IDM2MCAvIG9wdHMuc2VnbWVudHMubGVuZ3RoXG4gIHNlbGVjdGVkU2VnbWVudEluZGV4ID0gTWF0aC5mbG9vcihhYnNSb3RhdGlvbiAvIGRlZ3JlZXNQZXJTZWdtZW50KTtcblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgdmFyIHNlbGVjdGVkU2VnbWVudCA9IG9wdHMuc2VnbWVudHNbKG9wdHMuc2VnbWVudHMubGVuZ3RoIC0gMSkgLSBzZWxlY3RlZFNlZ21lbnRJbmRleF1cbiAgICBpZiAodHlwZW9mIHNlbGVjdGVkU2VnbWVudC5vblNlbGVjdGVkID09PSBcImZ1bmN0aW9uXCIpIHsgXG4gICAgICBzZWxlY3RlZFNlZ21lbnQub25TZWxlY3RlZChzZWxlY3RlZFNlZ21lbnQpOyBcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG9wdHMub25GaW5pc2ggPT09IFwiZnVuY3Rpb25cIikgeyBcbiAgICAgIG9wdHMub25GaW5pc2goc2VsZWN0ZWRTZWdtZW50KTsgXG4gICAgfVxuICB9LCBkdXJhdGlvbik7XG59XG5cbndpbmRvdy5XaW5uZXJTcGlubmVyID0gV2lubmVyU3Bpbm5lcjsiXX0=
