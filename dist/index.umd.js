(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["ejs-component"] = {}));
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
	function isObject(o) {
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
		isObject: isObject,
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
	  isArray,
	  isNumber
	} = Type;
	const {
	  merge
	} = Schema;
	/**
	 *
	 * @type {{}}
	 */
	const components = {};
	/**
	 *
	 * @type {{componentCreated(*), isSafeString(*): *, tagNodeToString(*): string}}
	 */
	const options = {
	  componentCreated(component) {},
	  tagNodeToString(node) {
	    return JSON.stringify(node.toJSON());
	  },
	  isSafeString(node) {
	    return node && isFunction(node.toString);
	  }
	};

	/**
	 *
	 * @param params
	 */
	function configureComponent(params = {}) {
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
	      if (isString(node.tagName) && isPlainObject(node.attributes)) {
	        return new ComponentTagNode(node.tagName, node.attributes, node.children || []);
	      }
	    }
	  },
	  prependTo(node) {
	    if (node instanceof ComponentTagNode) {
	      node.prepend(this);
	    }
	  },
	  appendTo(node) {
	    if (node instanceof ComponentTagNode) {
	      node.append(this);
	    }
	    return this;
	  },
	  remove() {
	    if (this.parentNode instanceof ComponentTagNode) {
	      const children = this.parentNode.children;
	      const index = children.indexOf(this);
	      if (index > -1) {
	        children.splice(index, 1);
	      }
	    }
	  }
	};

	/**
	 * @extends ComponentNode
	 * @param content
	 * @constructor
	 */
	function ComponentSafeNode(content) {
	  ComponentNode.call(this);
	  this.content = content.toString();
	}
	Object.setPrototypeOf(ComponentSafeNode.prototype, ComponentNode.prototype);
	Object.assign(ComponentSafeNode.prototype, {
	  toString() {
	    return this.content;
	  },
	  toJSON() {
	    return {
	      content: this.content
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
	  this.text = text;
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
	 * @param tagName
	 * @param attributes
	 * @param children
	 * @constructor
	 */
	function ComponentTagNode(tagName, attributes, children) {
	  ComponentNode.call(this);
	  this.tagName = tagName;
	  this.attributes = {};
	  this.children = [];
	  if (isPlainObject(attributes)) {
	    Object.entries(attributes).forEach(([name, value]) => {
	      this.attr(name, value);
	    });
	  }
	  if (isArray(children)) {
	    children.forEach(item => {
	      this.append(item);
	    });
	  } else {
	    this.append(children);
	  }
	}

	/**
	 *
	 */
	Object.setPrototypeOf(ComponentTagNode.prototype, ComponentNode.prototype);
	/**
	 *
	 */
	Object.assign(ComponentTagNode.prototype, {
	  /**
	   *
	   * @param node
	   * @return {ComponentTagNode}
	   */
	  append(node) {
	    node = this.getNode(node);
	    if (node instanceof ComponentNode) {
	      this.children.push(node.toParent(this));
	    }
	    return this;
	  },
	  /**
	   *
	   * @param node
	   * @return {ComponentTagNode}
	   */
	  prepend(node) {
	    node = this.getNode(node);
	    if (node instanceof ComponentNode) {
	      this.children.unshift(node.toParent(this));
	    }
	    return this;
	  },
	  /**
	   *
	   * @return {ComponentTagNode}
	   */
	  empty() {
	    this.children.forEach(item => {
	      item.toParent(null);
	    });
	    this.children = [];
	    return this;
	  },
	  /**
	   *
	   * @returns {{children: ([]|[ComponentTextNode]|*), attributes: {} & *, tagName}}
	   */
	  toJSON() {
	    return {
	      tagName: this.tagName,
	      attributes: this.attributes,
	      children: this.children
	    };
	  },
	  /**
	   *
	   * @returns {string}
	   */
	  toString() {
	    return options.tagNodeToString(this);
	  },
	  /**
	   *
	   * @returns {string[]}
	   */
	  classList() {
	    return String(this.attributes.class || '').trim().split(/\s+/);
	  },
	  /**
	   *
	   * @returns {ComponentTagNode}
	   */
	  addClass() {
	    const tokens = [].slice.call(arguments);
	    const classList = this.classList();
	    tokens.forEach(token => {
	      if (!token) return true;
	      if (classList.indexOf(token) > -1) return true;
	      classList.push(token);
	    });
	    this.attributes.class = classList.join(' ').trim();
	    return this;
	  },
	  /**
	   *
	   * @returns {ComponentTagNode}
	   */
	  removeClass() {
	    const tokens = [].slice.call(arguments);
	    const classList = this.classList();
	    tokens.forEach((token, index) => {
	      if (!token) return true;
	      if (classList.indexOf(token) < 0) return;
	      classList.splice(index, 1);
	    });
	    this.attributes.class = classList.join(' ').trim();
	    return this;
	  },
	  /**
	   *
	   * @param name
	   * @param value
	   * @returns {ComponentTagNode}
	   */
	  attr(name, value) {
	    if (name) {
	      if (name.indexOf('data') === 0 || name.indexOf('aria') === 0) {
	        name = name.replace(/[A-Z]/g, '-$&').toLowerCase();
	      }
	      this.attributes[name] = value;
	    }
	    return this;
	  },
	  /**
	   *
	   * @param props
	   */
	  attrs(props) {
	    if (isPlainObject(props)) {
	      Object.entries(props).forEach(([name, value]) => {
	        this.attr(name, value);
	      });
	    }
	  },
	  text(content) {
	    this.children = [new ComponentTextNode(content)];
	  }
	});

	/**
	 * @extends ComponentNode
	 * @param list
	 * @constructor
	 */
	function ComponentListNode(list) {
	  ComponentNode.call(this);
	  this.children = [];
	  if (isArray(list)) {
	    list.forEach(item => {
	      this.append(item);
	    });
	  } else {
	    this.append(list);
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
	  toString() {
	    return this.children.map(item => item.toString()).join('');
	  },
	  toJSON() {
	    return this.children;
	  },
	  /**
	   *
	   * @param node
	   * @returns {ComponentListNode}
	   */
	  append(node) {
	    node = this.getNode(node);
	    if (node instanceof ComponentNode) {
	      this.children.push(node.toParent(this));
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
	      this.children.unshift(node.toParent(this));
	    }
	    return this;
	  }
	});

	/**
	 * @typedef {function} ComponentCallback
	 * @param {ComponentTagNode} node
	 * @param {object} props
	 * @param {Component} [self]
	 * @returns ComponentNode | void
	 */

	/**
	 * @typedef {object} ComponentParams
	 * @property {string} [tag]
	 * @property {object} [attrs]
	 * @property {Array|string} [content]
	 */

	/**
	 * @typedef {object} ComponentInstance
	 * @property {ComponentParams} [props]
	 * @property {ComponentCallback} [render]
	 */

	/**
	 *
	 * @param {ComponentParams} props
	 * @param {ComponentCallback} render
	 * @return {ComponentNode}
	 * @constructor
	 */

	function Component(props, render) {
	  let node, replace;
	  if (isString(props.tag)) {
	    node = new ComponentTagNode(props.tag, props.attrs, props.content);
	  } else {
	    node = new ComponentListNode(props.content);
	  }
	  if (isFunction(render)) replace = render(node, props, this);
	  return replace ? replace : node;
	}
	Component.prototype = {
	  /**
	   *
	   * @param {string} tag
	   * @param {object} [attrs]
	   * @param {*} [children]
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
	   * @param {object} props
	   * @param {any[]} [content]
	   * @return {ComponentNode|ComponentTagNode}
	   */
	  call(name, props, content) {
	    const instance = components[name];
	    if (instance) {
	      return instance(props || {}, content);
	    }
	  },
	  /**
	   *
	   * @param params
	   * @param props
	   * @param extra
	   * @returns {{[p: string]: any}}
	   */
	  pick(params, props, extra) {
	    extra = extra || {};
	    params = Object.entries(params).filter(([name]) => {
	      return props.indexOf(name) !== -1;
	    });
	    return Object.assign(Object.fromEntries(params), extra);
	  }
	};

	/**
	 *
	 * @param {string} name
	 * @param {ComponentInstance} instance
	 * @return {function(params:{},content:[]): Component}
	 */
	function createComponent(name, instance) {
	  const render = instance.render;
	  const defaults = instance.props;
	  function component(props, content) {
	    props = props || {};
	    const config = merge({}, defaults, props, {
	      content
	    });
	    if (content) {
	      config.content = content;
	    }
	    return new Component(config, render);
	  }
	  components[name] = component;
	  options.componentCreated(name, component);
	  return component;
	}

	/**
	 *
	 * @param name
	 * @returns {*}
	 */
	function getComponent(name) {
	  return components[name];
	}
	var getComponent_1 = src$1.getComponent = getComponent;
	var configureComponent_1 = src$1.configureComponent = configureComponent;
	var createComponent_1 = src$1.createComponent = createComponent;

	exports.configureComponent = configureComponent_1;
	exports.createComponent = createComponent_1;
	exports.default = src$1;
	exports.getComponent = getComponent_1;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
