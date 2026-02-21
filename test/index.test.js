import { expect, describe, it } from 'vitest'
import {
    createComponent,
    removeComponent,
    renderComponent,
    configureComponent,
    getComponent,
    Component,
    ComponentNode,
    ComponentTextNode,
    ComponentTagNode,
    ComponentSafeNode,
    ComponentListNode,
    ComponentTree
} from '../src/index.js'

describe('Component.extend', () => {
    it('myMethod', () => {
        Component.extend({
            myMethod() {
                return 'value'
            }
        })
        renderComponent({}, (node, props, self) => {
            expect(self.myMethod()).toBe('value')
        })
    })
})

describe('ComponentNode', () => {
    const node = new ComponentNode()
    it('toString', () => {
        node.toString()
    })
    it('toJSON', () => {
        node.toJSON()
    })
})

describe('ComponentTagNode', () => {
    it('toString', () => {
        const node = new ComponentTextNode('content')
        expect(node.toString()).toBe('content')
    })
})

describe('ComponentTagNode', () => {
    const node = new ComponentTagNode(
        'button',
        {
            type: 'submit',
            dataTestAttr: 'value',
            ariaTestAttr: 'value'
        },
        [new ComponentTagNode('span', {}, ['content'])]
    )
    it('toString', () => {
        expect(node.toString()).toBe(
            '{"tag":"button","attrs":{"type":"submit","data-test-attr":"value","aria-test-attr":"value"},"content":[{"tag":"span","attrs":{},"content":[{"text":"content"}]}]}'
        )
    })
    it('toJSON', () => {
        expect(node.toJSON()).toMatchObject({
            tag: 'button',
            attrs: {
                type: 'submit',
                'aria-test-attr': 'value',
                'data-test-attr': 'value'
            },
            content: [
                { attrs: {}, tag: 'span', content: [{ text: 'content' }] }
            ]
        })
    })

    it('setAttribute', () => {
        const node = new ComponentTagNode('div', {})
        node.setAttribute('&^*(%(^&^%', 'content')
        node.setAttribute('', 'content')
        node.setAttribute('null', 'content')
        node.setAttribute('123id', 'content')
        node.setAttribute('id', 'content')
        node.setAttribute('dataControl', 'layout')
        expect(node.getAttribute('id')).toBe('content')
        expect(node.getAttribute('dataControl')).toBe('layout')
    })

    it('getAttribute', () => {
        const node = new ComponentTagNode('div', { id: 'content' })
        expect(node.getAttribute([])).toBe(undefined)
        expect(node.getAttribute(123)).toBe(undefined)
        expect(node.getAttribute(undefined)).toBe(undefined)
        expect(node.getAttribute('id')).toBe('content')
    })

    it('hasAttribute', () => {
        const node = new ComponentTagNode('div', {})
        node.setAttribute('id', 'content')
        node.setAttribute('dataControl', 'layout')
        expect(node.hasAttribute('undef')).toBe(false)
        expect(node.hasAttribute('id')).toBe(true)
        expect(node.hasAttribute('dataControl')).toBe(true)
    })

    it('toggleAttribute', () => {
        const node = new ComponentTagNode('div', {})
        node.toggleAttribute('dataState', true)
        expect(node.hasAttribute('dataState')).toBe(true)
        node.toggleAttribute('dataState', false)
        expect(node.hasAttribute('dataState')).toBe(false)
    })

    it('removeAttribute', () => {
        const node = new ComponentTagNode('div', { class: 'flex' })
        node.removeAttribute([])
        node.removeAttribute('class')
        expect(node.getAttribute('class')).toBeUndefined()
    })

    it('addClass', () => {
        const node = new ComponentTagNode('div')
        node.addClass()
        node.addClass('')
        node.addClass('flex', 'flex-row')
        expect(node.getAttribute('class')).toEqual('flex flex-row')
    })
    it('removeClass', () => {
        const node = new ComponentTagNode('div', { class: 'flex align-center' })
        node.removeClass()
        node.removeClass('', 'flex-row')
        node.removeClass('flex-column', 'flex')
        expect(node.getAttribute('class')).toEqual('align-center')
    })

    it('append valid', () => {
        const node = new ComponentTagNode('div', {})
        node.append('string')
        node.append(new ComponentTagNode('div'))
        node.append({ tag: 'div', attrs: {} })
        expect(node.content.length).toEqual(3)
    })
    it('append invalid', () => {
        const node = new ComponentTagNode('div', {})
        node.append(undefined)
        node.append(null)
        node.append({})
        expect(node.content.length).toEqual(0)
    })
    it('prepend valid', () => {
        const node = new ComponentTagNode('div', {})
        node.prepend('string')
        node.prepend(new ComponentTagNode('div'))
        expect(node.content.length).toEqual(2)
    })
    it('prepend invalid', () => {
        const node = new ComponentTagNode('div', {})
        node.prepend(undefined)
        node.prepend(null)
        node.prepend({})
        node.prepend(false)
        expect(node.content.length).toEqual(0)
    })
    it('appendTo valid', () => {
        const parent = new ComponentTagNode('div', {})
        const node = new ComponentTagNode('div', {})
        node.appendTo(parent)
        expect(node.parentNode).toEqual(parent)
    })
    it('appendTo invalid', () => {
        const node = new ComponentTagNode('div', {})
        node.appendTo('string')
        node.appendTo({})
        expect(node.parentNode).toBe(null)
    })
    it('prependTo valid', () => {
        const parent = new ComponentTagNode('div', {})
        const node = new ComponentTagNode('div', {})
        node.prependTo(parent)
        expect(node.parentNode).toEqual(parent)
    })
    it('prependTo invalid', () => {
        const node = new ComponentTagNode('div', {})
        node.prependTo('string')
        node.prependTo({})
        expect(node.parentNode).toBe(null)
    })
    it('remove', () => {
        const parent = new ComponentTagNode('div')
        const child = new ComponentTagNode('span')
        const text = new ComponentTextNode('content')
        text.remove()
        parent.append(child)
        child.remove()
        expect(child.parentNode).toBe(null)
        child.appendTo(parent).remove()
        expect(child.parentNode).toBe(null)
    })
})

