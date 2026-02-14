import {
    isString,
    isFunction,
    isPlainObject,
    isNumber,
    isArray,
    merge
} from './utils.js'

/**
 * @typedef {object} ComponentConfig
 * @property {(e:Error)=>any} [logErrors]
 * @property {(name:string,component: ComponentRender)=>void} [componentCreated]
 * @property {(value:any)=>string} [escapeValue]
 * @property {(node: ComponentType)=>boolean} [isSafeString]
 * @property {(node: ReturnType<ComponentType.toJSON>)=>string} [tagNodeToString]
 */

/**
 * @typedef {ComponentNode|ComponentTagNode|ComponentListNode} ComponentType
 */

/**
 * @typedef {Record<string,any>} ComponentTagNodeParams
 * @property {string} [tag]
 * @property {Object} [attrs]
 * @property {Array|String} [content]
 */

/**
 * @typedef {Record<string,any>} ComponentListNodeParams
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
 *
 * @type {ComponentConfig}
 */
const options = {
    logErrors(e) {},
    componentCreated(name, component) {},
    isSafeString() {
        return false
    },
    escapeValue(value) {
        return value
    },
    tagNodeToString(node) {
        return JSON.stringify(node)
    }
}
/**
 *
 * @param {Partial<ComponentConfig>} params
 */
export const configureComponent = (params = {}) => {
    if (isFunction(params.logErrors)) {
        options.logErrors = params.logErrors
    }
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

export class ComponentArray extends Array {
    constructor() {
        super()
    }
    toString() {
        return this.join('')
    }
    toJSON() {
        return Array.from(this)
    }
}

export class ComponentNode {
    parentNode = null
    toParent(parent) {
        if (parent instanceof ComponentNode) {
            this.parentNode = parent
        }
        if (parent === null) {
            this.parentNode = null
        }
        return this
    }
    isSafeString(node) {
        return options.isSafeString(node)
    }
    hasChildNodes(node) {
        return node instanceof ComponentListNode
    }
    getNode(value) {
        if (value instanceof ComponentNode) {
            return value
        }
        if (this.isSafeString(value)) {
            return new ComponentSafeNode(value)
        }
        if (isString(value) || isNumber(value)) {
            return new ComponentTextNode(value)
        }
        if (isPlainObject(value)) {
            if (isString(value.tag) && isPlainObject(value.attrs)) {
                return new ComponentTagNode(
                    value.tag,
                    value.attrs,
                    value.content || []
                )
            }
        }
    }
    prependTo(node) {
        if (this.hasChildNodes(node)) {
            node.prepend(this)
        }
    }
    appendTo(node) {
        if (this.hasChildNodes(node)) {
            node.append(this)
        }
        return this
    }
    remove() {
        if (this.hasChildNodes(this.parentNode)) {
            const content = this.parentNode.content
            const index = content.indexOf(this.toParent(null))
            if (!!~index) {
                content.splice(index, 1)
            }
        }
    }
    toString() {
        return ''
    }
    toJSON() {
        return {}
    }
}

export class ComponentSafeNode extends ComponentNode {
    constructor(html) {
        super()
        this.html = String(html)
    }
    toString() {
        return this.html
    }
    toJSON() {
        return {
            html: this.html
        }
    }
}

export class ComponentTextNode extends ComponentNode {
    constructor(text) {
        super()
        this.text = String(options.escapeValue(text))
    }
    toString() {
        return this.text
    }
    toJSON() {
        return {
            text: this.text
        }
    }
}

export class ComponentListNode extends ComponentNode {
    constructor(content) {
        super()
        this.content = new ComponentArray()
        if (isArray(content)) {
            content.forEach(this.append.bind(this))
        } else {
            this.append(content)
        }
    }
    toJSON() {
        return {
            content: this.content
        }
    }
    toString() {
        return String(this.content)
    }
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
    }
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
    }
    empty() {
        this.content.forEach((item) => {
            item.toParent(null)
        })
        this.content.splice(0, this.content.length)
        return this
    }
}

