const { Type, Schema } = require('@kosatyi/is-type')
const { isPlainObject, isString, isFunction,isObject, isArray, isNumber } = Type
const { merge } = Schema

/**
 * @typedef {ComponentNode|ComponentTagNode|ComponentListNode} ComponentType
 */

/**
 * @typedef {Object} ComponentTagNodeParams
 * @property {string} tag
 * @property {Object} [attrs]
 * @property {Array|String} [content]
 */

/**
 * @typedef {Object} ComponentListNodeParams
 * @property {Array|string} [content]
 */


/**
 * @typedef {ComponentTagNodeParams|ComponentListNodeParams} ComponentParams
 */

/**
 * @typedef {Object} ComponentTagNodeInstance
 * @property {ComponentParams} props
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
    componentCreated(name, component) {},
    escapeValue(value){
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
 *
 * @constructor
 */
function ComponentNode() {}

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
    hasChildNodes(node){
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
            if (isString(node.tagName) && isPlainObject(node.attributes)) {
                return new ComponentTagNode(
                    node.tagName,
                    node.attributes,
                    node.children || []
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
            const children = this.parentNode.children
            const index = children.indexOf(this)
            if (index > -1) {
                children.splice(index, 1)
            }
        }
    },
}

/**
 * @extends ComponentNode
 * @param content
 * @constructor
 */
function ComponentSafeNode(content) {
    ComponentNode.call(this)
    this.content = content.toString()
}

Object.setPrototypeOf(ComponentSafeNode.prototype, ComponentNode.prototype)

Object.assign(ComponentSafeNode.prototype, {
    toString() {
        return this.content
    },
    toJSON() {
        return {
            content: this.content,
        }
    },
})

/**
 * @extends ComponentNode
 * @param text
 * @constructor
 */
function ComponentTextNode(text) {
    ComponentNode.call(this)
    this.text = options.escapeValue(text)
}

Object.setPrototypeOf(ComponentTextNode.prototype, ComponentNode.prototype)

Object.assign(ComponentTextNode.prototype, {
    toString() {
        return this.text
    },
    toJSON() {
        return {
            text: this.text,
        }
    },
})

/**
 * @extends ComponentNode
 * @param tagName
 * @param attributes
 * @param children
 * @constructor
 */
function ComponentTagNode(tagName, attributes, children) {
    ComponentNode.call(this)
    this.tagName = tagName
    this.attributes = {}
    this.children = []
    if (isPlainObject(attributes)) {
        Object.entries(attributes).forEach(([name, value]) => {
            this.attr(name, value)
        })
    }
    if (isArray(children)) {
        children.forEach(item => {
            this.append(item)
        })
    } else {
        this.append(children)
    }
}

/**
 *
 */
Object.setPrototypeOf(ComponentTagNode.prototype, ComponentNode.prototype)
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
        node = this.getNode(node)
        if (node instanceof ComponentNode) {
            this.children.push(node.toParent(this))
        }
        return this
    },
    /**
     *
     * @param node
     * @return {ComponentTagNode}
     */
    prepend(node) {
        node = this.getNode(node)
        if (node instanceof ComponentNode) {
            this.children.unshift(node.toParent(this))
        }
        return this
    },
    /**
     *
     * @return {ComponentTagNode}
     */
    empty() {
        this.children.forEach(item => {
            item.toParent(null)
        })
        this.children = []
        return this
    },
    /**
     *
     * @returns {{children: ([]|[ComponentTextNode]|*), attributes: {} & *, tagName}}
     */
    toJSON() {
        return {
            tagName: this.tagName,
            attributes: this.attributes,
            children: this.children,
        }
    },
    /**
     *
     * @returns {string}
     */
    toString() {
        return options.tagNodeToString(this)
    },
    /**
     *
     * @returns {string[]}
     */
    classList() {
        return String(this.attributes.class || '')
            .trim()
            .split(/\s+/)
    },
    /**
     *
     * @returns {ComponentTagNode}
     */
    addClass() {
        const tokens = [].slice.call(arguments)
        const classList = this.classList()
        tokens.forEach(token => {
            if (!token) return true
            if (classList.indexOf(token) > -1) return true
            classList.push(token)
        })
        this.attributes.class = classList.join(' ').trim()
        return this
    },
    /**
     *
     * @returns {ComponentTagNode}
     */
    removeClass() {
        const tokens = [].slice.call(arguments)
        const classList = this.classList()
        tokens.forEach((token, index) => {
            if (!token) return true
            if (classList.indexOf(token) < 0) return
            classList.splice(index, 1)
        })
        this.attributes.class = classList.join(' ').trim()
        return this
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
                name = name.replace(/[A-Z]/g, '-$&').toLowerCase()
            }
            this.attributes[name] = value
        }
        return this
    },
    /**
     *
     * @param props
     */
    attrs(props) {
        if (isPlainObject(props)) {
            Object.entries(props).forEach(([name, value]) => {
                this.attr(name, value)
            })
        }
    },
    text(content) {
        this.children = [new ComponentTextNode(content)]
    },
})

/**
 * @extends ComponentNode
 * @param list
 * @constructor
 */
function ComponentListNode(list) {
    ComponentNode.call(this)
    this.children = []
    if (isArray(list)) {
        list.forEach(item => {
            this.append(item)
        })
    } else {
        this.append(list)
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
    toString() {
        return this.children.map(item => item.toString()).join('')
    },
    toJSON() {
        return this.children
    },
    /**
     *
     * @param node
     * @returns {ComponentListNode}
     */
    append(node) {
        node = this.getNode(node)
        if (node instanceof ComponentNode) {
            this.children.push(node.toParent(this))
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
            this.children.unshift(node.toParent(this))
        }
        return this
    },
})

/**
 * @constructor
 * @param {ComponentParams} props
 * @param {ComponentCallback} render
 * @return {ComponentType}
 */
function Component(props, render) {
    let node, replace
    if (isString(props.tag)) {
        node = new ComponentTagNode(props.tag, props.attrs, props.content)
    } else {
        node = new ComponentListNode(props.content)
    }
    if (isFunction(render)) replace = render(node, props, this)
    return replace ? replace : node
}

Component.prototype = {
    /**
     *
     * @param {string} tag
     * @param {Object} attrs
     * @param [children]
     * @returns {ComponentTagNode}
     */
    node(tag, attrs, children){
        return new ComponentTagNode(tag, attrs, children)
    },
    /**
     * @deprecated use `node` instead
     */
    create(tag,atts,children){
        return this.node(tag, attrs, children)
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
     * @param {object} props
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
        extra = extra || {}
        params = Object.entries(params).filter(([name]) => {
            return props.indexOf(name) !== -1
        })
        return Object.assign(Object.fromEntries(params), extra)
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
 * @return {function(props?:{},content?:[]): ComponentType}
 */
function createComponent(name, proto) {
    const render = proto.render
    const defaults = proto.props
    /**
     *
     * @param {Object} [props]
     * @param {any} [content]
     * @return {ComponentType}
     */
    function component(props, content) {
        const config = merge({}, defaults || {}, props || {})
        if (content) {
            config.content = content
        }
        const instance = new Component(config, render)
        if( instance ) {
            return instance
        } else {
            console.log('component',name,'empty output')
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
exports.ComponentNode = ComponentNode
exports.ComponentSafeNode = ComponentSafeNode
exports.ComponentTextNode = ComponentTextNode
exports.ComponentTagNode = ComponentTagNode
exports.ComponentListNode = ComponentListNode

exports.getComponent = getComponent
exports.configureComponent = configureComponent
exports.createComponent = createComponent