describe('ComponentSafeNode', () => {
    function SafeString(html) {
        this.value = String(html)
        this.length = this.value.length
        Object.freeze(this)
    }
    SafeString.prototype.toString = function () {
        return this.value
    }
    configureComponent({
        isSafeString(node) {
            return node && node instanceof SafeString
        }
    })
    const safeString = new SafeString('content')
    it('toString', () => {
        const safeNode = new ComponentSafeNode(safeString)
        expect(safeNode.toString()).toBe('content')
    })
    it('toJSON', () => {
        const safeNode = new ComponentSafeNode(safeString)
        expect(safeNode.toJSON()).toEqual({ html: 'content' })
    })
    it('append safeString', () => {
        const parent = new ComponentTagNode('div')
        parent.append(safeString)
        expect(parent.toJSON()).toMatchObject({
            tag: 'div',
            attrs: {},
            content: [
                {
                    html: 'content'
                }
            ]
        })
    })
})

describe('ComponentListNode', () => {
    const node = new ComponentListNode(['List', 'Node'])
    it('toString', () => {
        expect(node.toString()).toBe('ListNode')
    })
    it('toJSON', () => {
        expect(node.toJSON()).toMatchObject({
            content: [{ text: 'List' }, { text: 'Node' }]
        })
    })
    it('empty', () => {
        node.empty()
        expect(node.content.length).toEqual(0)
    })
})

describe('createComponent', () => {
    it('list', () => {
        const component = createComponent('list', {})
        expect(component()).toBeInstanceOf(ComponentListNode)
    })
    it('tag', () => {
        const item = createComponent('item', {
            props: {
                tag: 'div'
            },
            render() {}
        })
        const component = createComponent('button', {
            props: {
                tag: 'button',
                attrs: {}
            },
            render(node, props, self) {
                self.create('div')
                self.safe('content')
                self.list()
                self.tree([])
                self.call('undefined')
                self.call('list')
                self.pick(props, ['tag', 'attrs'])
                self.omit(props, ['name'])
                self.join([1, 2, 3], '-')
                self.appendList({}, node)
                self.prependList({}, node)
                self.appendList([['item', {}, []]], node)
                self.prependList([['item', {}, []]], node)
                self.appendList(self.empty(), node)
                self.prependList(self.empty(), node)
                self.appendList([['', '', '', '']], node)
                self.prependList([['', '', '', '']], node)
                self.getNodeItem(['item', {}, []])
                self.getNodeItem(self.empty())
                self.getNodeItem({})
                self.hasProp(props, 'tag')
            }
        })
        expect(component({}, ['content'])).toBeInstanceOf(ComponentTagNode)
    })
    it('tag:replace', () => {
        const component = createComponent('customComponent', {
            props: {
                tag: 'div',
                attrs: {}
            },
            render(node, props, self) {
                return self.create('span', {})
            }
        })
        const result = component()
        expect(result).toBeInstanceOf(ComponentTagNode)
        expect(result.tag).toBe('span')
    })
    it('undefined', () => {
        const component = createComponent('customComponent', {
            props: {},
            render() {
                throw Error('failed')
            }
        })
        expect(component()).toBeUndefined()
    })
})

describe('getComponent', () => {
    createComponent('customComponent', {})
    it('exist', () => {
        expect(typeof getComponent('customComponent')).toBe('function')
    })
    it('undefined', () => {
        expect(typeof getComponent('error')).toBe('undefined')
    })
})
describe('removeComponent', () => {
    createComponent('customComponent', {})
    it('remove', () => {
        removeComponent('customComponent')
        expect(typeof getComponent('customComponent')).toBe('undefined')
    })
})

describe('configureComponent', () => {
    it('empty', () => {
        configureComponent()
    })
    it('full', () => {
        configureComponent({
            logErrors() {},
            componentCreated() {},
            escapeValue() {},
            tagNodeToString() {},
            isSafeString() {}
        })
    })
})

describe('ComponentTree', () => {
    createComponent('slot', {
        props: {
            tag: 'div',
            attrs: {}
        },
        render(node, props) {
            node.addClass(props.class)
        }
    })
    const node = new ComponentTree([
        'slot',
        { class: 'widget' },
        [
            [1, {}],
            ['undef', {}, 'content'],
            [('slot', { $key: 'header', class: 'widget-header' }, 'header')],
            ['slot', { $key: 'content', class: 'widget-content' }, 'content'],
            ['slot', { $key: 'footer', class: 'widget-footer' }, 'footer']
        ]
    ])
    it('toString', () => {
        String(node)
    })
})