export class ComponentTagNode extends ComponentListNode {
    constructor(tag, attrs, content) {
        super(content)
        this.tag = tag
        this.attrs = {}
        this.attr(attrs)
    }
    toString() {
        return options.tagNodeToString(this.toJSON())
    }
    toJSON() {
        return {
            tag: this.tag,
            attrs: this.attrs,
            content: this.content
        }
    }
    getAttribute(name) {
        return this.attrs[name]
    }
    setAttribute(name, value) {
        if (name) {
            if (name.indexOf('data') === 0 || name.indexOf('aria') === 0) {
                name = name.replace(/[A-Z]/g, '-$&').toLowerCase()
            }
            this.attrs[name] = value
        }
    }
    classList() {
        return String(this.getAttribute('class') || '')
            .trim()
            .split(/\s+/)
    }
    addClass() {
        const tokens = [].slice.call(arguments)
        const classList = this.classList()
        tokens.forEach((token) => {
            if (token && !~classList.indexOf(token)) {
                classList.push(token)
            }
        })
        this.setAttribute('class', classList.join(' ').trim())
        return this
    }
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
    }
    attr(name, value) {
        if (isPlainObject(name)) {
            Object.entries(name).forEach(([key, value]) => {
                this.setAttribute(key, value)
            })
        } else {
            this.setAttribute(name, value)
        }
    }
}

/**
 * @param {ComponentParams} props
 * @param {ComponentCallback} render
 * @return {ComponentType|string}
 */
export function Component(props, render) {
    let node, replace
    if (isString(props.tag)) {
        node = new ComponentTagNode(props.tag, props.attrs, props.content)
    } else {
        node = new ComponentListNode(props.content)
    }
    if (isFunction(render)) {
        replace = render(node, props, Component.prototype)
    }
    return replace ? replace : node
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
     * @param {string} value
     * @return {ComponentSafeNode}
     */
    safe(value) {
        return new ComponentSafeNode(value)
    },
    /**
     *
     * @param {string} name
     * @param {object} [props]
     * @param {any[]} [content]
     * @return {ComponentType}
     */
    call(name, props, content) {
        const instance = components.get(name)
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
        return Object.assign(
            Object.fromEntries(
                Object.entries(this.clean(params)).filter(
                    ([name]) => !!~props.indexOf(name)
                )
            ),
            this.clean(extra)
        )
    },
    /**
     *
     * @param {object} params
     * @param {array<string|number>} props
     * @param {object} [extra]
     * @returns {{[p: string]: any}}
     */
    omit(params, props, extra) {
        return Object.assign(
            Object.fromEntries(
                Object.entries(this.clean(params)).filter(
                    ([name]) => !~props.indexOf(name)
                )
            ),
            this.clean(extra)
        )
    },
    /**
     *
     * @param {object} params
     * @returns {{[p: string]: any}}
     */
    clean(params) {
        if (!params) return {}
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
    }
}

/**
 * @template {Object<string,any>} T
 * @param {T} object
 * @param {object} [options]
 */
Component.extend = (object, options = {}) => {
    /**
     * @template T
     * @type {T & Component.prototype}
     */
    Object.entries(object).forEach(([name, value]) => {
        Component.defineProperty(name, value, options)
    })
    return Component
}

Component.defineProperty = (
    name,
    value,
    { writable, configurable, enumerable }
) => {
    /**
     * @template T
     * @type {T & Component.prototype}
     */
    return Object.defineProperty(Component.prototype, name, {
        value,
        writable,
        configurable,
        enumerable
    })
}

/**
 * @type {Map<string, ComponentRender>}
 */
const components = new Map()

/**
 *
 * @param {string} name
 * @param {ComponentInstance} proto
 * @return {function(props?:ComponentParams,content?:any): ComponentType}
 */
export const createComponent = (name, proto) => {
    const defaults = proto.props || {}
    const render = proto.render
    /**
     *
     * @param {Object} [props]
     * @param {any} [content]
     * @return {ComponentType}
     */
    const component = (props, content) => {
        const config = merge({}, defaults, props || {})
        if (content) {
            config.content = content
        }
        try {
            return Component(config, render)
        } catch (e) {
            options.logErrors(e)
        }
    }
    components.set(name, component)
    options.componentCreated(name, component)
    return component
}

export const removeComponent = (name) => {
    components.delete(name)
}

/**
 *
 * @param {string} name
 * @returns {ComponentRender}
 */
export const getComponent = (name) => {
    return components.get(name)
}
