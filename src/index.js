const {Type, Schema} = require('@kosatyi/is-type')
const {isPlainObject, isString, isFunction, isObject, isArray, isNumber} = Type
const {merge} = Schema

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
const components = {}
/**
 *
 * @type {object}
 */
const options = {
    componentCreated(name, component) {
    },
    escapeValue(value) {
        return value
    },
    tagNodeToString(node) {
        return JSON.stringify(node)
    },
    isSafeString(node) {
        return isObject(node) &&
            isNumber(node.length) &&
            isString(node.value) &&
            isFunction(node.toString)
    },
}

/**
 *
 * @param {{}} params
 */
function configureComponent(params = {}) {
    if (isFunction(params.escapeValue)) {
        options.escapeValue = params.escapeValue
    }
    if (isFunction(params.componentCreated)) {
        options.componentCreated = params.componentCreated
    }
    if (isFunction(params.tagNodeToString)) {
        options.tagNodeToString = params.tagNodeToString
    }
    if (isFunction(params.isSafeString)) {
        options.isSafeString = params.isSafeString
    }
}

/**
 * @mixes Array
 * @constructor
 */
function ComponentArray(list) {
    [].push.apply(this, list)
}

Object.setPrototypeOf(ComponentArray.prototype, Array.prototype)

ComponentArray.prototype.toString = function () {
    return [].slice.call(this).join('')
}
ComponentArray.prototype.toJSON = function () {
    return [].slice.call(this)
}

/**
 *
 * @constructor
 */
function ComponentNode() {
}

ComponentNode.prototype = {
    parentNode: null,
    toParent(parent) {
        if (parent instanceof ComponentNode) {
            this.parentNode = parent
        }
        return this
    },
    isSafeString(node) {
        return options.isSafeString(node)
    },
    hasChildNodes(node) {
        return node instanceof ComponentTagNode || node instanceof ComponentListNode
    },
    getNode(node) {
        if (node instanceof ComponentNode) {
            return node
        }
        if (this.isSafeString(node)) {
            return new ComponentSafeNode(node)
        }
        if (isString(node) || isNumber(node)) {
            return new ComponentTextNode(node)
        }
        if (isPlainObject(node)) {
            if (isString(node.tag) && isPlainObject(node.attrs)) {
                return new ComponentTagNode(
                    node.tag,
                    node.attrs,
                    node.content || []
                )
            }
        }
    },
    prependTo(node) {
        if (this.hasChildNodes(node)) {
            node.prepend(this)
        }
    },
    appendTo(node) {
        if (this.hasChildNodes(node)) {
            node.append(this)
        }
        return this
    },
    remove() {
        if (this.hasChildNodes(this.parentNode)) {
            const content = this.parentNode.content
            const index = content.indexOf(this.toParent(null))
            if (!!~index) {
                content.splice(index, 1)
            }
        }
    },
    toString() {
        return ''
    },
    toJSON() {
        return {}
    }
}

/**
 * @extends ComponentNode
 * @param {Object|string} html
 * @constructor
 */
function ComponentSafeNode(html) {
    ComponentNode.call(this)
    this.html = String(html)
}

Object.setPrototypeOf(ComponentSafeNode.prototype, ComponentNode.prototype)

Object.assign(ComponentSafeNode.prototype, {
    toString() {
        return this.html
    },
    toJSON() {
        return {
            html: this.html
        }
    }
})

/**
 * @extends ComponentNode
 * @param text
 * @constructor
 */
function ComponentTextNode(text) {
    ComponentNode.call(this)
    this.text = String(options.escapeValue(text))
}

Object.setPrototypeOf(ComponentTextNode.prototype, ComponentNode.prototype)

Object.assign(ComponentTextNode.prototype, {
    toString() {
        return this.text
    },
    toJSON() {
        return {
            text: this.text
        }
    }
})

/**
 * @extends ComponentNode
 * @param {any} content
 * @constructor
 */
function ComponentListNode(content) {
    ComponentNode.call(this)
    this.content = new ComponentArray()
    if (isArray(content)) {
        content.forEach(item => {
            this.append(item)
        })
    } else {
        this.append(content)
    }
}

/**
 *
 */
Object.setPrototypeOf(ComponentListNode.prototype, ComponentNode.prototype)
/**
 *
 */
Object.assign(ComponentListNode.prototype, {
    toJSON() {
        return {
            content: this.content
        }
    },
    toString() {
        return String(this.content)
    },
    /**
     *
     * @param node
     * @returns {ComponentListNode}
     */
    append(node) {
        node = this.getNode(node)
        if (node instanceof ComponentNode) {
            this.content.push(node.toParent(this))
        }
        return this
    },
    /**
     *
     * @param node
     * @return {ComponentListNode}
     */
    prepend(node) {
        node = this.getNode(node)
        if (node instanceof ComponentNode) {
            this.content.unshift(node.toParent(this))
        }
        return this
    },
    empty() {
        this.content.forEach(item => {
            item.toParent(null)
        })
        this.content = []
        return this
    },
})

/**
 * @extends ComponentListNode
 * @param tag
 * @param attrs
 * @param content
 * @constructor
 */
function ComponentTagNode(tag, attrs, content) {
    ComponentListNode.call(this, content)
    this.tag = tag
    this.attrs = {}
    this.attr(attrs)
}

