import { expect, describe, it } from 'vitest'
import {
    createComponent,
    removeComponent,
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
    it('myMethod', () => {
        Component.extend({
            myMethod() {
                return 'value'
            }
        })
        Component({}, function (node, props, self) {
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
                self.hasProp(props, 'tag')
            }
        })
        expect(component({}, ['content'])).toBeInstanceOf(ComponentTagNode)
    })
    it('tag:replace', () => {
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
    it('undefined', () => {
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
