const isString = (v) => typeof v === 'string';
const isNumber = (v) => typeof v === 'number';
const isFunction = (v) => typeof v === 'function';

const isPlainObject = (o) => {
    if (typeof o !== 'object' || o === null) return false
    let proto = o;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(o) === proto
};

const merge = (target, ...list) => {
    for (const index of Object.keys(list)) {
        const source = list[index];
        for (const key of Object.keys(source)) {
            const value = source[key];
            if (isPlainObject(value)) {
                target[key] = merge(target[key] || {}, value);
                continue
            }
            if (Array.isArray(value)) {
                target[key] = merge(target[key] || [], value);
                continue
            }
            target[key] = value;
        }
    }
    return target
};

const attrRe = /[\w-]+/;
const attrCamelRe = /^(data|aria)/;
const upperRe = /[A-Z]/g;

const attrName = (name) => {
    name = String(name);
    if (name.match(attrRe)) {
        if (name.match(attrCamelRe)) {
            name = name.replace(upperRe, '-$&').toLowerCase();
        }
        return name
    }
};

const options = {
    logErrors() {},
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
};

const configureComponent = (params = {}) => {
    if (isFunction(params.logErrors)) {
        options.logErrors = params.logErrors;
    }
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
};

class ComponentNode {
    parentNode = null
    toParent(parent) {
        if (parent instanceof ComponentNode) {
            this.parentNode = parent;
        }
        if (parent === null) {
            this.parentNode = null;
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
            node.prepend(this);
        }
    }
    appendTo(node) {
        if (this.hasChildNodes(node)) {
            node.append(this);
        }
        return this
    }
    remove() {
        if (this.hasChildNodes(this.parentNode)) {
            const content = this.parentNode.content;
            const index = content.indexOf(this.toParent(null));
            if (!!~index) {
                content.splice(index, 1);
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

class ComponentSafeNode extends ComponentNode {
    constructor(html) {
        super();
        this.html = String(html);
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

class ComponentTextNode extends ComponentNode {
    constructor(text) {
        super();
        this.text = String(options.escapeValue(text));
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

class ComponentListNode extends ComponentNode {
    constructor(content) {
        super();
        this.content = [];
        if (Array.isArray(content)) {
            content.forEach(this.append.bind(this));
        } else {
            this.append(content);
        }
    }
    toJSON() {
        return {
            content: this.content
        }
    }
    toString() {
        return String(this.content.join(''))
    }
    append(node) {
        node = this.getNode(node);
        if (node instanceof ComponentNode) {
            this.content.push(node.toParent(this));
        }
        return this
    }
    prepend(node) {
        node = this.getNode(node);
        if (node instanceof ComponentNode) {
            this.content.unshift(node.toParent(this));
        }
        return this
    }
    empty() {
        this.content.forEach((item) => {
            item.toParent(null);
        });
        this.content.splice(0, this.content.length);
        return this
    }
}

class ComponentTagNode extends ComponentListNode {
    constructor(tag, attrs, content) {
        super(content);
        this.tag = tag;
        this.attrs = {};
        this.attr(attrs);
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
        name = attrName(name);
        if (name) {
            return this.attrs[name]
        }
    }
    removeAttribute(name) {
        name = attrName(name);
        if (name) {
            delete this.attrs[name];
        }
    }
    setAttribute(name, value) {
        name = attrName(name);
        if (name) {
            if (value === null || value === undefined) {
                delete this.attrs[name];
            } else {
                this.attrs[name] = value;
            }
        }
    }
    classList() {
        return String(this.attrs.class || '')
            .trim()
            .split(/\s+/)
    }
    addClass(...tokens) {
        const classList = this.classList();
        tokens.forEach((token) => {
            if (token && !~classList.indexOf(token)) {
                classList.push(token);
            }
        });
        this.attrs.class = classList.join(' ').trim();
        return this
    }
    removeClass(...tokens) {
        const classList = this.classList();
        tokens.forEach((token) => {
            if (token) {
                const index = classList.indexOf(token);
                if (!!~index) {
                    classList.splice(index, 1);
                }
            }
        });
        this.attrs.class = classList.join(' ').trim();
        return this
    }
    attr(name, value) {
        if (isPlainObject(name)) {
            Object.entries(name).forEach(([key, value]) => {
                this.setAttribute(key, value);
            });
        } else {
            this.setAttribute(name, value);
        }
    }
}

class Component {
    static extend(object, options = {}) {
        Object.entries(object).forEach(([name, value]) => {
            Component.defineProperty(name, value, options);
        });
        return Component
    }
    static defineProperty(
        name,
        value,
        { writable, configurable, enumerable } = {}
    ) {
        return Object.defineProperty(Component.prototype, name, {
            value,
            writable,
            configurable,
            enumerable
        })
    }
    empty() {
        return new ComponentNode()
    }
    create(tag, attrs, content) {
        return new ComponentTagNode(tag, attrs, content)
    }
    list(content) {
        return new ComponentListNode(content)
    }
    safe(value) {
        return new ComponentSafeNode(value)
    }
    call(name, props, content) {
        const instance = components.get(name);
        if (instance) {
            return instance(props || {}, content)
        }
    }
    pick(params, props, extra) {
        return Object.assign(
            Object.fromEntries(
                Object.entries(this.clean(params)).filter(
                    ([name]) => !!~props.indexOf(name)
                )
            ),
            this.clean(extra)
        )
    }
    omit(params, props, extra) {
        return Object.assign(
            Object.fromEntries(
                Object.entries(this.clean(params)).filter(
                    ([name]) => !~props.indexOf(name)
                )
            ),
            this.clean(extra)
        )
    }
    clean(params) {
        if (!params) return {}
        return Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
        )
    }
    join(array, delimiter) {
        return [].slice.call(array).join(delimiter).trim()
    }
    hasProp(object, prop) {
        return Object.prototype.hasOwnProperty.call(object, prop)
    }
    getNodeItem(item) {
        if (item instanceof ComponentNode) return item
        if (Array.isArray(item)) {
            const [name, props, content] = item;
            return this.call(name, props, content)
        }
        return this.empty()
    }
    prependList(list, node) {
        if (Array.isArray(list)) {
            list.reverse().forEach((item) => {
                item = this.getNodeItem(item);
                if (item) item.prependTo(node);
            });
        }
    }
    appendList(list, node) {
        if (Array.isArray(list)) {
            list.forEach((item) => {
                item = this.getNodeItem(item);
                if (item) item.appendTo(node);
            });
        }
    }
}

const renderComponent = (props, render) => {
    let node, replace, self = new Component();
    if (isString(props.tag)) {
        node = new ComponentTagNode(props.tag, props.attrs, props.content);
    } else {
        node = new ComponentListNode(props.content);
    }
    if (isFunction(render)) {
        replace = render(node, props, self);
    }
    return replace ? replace : node
};

const components = new Map();

const createComponent = (name, config) => {
    const defaults = config.props || {};
    const render = config.render;
    const component = (props, content) => {
        const config = merge({}, defaults, props || {});
        if (content) {
            config.content = content;
        }
        try {
            return renderComponent(config, render)
        } catch (e) {
            options.logErrors(e);
        }
    };
    components.set(name, component);
    options.componentCreated(name, component);
    return component
};

const removeComponent = (name) => {
    components.delete(name);
};

const getComponent = (name) => {
    return components.get(name)
};

export { Component, ComponentListNode, ComponentNode, ComponentSafeNode, ComponentTagNode, ComponentTextNode, configureComponent, createComponent, getComponent, removeComponent, renderComponent };