/**
 *
 */
Object.setPrototypeOf(ComponentTagNode.prototype, ComponentListNode.prototype)
/**
 *
 */
Object.assign(ComponentTagNode.prototype, {
    getAttribute(name) {
        return this.attrs[name]
    },
    setAttribute(name, value) {
        if (name) {
            if (name.indexOf('data') === 0 || name.indexOf('aria') === 0) {
                name = name.replace(/[A-Z]/g, '-$&').toLowerCase()
            }
            this.attrs[name] = value
        }
    },
    toJSON() {
        return {
            tag: this.tag,
            attrs: this.attrs,
            content: this.content
        }
    },
    toString() {
        return options.tagNodeToString(this)
    },
    classList() {
        return String(this.getAttribute('class') || '')
            .trim()
            .split(/\s+/)
    },
    addClass() {
        const tokens = [].slice.call(arguments)
        const classList = this.classList()
        tokens.forEach(token => {
            if (token && !~classList.indexOf(token)) {
                classList.push(token)
            }
        })
        this.setAttribute('class', classList.join(' ').trim())
        return this
    },
    removeClass() {
        const tokens = [].slice.call(arguments)
        const classList = this.classList()
        tokens.forEach((token) => {
            if (token) {
                const index = classList.indexOf(token)
                if (!!~index) {
                    classList.splice(index, 1)
                }
            }
        })
        this.setAttribute('class', classList.join(' ').trim())
        return this
    },
    attr(name, value) {
        if (isPlainObject(name)) {
            Object.entries(name).forEach(([key, value]) => {
                this.setAttribute(key, value)
            })
        } else {
            this.setAttribute(name, value)
        }
    }
})


/**
 * @constructor
 * @param {ComponentParams} props
 * @param {ComponentCallback} render
 * @return {ComponentType|string}
 */
function Component(props, render) {
    let node, replace
    if (isString(props.tag)) {
        node = new ComponentTagNode(props.tag, props.attrs, props.content)
    } else {
        node = new ComponentListNode(props.content)
    }
    if (isFunction(render)) {
        replace = render(node, props, this)
    }
    return replace ? replace : node
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
        Component.defineProperty(name, value, options)
    })
    return Component
}

Component.defineProperty = function (name, value, {writable, configurable, enumerable}) {
    return Object.defineProperty(Component.prototype, name, {
        value,
        writable,
        configurable,
        enumerable
    })
}




Component.prototype = {
    /**
     *
     * @param {string} tag
     * @param {Object} [attrs]
     * @param [children]
     * @returns {ComponentTagNode}
     */
    create(tag, attrs, children) {
        return new ComponentTagNode(tag, attrs, children)
    },
    /**
     * @param {any[]} [children]
     * @returns {ComponentListNode}
     */
    list(children) {
        return new ComponentListNode(children)
    },
    /**
     *
     * @param {string} name
     * @param {object} [props]
     * @param {any[]} [content]
     * @return {ComponentType}
     */
    call(name, props, content) {
        const instance = components[name]
        if (instance) {
            return instance(props || {}, content)
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
        return Object.assign(Object.fromEntries(
            Object.entries(this.clean(params)).filter(([name]) => !!~props.indexOf(name) )
        ), this.clean(extra))
    },
    /**
     *
     * @param {object} params
     * @param {array<string|number>} props
     * @param {object} [extra]
     * @returns {{[p: string]: any}}
     */
    omit(params,props,extra){
        return Object.assign(Object.fromEntries(
            Object.entries(this.clean(params)).filter(([name]) => !~props.indexOf(name) )
        ), this.clean(extra))
    },
    /**
     *
     * @param {object} params
     * @returns {{[p: string]: any}}
     */
    clean(params){
        if(!params) return {}
        return Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
        )
    },
    /**
     *
     * @param array
     * @param delimiter
     * @returns {string}
     */
    join(array, delimiter) {
        return [].slice.call(array).join(delimiter).trim()
    },
    /**
     *
     * @param object
     * @param prop
     * @returns {boolean}
     */
    hasProp(object, prop) {
        return Object.prototype.hasOwnProperty.call(object, prop)
    },
}

/**
 *
 * @param {string} name
 * @param {ComponentInstance} proto
 * @return {function(props?:ComponentParams,content?:any): ComponentType}
 */
function createComponent(name, proto) {
    const defaults = proto.props || {}
    const render = proto.render

    /**
     *
     * @param {Object} [props]
     * @param {any} [content]
     * @return {ComponentType}
     */
    function component(props, content) {
        const config = merge({}, defaults, props || {})
        if (content) {
            config.content = content
        }
        try {
            return new Component(config, render)
        } catch (e) {
            console.log(e)
        }
    }

    components[name] = component
    options.componentCreated(name, component)
    return component
}

/**
 *
 * @param {string} name
 * @returns {ComponentRender}
 */
function getComponent(name) {
    return components[name]
}

exports.options = options
exports.Component = Component
exports.ComponentNode = ComponentNode
exports.ComponentSafeNode = ComponentSafeNode
exports.ComponentTextNode = ComponentTextNode
exports.ComponentTagNode = ComponentTagNode
exports.ComponentListNode = ComponentListNode
exports.ComponentArray = ComponentArray
exports.getComponent = getComponent
exports.configureComponent = configureComponent
exports.createComponent = createComponent
