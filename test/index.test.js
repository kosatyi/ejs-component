import { expect, describe, it, test } from 'vitest'
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
    ComponentListNode
} from '../src/index.js'

describe('Component.extend', () => {
    test('myMethod', () => {
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
    test('toString', () => {
        node.toString()
    })
    test('toJSON', () => {
        node.toJSON()
    })
})

describe('ComponentTagNode', () => {
    test('toString', () => {
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
    test('toString', () => {
        expect(node.toString()).toBe(
            '{"tag":"button","attrs":{"type":"submit","data-test-attr":"value","aria-test-attr":"value"},"content":[{"tag":"span","attrs":{},"content":[{"text":"content"}]}]}'
        )
    })
    test('toJSON', () => {
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

    test('setAttribute', () => {
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

    test('removeAttribute', () => {
        const node = new ComponentTagNode('div', { class: 'flex' })
        node.removeAttribute('class')
        expect(node.getAttribute('class')).toBeUndefined()
    })

    test('addClass', () => {
        const node = new ComponentTagNode('div')
        node.addClass()
        node.addClass('')
        node.addClass('flex', 'flex-row')
        expect(node.getAttribute('class')).toEqual('flex flex-row')
    })
    test('removeClass', () => {
        const node = new ComponentTagNode('div', { class: 'flex align-center' })
        node.removeClass()
        node.removeClass('', 'flex-row')
        node.removeClass('flex-column', 'flex')
        expect(node.getAttribute('class')).toEqual('align-center')
    })

    test('append valid', () => {
        const node = new ComponentTagNode('div', {})
        node.append('string')
        node.append(new ComponentTagNode('div'))
        node.append({ tag: 'div', attrs: {} })
        expect(node.content.length).toEqual(3)
    })
    test('append invalid', () => {
        const node = new ComponentTagNode('div', {})
        node.append(undefined)
        node.append(null)
        node.append({})
        expect(node.content.length).toEqual(0)
    })
    test('prepend valid', () => {
        const node = new ComponentTagNode('div', {})
        node.prepend('string')
        node.prepend(new ComponentTagNode('div'))
        expect(node.content.length).toEqual(2)
    })
    test('prepend invalid', () => {
        const node = new ComponentTagNode('div', {})
        node.prepend(undefined)
        node.prepend(null)
        node.prepend({})
        node.prepend(false)
        expect(node.content.length).toEqual(0)
    })
    test('appendTo valid', () => {
        const parent = new ComponentTagNode('div', {})
        const node = new ComponentTagNode('div', {})
        node.appendTo(parent)
        expect(node.parentNode).toEqual(parent)
    })
    test('appendTo invalid', () => {
        const node = new ComponentTagNode('div', {})
        node.appendTo('string')
        node.appendTo({})
        expect(node.parentNode).toBe(null)
    })
    test('prependTo valid', () => {
        const parent = new ComponentTagNode('div', {})
        const node = new ComponentTagNode('div', {})
        node.prependTo(parent)
        expect(node.parentNode).toEqual(parent)
    })
    test('prependTo invalid', () => {
        const node = new ComponentTagNode('div', {})
        node.prependTo('string')
        node.prependTo({})
        expect(node.parentNode).toBe(null)
    })
    test('remove', () => {
        const parent = new ComponentTagNode('div')
        const child = new ComponentTagNode('span')
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
    test('toString', () => {
        const safeNode = new ComponentSafeNode(safeString)
        expect(safeNode.toString()).toBe('content')
    })
    test('toJSON', () => {
        const safeNode = new ComponentSafeNode(safeString)
        expect(safeNode.toJSON()).toEqual({ html: 'content' })
    })
    test('append safeString', () => {
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
    test('toString', () => {
        expect(node.toString()).toBe('ListNode')
    })
    test('toJSON', () => {
        expect(node.toJSON()).toMatchObject({
            content: [{ text: 'List' }, { text: 'Node' }]
        })
    })
    test('empty', () => {
        node.empty()
        expect(node.content.length).toEqual(0)
    })
})

describe('createComponent', () => {
    test('list', () => {
        const component = createComponent('list', {})
        expect(component()).toBeInstanceOf(ComponentListNode)
    })
    test('tag', () => {
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
                self.call('undefined')
                self.call('list')
                self.safe('content')
                self.list()
                self.pick(props, ['tag', 'attrs'])
                self.omit(props, ['name'])
                self.join([1, 2, 3], '-')
                self.appendList({}, node)
                self.prependList({}, node)
                self.appendList([['item', {}, []]], node)
                self.prependList([['item', {}, []]], node)
                self.appendList(self.empty(), node)
                self.prependList(self.empty(), node)
                self.getNodeItem(['item', {}, []])
                self.getNodeItem(self.empty())
                self.getNodeItem({})
                self.hasProp(props, 'tag')
            }
        })
        expect(component({}, ['content'])).toBeInstanceOf(ComponentTagNode)
    })
    test('tag:replace', () => {
        const component = createComponent('div', {
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
    test('undefined', () => {
        const component = createComponent('div', {
            props: {},
            render() {
                throw Error('failed')
            }
        })
        expect(component()).toBeUndefined()
    })
})

describe('getComponent', () => {
    createComponent('div', {})
    it('exist', () => {
        expect(typeof getComponent('div')).toBe('function')
    })
    it('undefined', () => {
        expect(typeof getComponent('error')).toBe('undefined')
    })
})
describe('removeComponent', () => {
    createComponent('div', {})
    it('remove', () => {
        removeComponent('div')
        expect(typeof getComponent('div')).toBe('undefined')
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
