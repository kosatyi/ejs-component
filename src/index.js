import {Type,Schema} from "@kosatyi/is-type";

const {isPlainObject, isString, isFunction, isArray, isNumber} = Type

const {merge} = Schema
/**
 *
 * @type {{}}
 */
const components = {}

const options = {
    componentCreated(component){

    },
    tagNodeToString(node){
        return JSON.stringify(node.toJSON())
    },
    isSafeString(node) {
        return node && isFunction(node.toString)
    }
}

export function configureComponent(params = {}){
    if( isFunction(params.componentCreated) ){
        options.componentCreated = params.componentCreated
    }
    if( isFunction(params.tagNodeToString) ){
        options.tagNodeToString = params.tagNodeToString
    }
    if( isFunction(params.isSafeString) ){
        options.isSafeString = params.isSafeString
    }
}

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
        if (node instanceof ComponentTagNode) {
            node.prepend(this)
        }
    },
    appendTo(node) {
        if (node instanceof ComponentTagNode) {
            node.append(this)
        }
        return this
    },
    remove() {
        if (this.parentNode instanceof ComponentTagNode) {
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
    this.text = text
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
    classList(value) {
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
        if( isPlainObject(props) ) {
            Object.entries(props).forEach(([name,value])=>{
                this.attr(name,value)
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
        return this.children.map( item => item.toString() ).join('')
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
    }
})

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
    let node,replace
    if( isString(props.tag) ) {
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
     * @param {object} [attrs]
     * @param {*} [children]
     * @returns {ComponentNode|ComponentTagNode}
     */
    create(tag, attrs, children) {
        return new ComponentTagNode(tag, attrs, children)
    },
    /**
     * @param {any[]} [children]
     */
    list(children){
        return new ComponentListNode(children)
    },
    /**
     *
     * @param {string} name
     * @param {object} props
     * @param {any[]} [content]
     * @return {ComponentNode|ComponentTagNode}
     */
    call(name, props, content) {
        const instance = components[name]
        if (instance) {
            return instance(props || {}, content)
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
        extra = extra || {}
        params = Object.entries(params).filter(([name]) => {
            return props.indexOf(name) !== -1
        })
        return Object.assign(Object.fromEntries(params), extra)
    },
}

/**
 *
 * @param {string} name
 * @param {ComponentParams} defaults
 * @return {function(params:{},content:[]): Component}
 */
export function createComponent(name, defaults) {
    const render = defaults.render
    delete defaults['render']
    function component(props, content) {
        props = props || {}
        delete props['render']
        const config = merge({}, defaults, props , {
            content
        })
        if( content ) {
            config.content = content
        }
        return new Component(config, render)
    }
    components[name] = component
    options.componentCreated(name,component);
    return component
}

/**
 *
 * @param name
 * @returns {*}
 */
export function getComponent(name) {
    return components[name]
}