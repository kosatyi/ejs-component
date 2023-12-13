(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ejsComponent = {}));
})(this, (function (exports) { 'use strict';

	function getAugmentedNamespace(n) {
	  if (n.__esModule) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
					var args = [null];
					args.push.apply(args, arguments);
					var Ctor = Function.bind.apply(f, args);
					return new Ctor();
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var src$1 = {};

	function isOneOf() {
	  const checks = [].slice.call(arguments);
	  return function (v) {
	    return checks.some(function (c) {
	      return c && c(v);
	    });
	  };
	}
	function getType(o) {
	  return {}.toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}

	/**
	 * @template T
	 * @param {*} o
	 * @param {T} type
	 * @throws {TypeError} Will throw type error if type is an invalid type
	 * @returns {boolean}
	 */
	function isType(o, type) {
	  if (!(type instanceof Function)) {
	    throw new TypeError('Type must be a function');
	  }
	  if (!Object.prototype.hasOwnProperty.call(type, 'prototype')) {
	    throw new TypeError('Type is not a class');
	  }
	  const name = type.name.toLowerCase();
	  return getType(o) === name || Boolean(o && o.constructor === type);
	}
	function isAnyObject(o) {
	  return getType(o) === 'object';
	}
	function isPlainObject$1(o) {
	  if (isAnyObject(o) === false) return false;
	  return o.constructor === Object && Object.getPrototypeOf(o) === Object.prototype;
	}
	function isObject$1(o) {
	  return isPlainObject$1(o);
	}
	function isEmptyObject(o) {
	  return isPlainObject$1(o) && Object.keys(o).length === 0;
	}
	function isFullObject(o) {
	  return isPlainObject$1(o) && Object.keys(o).length > 0;
	}
	function isObjectLike(o) {
	  return isAnyObject(o);
	}
	function isFunction$1(o) {
	  return getType(o) === 'function';
	}
	function isRegexp(o) {
	  return getType(o) === 'regexp';
	}
	function isArguments(o) {
	  return getType(o) === 'arguments';
	}
	function isArray$1(o) {
	  return getType(o) === 'array';
	}
	function isEmptyArray(o) {
	  return isArray$1(o) && o.length === 0;
	}
	function isFullArray(o) {
	  return isArray$1(o) && o.length > 0;
	}
	function isNumber$1(o) {
	  return getType(o) === 'number';
	}
	function isElement(o) {
	  return isObjectLike(o) && o.nodeType === 1;
	}
	function isNull(o) {
	  return getType(o) === 'null';
	}
	function isString$1(o) {
	  return getType(o) === 'string';
	}
	function isEmptyString(o) {
	  return o === '';
	}
	function isFullString(o) {
	  return isString$1(o) && o !== '';
	}
	function isBoolean(o) {
	  return getType(o) === 'boolean';
	}
	function isUndefined(o) {
	  return getType(o) === 'undefined';
	}
	function isMap(o) {
	  return getType(o) === 'map';
	}
	function isWeakMap(o) {
	  return getType(o) === 'weakmap';
	}
	function isSet(o) {
	  return getType(o) === 'set';
	}
	function isWeakSet(o) {
	  return getType(o) === 'weakset';
	}
	function isSymbol(o) {
	  return getType(o) === 'symbol';
	}
	function isDate(o) {
	  return getType(o) === 'date' && !isNaN(o);
	}
	function isBlob(o) {
	  return getType(o) === 'blob';
	}
	function isFile(o) {
	  return getType(o) === 'file';
	}
	function isPromise(o) {
	  return getType(o) === 'promise';
	}
	function isError(o) {
	  return getType(o) === 'error';
	}
	function isNaNValue(o) {
	  return getType(o) === 'number' && isNaN(o);
	}
	const isNullOrUndefined = isOneOf(isNull, isUndefined);
	const isPrimitive = isOneOf(isBoolean, isNull, isUndefined, isNumber$1, isString$1, isSymbol);

	var type = /*#__PURE__*/Object.freeze({
		__proto__: null,
		getType: getType,
		isAnyObject: isAnyObject,
		isArguments: isArguments,
		isArray: isArray$1,
		isBlob: isBlob,
		isBoolean: isBoolean,
		isDate: isDate,
		isElement: isElement,
		isEmptyArray: isEmptyArray,
		isEmptyObject: isEmptyObject,
		isEmptyString: isEmptyString,
		isError: isError,
		isFile: isFile,
		isFullArray: isFullArray,
		isFullObject: isFullObject,
		isFullString: isFullString,
		isFunction: isFunction$1,
		isMap: isMap,
		isNaNValue: isNaNValue,
		isNull: isNull,
		isNullOrUndefined: isNullOrUndefined,
		isNumber: isNumber$1,
		isObject: isObject$1,
		isObjectLike: isObjectLike,
		isOneOf: isOneOf,
		isPlainObject: isPlainObject$1,
		isPrimitive: isPrimitive,
		isPromise: isPromise,
		isRegexp: isRegexp,
		isSet: isSet,
		isString: isString$1,
		isSymbol: isSymbol,
		isType: isType,
		isUndefined: isUndefined,
		isWeakMap: isWeakMap,
		isWeakSet: isWeakSet
	});

	const propertyCheck = '_$validation$_';
	const isTypeObject = t => Object.prototype.hasOwnProperty.call(t, 'prototype');
	const isValidationFunction = t => Object.prototype.hasOwnProperty.call(t, propertyCheck);
	const wrapper = cb => {
	  cb[propertyCheck] = true;
	  return cb;
	};
	const inner = value => {
	  return type => {
	    if (isPrimitive(type)) {
	      return value === type;
	    }
	    if (isValidationFunction(type)) {
	      return type(value);
	    }
	    return isFunction$1(type) && isType(value, type);
	  };
	};
	const outer = type => {
	  return value => {
	    if (isPrimitive(type)) {
	      return value === type;
	    }
	    if (isValidationFunction(type)) {
	      return type(value);
	    }
	    return isFunction$1(type) && isType(value, type);
	  };
	};
	function merge$1(target, ...list) {
	  for (const index of Object.keys(list)) {
	    const source = list[index];
	    for (const key of Object.keys(source)) {
	      const value = source[key];
	      if (isPlainObject$1(value)) {
	        target[key] = merge$1(target[key] || {}, value);
	      } else if (isArray$1(value)) {
	        target[key] = merge$1(target[key] || [], value);
	      } else {
	        target[key] = value;
	      }
	    }
	  }
	  return target;
	}
	function oneOf(...args) {
	  return wrapper(value => {
	    return args.some(type => {
	      return value === type;
	    });
	  });
	}
	function or(...args) {
	  return wrapper(value => {
	    return args.some(inner(value));
	  });
	}
	function and(...args) {
	  return wrapper(value => {
	    return args.every(inner(value));
	  });
	}
	function arrayOf(type) {
	  return wrapper(value => {
	    return isFullArray(value) && value.every(outer(type));
	  });
	}
	function filter(object, schema, arrayLike) {
	  let result = arrayLike ? [] : {};
	  for (let prop of Object.keys(schema)) {
	    let type = schema[prop];
	    if (isUndefined(object)) {
	      continue;
	    }
	    if (isPrimitive(type)) {
	      if (object[prop] === type) {
	        result[prop] = object[prop];
	      } else {
	        continue;
	      }
	    }
	    if (isValidationFunction(type)) {
	      if (type(object[prop], prop)) {
	        result[prop] = object[prop];
	      } else {
	        continue;
	      }
	    }
	    if (isTypeObject(type)) {
	      if (isType(object[prop], type)) {
	        result[prop] = object[prop];
	      } else {
	        continue;
	      }
	    }
	    if (isFullArray(type) && isFullArray(object[prop])) {
	      if (type.length === object[prop].length) {
	        result[prop] = filter(object[prop], schema[prop], true);
	      } else {
	        continue;
	      }
	    }
	    if (isFullObject(type)) {
	      result[prop] = filter(object[prop], schema[prop]);
	    }
	  }
	  return result;
	}

	var schema = /*#__PURE__*/Object.freeze({
		__proto__: null,
		and: and,
		arrayOf: arrayOf,
		filter: filter,
		merge: merge$1,
		oneOf: oneOf,
		or: or
	});

	var src = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Schema: schema,
		Type: type
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(src);

	const {
	  Type,
	  Schema
	} = require$$0;
	const {
	  isPlainObject,
	  isString,
	  isFunction,
	  isObject,
	  isArray,
	  isNumber
	} = Type;
	const {
	  merge
	} = Schema;

	/**
	 * @typedef {ComponentNode|ComponentTagNode|ComponentListNode} ComponentType
	 */

	/**
	 * @typedef {Object<string,any>} ComponentTagNodeParams
	 * @property {string} [tag]
	 * @property {Object} [attrs]
	 * @property {Array|String} [content]
	 */

	/**
	 * @typedef {Object<string,any>} ComponentListNodeParams
	 * @property {Array|string} [content]
	 */

	/**
	 * @typedef {ComponentTagNodeParams|ComponentListNodeParams} ComponentParams
	 */

	/**
	 * @typedef {Object} ComponentTagNodeInstance
	 * @property {ComponentParams} [props]
	 * @property {ComponentCallback} [render]
	 */

	/**
	 * @typedef {Object} ComponentListNodeInstance
	 * @property {ComponentParams} [props]
	 * @property {ComponentCallback} render
	 */

	/**
	 * @typedef {ComponentTagNodeInstance|ComponentListNodeInstance} ComponentInstance
	 */

	/**
	 * @typedef {Function} ComponentCallback
	 * @param {ComponentType} node
	 * @param {Object} props
	 * @param {Component} [self]
	 * @returns ComponentNode | void
	 */

	/**
	 * @typedef {Function} ComponentRender
	 * @param {Object} [props]
	 * @param {any} [content]
	 * @returns {ComponentType}
	 */

	/**
	 * @type {Object.<string, ComponentRender>}
	 */
	const components = {};
	/**
	 *
	 * @type {object}
	 */
	const options = {
	  componentCreated(name, component) {},
	  escapeValue(value) {
	    return value;
	  },
	  tagNodeToString(node) {
	    return JSON.stringify(node);
	  },
	  isSafeString(node) {
	    return isObject(node) && isNumber(node.length) && isString(node.value) && isFunction(node.toString);
	  }
	};

	/**
	 *
	 * @param {{}} params
	 */
	function configureComponent(params = {}) {
	  if (isFunction(params.escapeValue)) {
	    options.escapeValue = params.escapeValue;
	  }
	  if (isFunction(params.componentCreated)) {
	    options.componentCreated = params.componentCreated;
	  }
	  if (isFunction(params.tagNodeToString)) {
	    options.tagNodeToString = params.tagNodeToString;
	  }
	  if (isFunction(params.isSafeString)) {
	    options.isSafeString = params.isSafeString;
	  }
	}

	/**
	 * @mixes Array
	 * @constructor
	 */
	function ComponentArray(list) {
	  [].push.apply(this, list);
	}
	Object.setPrototypeOf(ComponentArray.prototype, Array.prototype);
	ComponentArray.prototype.toString = function () {
	  return [].slice.call(this).join('');
	};
	ComponentArray.prototype.toJSON = function () {
	  return [].slice.call(this);
	};

	/**
	 *
	 * @constructor
	 */
	function ComponentNode() {}
	ComponentNode.prototype = {
	  parentNode: null,
	  toParent(parent) {
	    if (parent instanceof ComponentNode) {
	      this.parentNode = parent;
	    }
	    return this;
	  },
	  isSafeString(node) {
	    return options.isSafeString(node);
	  },
	  hasChildNodes(node) {
	    return node instanceof ComponentTagNode || node instanceof ComponentListNode;
	  },
	  getNode(node) {
	    if (node instanceof ComponentNode) {
	      return node;
	    }
	    if (this.isSafeString(node)) {
	      return new ComponentSafeNode(node);
	    }
	    if (isString(node) || isNumber(node)) {
	      return new ComponentTextNode(node);
	    }
	    if (isPlainObject(node)) {
	      if (isString(node.tag) && isPlainObject(node.attrs)) {
	        return new ComponentTagNode(node.tag, node.attrs, node.content || []);
	      }
	    }
	  },
	  prependTo(node) {
	    if (this.hasChildNodes(node)) {
	      node.prepend(this);
	    }
	  },
	  appendTo(node) {
	    if (this.hasChildNodes(node)) {
	      node.append(this);
	    }
	    return this;
	  },
	  remove() {
	    if (this.hasChildNodes(this.parentNode)) {
	      const content = this.parentNode.content;
	      const index = content.indexOf(this.toParent(null));
	      if (!!~index) {
	        content.splice(index, 1);
	      }
	    }
	  },
	  toString() {
	    return '';
	  },
	  toJSON() {
	    return {};
	  }
	};

	/**
	 * @extends ComponentNode
	 * @param {Object|string} html
	 * @constructor
	 */
	function ComponentSafeNode(html) {
	  ComponentNode.call(this);
	  this.html = String(html);
	}
	Object.setPrototypeOf(ComponentSafeNode.prototype, ComponentNode.prototype);
	Object.assign(ComponentSafeNode.prototype, {
	  toString() {
	    return this.html;
	  },
	  toJSON() {
	    return {
	      html: this.html
	    };
	  }
	});

	/**
	 * @extends ComponentNode
	 * @param text
	 * @constructor
	 */
	function ComponentTextNode(text) {
	  ComponentNode.call(this);
	  this.text = options.escapeValue(text);
	}
	Object.setPrototypeOf(ComponentTextNode.prototype, ComponentNode.prototype);
	Object.assign(ComponentTextNode.prototype, {
	  toString() {
	    return this.text;
	  },
	  toJSON() {
	    return {
	      text: this.text
	    };
	  }
	});

	/**
	 * @extends ComponentNode
	 * @param {any} content
	 * @constructor
	 */
	function ComponentListNode(content) {
	  ComponentNode.call(this);
	  this.content = new ComponentArray();
	  if (isArray(content)) {
	    content.forEach(item => {
	      this.append(item);
	    });
	  } else {
	    this.append(content);
	  }
	}

	/**
	 *
	 */
	Object.setPrototypeOf(ComponentListNode.prototype, ComponentNode.prototype);
	/**
	 *
	 */
	Object.assign(ComponentListNode.prototype, {
	  toJSON() {
	    return {
	      content: this.content
	    };
	  },
	  toString() {
	    return String(this.content);
	  },
	  /**
	   *
	   * @param node
	   * @returns {ComponentListNode}
	   */
	  append(node) {
	    node = this.getNode(node);
	    if (node instanceof ComponentNode) {
	      this.content.push(node.toParent(this));
	    }
	    return this;
	  },
	  /**
	   *
	   * @param node
	   * @return {ComponentListNode}
	   */
	  prepend(node) {
	    node = this.getNode(node);
	    if (node instanceof ComponentNode) {
	      this.content.unshift(node.toParent(this));
	    }
	    return this;
	  },
	  empty() {
	    this.content.forEach(item => {
	      item.toParent(null);
	    });
	    this.content = [];
	    return this;
	  }
	});

	/**
	 * @extends ComponentListNode
	 * @param tag
	 * @param attrs
	 * @param content
	 * @constructor
	 */
	function ComponentTagNode(tag, attrs, content) {
	  ComponentListNode.call(this, content);
	  this.tag = tag;
	  this.attrs = {};
	  this.attr(attrs);
	}

	/**
	 *
	 */
	Object.setPrototypeOf(ComponentTagNode.prototype, ComponentListNode.prototype);
	/**
	 *
	 */
	Object.assign(ComponentTagNode.prototype, {
	  getAttribute(name) {
	    return this.attrs[name];
	  },
	  setAttribute(name, value) {
	    if (name) {
	      if (name.indexOf('data') === 0 || name.indexOf('aria') === 0) {
	        name = name.replace(/[A-Z]/g, '-$&').toLowerCase();
	      }
	      this.attrs[name] = value;
	    }
	  },
	  toJSON() {
	    return {
	      tag: this.tag,
	      attrs: this.attrs,
	      content: this.content
	    };
	  },
	  toString() {
	    return options.tagNodeToString(this);
	  },
	  classList() {
	    return String(this.getAttribute('class') || '').trim().split(/\s+/);
	  },
	  addClass() {
	    const tokens = [].slice.call(arguments);
	    const classList = this.classList();
	    tokens.forEach(token => {
	      if (token && !~classList.indexOf(token)) {
	        classList.push(token);
	      }
	    });
	    this.setAttribute('class', classList.join(' ').trim());
	    return this;
	  },
	  removeClass() {
	    const tokens = [].slice.call(arguments);
	    const classList = this.classList();
	    tokens.forEach(token => {
	      if (token) {
	        const index = classList.indexOf(token);
	        if (!!~index) {
	          classList.splice(index, 1);
	        }
	      }
	    });
	    this.setAttribute('class', classList.join(' ').trim());
	    return this;
	  },
	  attr(name, value) {
	    if (isPlainObject(name)) {
	      Object.entries(name).forEach(([key, value]) => {
	        this.setAttribute(key, value);
	      });
	    } else {
	      this.setAttribute(name, value);
	    }
	  }
	});

	/**
	 * @constructor
	 * @param {ComponentParams} props
	 * @param {ComponentCallback} render
	 * @return {ComponentType|string}
	 */
	function Component(props, render) {
	  let node, replace;
	  if (isString(props.tag)) {
	    node = new ComponentTagNode(props.tag, props.attrs, props.content);
	  } else {
	    node = new ComponentListNode(props.content);
	  }
	  if (isFunction(render)) {
	    replace = render(node, props, this);
	  }
	  return replace ? replace : node;
	}

	/**
	 * @template {Object<string,any>} T
	 * @param {T} object
	 * @param {object} [options]
	 */
	Component.extend = function (object, options = {}) {
	  /**
	   * @template T
	   * @type {T & Component.prototype}
	   */
	  Object.entries(object).forEach(([name, value]) => {
	    Component.defineProperty(name, value, options);
	  });
	  return Component;
	};
	Component.defineProperty = function (name, value, {
	  writable,
	  configurable,
	  enumerable
	}) {
	  return Object.defineProperty(Component.prototype, name, {
	    value,
	    writable,
	    configurable,
	    enumerable
	  });
	};
	Component.prototype = {
	  /**
	   *
	   * @param {string} tag
	   * @param {Object} [attrs]
	   * @param [children]
	   * @returns {ComponentTagNode}
	   */
	  create(tag, attrs, children) {
	    return new ComponentTagNode(tag, attrs, children);
	  },
	  /**
	   * @param {any[]} [children]
	   * @returns {ComponentListNode}
	   */
	  list(children) {
	    return new ComponentListNode(children);
	  },
	  /**
	   *
	   * @param {string} name
	   * @param {object} [props]
	   * @param {any[]} [content]
	   * @return {ComponentType}
	   */
	  call(name, props, content) {
	    const instance = components[name];
	    if (instance) {
	      return instance(props || {}, content);
	    }
	  },
	  /**
	   *
	   * @param {object} params
	   * @param {array<string|number>} props
	   * @param {object} [extra]
	   * @returns {{[p: string]: any}}
	   */
	  pick(params, props, extra) {
	    return Object.assign(Object.fromEntries(Object.entries(this.clean(params)).filter(([name]) => !!~props.indexOf(name))), this.clean(extra));
	  },
	  /**
	   *
	   * @param {object} params
	   * @param {array<string|number>} props
	   * @param {object} [extra]
	   * @returns {{[p: string]: any}}
	   */
	  omit(params, props, extra) {
	    return Object.assign(Object.fromEntries(Object.entries(this.clean(params)).filter(([name]) => !~props.indexOf(name))), this.clean(extra));
	  },
	  /**
	   *
	   * @param {object} params
	   * @returns {{[p: string]: any}}
	   */
	  clean(params) {
	    if (!params) return {};
	    return Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
	  },
	  /**
	   *
	   * @param array
	   * @param delimiter
	   * @returns {string}
	   */
	  join(array, delimiter) {
	    return [].slice.call(array).join(delimiter).trim();
	  },
	  /**
	   *
	   * @param object
	   * @param prop
	   * @returns {boolean}
	   */
	  hasProp(object, prop) {
	    return Object.prototype.hasOwnProperty.call(object, prop);
	  }
	};

	/**
	 *
	 * @param {string} name
	 * @param {ComponentInstance} proto
	 * @return {function(props?:ComponentParams,content?:any): ComponentType}
	 */
	function createComponent(name, proto) {
	  const defaults = proto.props || {};
	  const render = proto.render;

	  /**
	   *
	   * @param {Object} [props]
	   * @param {any} [content]
	   * @return {ComponentType}
	   */
	  function component(props, content) {
	    const config = merge({}, defaults, props || {});
	    if (content) {
	      config.content = content;
	    }
	    try {
	      return new Component(config, render);
	    } catch (e) {
	      console.log(e);
	    }
	  }
	  components[name] = component;
	  options.componentCreated(name, component);
	  return component;
	}

	/**
	 *
	 * @param {string} name
	 * @returns {ComponentRender}
	 */
	function getComponent(name) {
	  return components[name];
	}
	var options_1 = src$1.options = options;
	var Component_1 = src$1.Component = Component;
	var ComponentNode_1 = src$1.ComponentNode = ComponentNode;
	var ComponentSafeNode_1 = src$1.ComponentSafeNode = ComponentSafeNode;
	var ComponentTextNode_1 = src$1.ComponentTextNode = ComponentTextNode;
	var ComponentTagNode_1 = src$1.ComponentTagNode = ComponentTagNode;
	var ComponentListNode_1 = src$1.ComponentListNode = ComponentListNode;
	var ComponentArray_1 = src$1.ComponentArray = ComponentArray;
	var getComponent_1 = src$1.getComponent = getComponent;
	var configureComponent_1 = src$1.configureComponent = configureComponent;
	var createComponent_1 = src$1.createComponent = createComponent;

	exports.Component = Component_1;
	exports.ComponentArray = ComponentArray_1;
	exports.ComponentListNode = ComponentListNode_1;
	exports.ComponentNode = ComponentNode_1;
	exports.ComponentSafeNode = ComponentSafeNode_1;
	exports.ComponentTagNode = ComponentTagNode_1;
	exports.ComponentTextNode = ComponentTextNode_1;
	exports.configureComponent = configureComponent_1;
	exports.createComponent = createComponent_1;
	exports.default = src$1;
	exports.getComponent = getComponent_1;
	exports.options = options_1;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
