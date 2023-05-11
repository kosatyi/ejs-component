const {test, expect, describe, beforeEach, todo} = require('@jest/globals')

const {
    createComponent,
    configureComponent,
    ComponentArray,
    ComponentNode,
    ComponentTextNode,
    ComponentTagNode,
    ComponentSafeNode,
    ComponentListNode
} = require('../src');

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
    const node = new ComponentTextNode('test')
    test('toString', () => {
        node.toString()
    })
    test('toJSON', () => {
        node.toJSON()
    })
})
describe('ComponentTagNode', () => {
    const node = new ComponentTagNode('div', {
        dataTestAttr: 'name',
        ariaTestAttr: 'name'
    }, [
        'content'
    ])
    test('toString', () => {
        node.toString()
    })
    test('toJSON', () => {
        node.toJSON()
    })
    test('appendTo', () => {
        new ComponentTextNode('test').appendTo(node)
    })
    test('prependTo', () => {
        new ComponentTextNode('test').prependTo(node)
    })
    test('remove', () => {
        new ComponentTextNode('test').appendTo(node).remove()
    })
})

describe('ComponentSafeNode', () => {
    const node = new ComponentSafeNode({
        value: 'test',
        length: 4,
        toString() {
            return this.value
        }
    })
    test('toString', () => {
        node.toString()
    })
    test('toJSON', () => {
        node.toJSON()
    })
})


describe('ComponentListNode', () => {
    const node = new ComponentListNode([
        'test',
        'test'
    ])
    test('toString', () => {
        node.toString()
    })
    test('toJSON', () => {
        node.toJSON()
    })
    test('empty', () => {
        node.empty()
    })
})

describe('ComponentArray', () => {
    const array = new ComponentArray([1, 2, 3])
    test('toString', () => {
        array.toString()
    })
    test('toJSON', () => {
        array.toJSON()
    })
})

describe('createComponent', () => {

    const component = createComponent('test', {
        props: {
            tag: 'div',
            attrs: {}
        },
        render(node, props, self ) {
            node.append('string')
            node.append(1)
            node.append(self.create('div'))
            node.append({
                value: 'myValue',
                length: 4,
                toString(){
                    return this.value
                }
            })
            node.append({
                tagName: 'span',
                attributes: {},
                content: 'test'
            })
            node.addClass('container')
            node.removeClass('container')
            node.at
        }
    })


    test('createComponent', () => {

        const node = component()

        node.append('string')

        node.append(1)

        node.append(new ComponentTagNode('div'))

        node.append({
            value: 'myValue',
            length: 4,
            toString(){
                return this.value
            }
        })

        node.append({
            tagName: 'span',
            attributes: {},
            content: 'test'
        })

        node.addClass('container')
        node.removeClass('container')
        node.attr({
            ariaLabel: 'testArea',
            dataComponent: 'test'
        })
    })
})

describe('configureComponent', () => {
    test('configureComponent', () => {
        configureComponent({
            componentCreated(name, component) {},
            escapeValue(value){},
            tagNodeToString(node) {},
            isSafeString(node) {},
        })
    })
})
