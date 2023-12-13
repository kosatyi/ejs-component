const {test, expect, describe, beforeEach, todo} = require('@jest/globals')

const {
    createComponent,
    configureComponent,
    getComponent,
    Component,
    ComponentArray,
    ComponentNode,
    ComponentTextNode,
    ComponentTagNode,
    ComponentSafeNode,
    ComponentListNode
} = require('../src');

describe('Component.extend', () => {
    Component.extend({
        myMethod(){
            return 'value'
        }
    })
    test('myMethod', () => {
        new Component({},function(node,props,self){
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
    const node = new ComponentTextNode('test')
    test('toString', () => {
        node.toString()
    })
    test('toJSON', () => {
        node.toJSON()
    })
})
describe('ComponentTagNode', () => {

    const node = new ComponentTagNode('button', {
        type: 'submit',
        dataTestAttr: 'name',
        ariaTestAttr: 'name'
    }, ['submit'])

    test('toString', () => {
        node.toString()
    })
    test('toJSON', () => {
        node.toJSON()
    })

    test('addClass', () => {
        const node = new ComponentTagNode('div')
        node.addClass()
        node.addClass('')
        node.addClass('test','test')
    })

    test('removeClass', () => {
        const node = new ComponentTagNode('div',{class: 'test'})
        node.removeClass()
        node.removeClass('','test')
        node.removeClass('test')
    })
    test('append', () => {
        new ComponentTagNode('div').append({})
        new ComponentTagNode('div').append('string')
        new ComponentTagNode('div').append(new ComponentTagNode('div'))
        new ComponentTagNode('div').append({
            value: 'value',
            length: 5,
            toString(){
                return this.value
            }
        })
        new ComponentTagNode('div').append({
            tag: 'div',
            attrs: {

            }
        })
    })
    test('prepend', () => {
        new ComponentTagNode('div').prepend({})
        new ComponentTagNode('div').prepend('string')
        new ComponentTagNode('div').prepend(new ComponentTagNode('div'))
    })
    test('appendTo', () => {
        new ComponentTagNode('div').appendTo(node)
        new ComponentTagNode('div').appendTo('string')
    })
    test('prependTo', () => {
        new ComponentTagNode('test').prependTo(node)
        new ComponentTagNode('test').prependTo('string')
    })
    test('remove', () => {
        const parent = new ComponentTagNode('div')
        const child = new ComponentTagNode('test')
        child.remove()
        child.parentNode = parent
        child.remove()
        child.appendTo(node).remove()
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

    const listComponent = createComponent('list', {})

    const replaceComponent = createComponent('header', {
        props: {
            tag: 'header',
            attrs: {}
        },
        render(node,props,self){
            return self.create('div',{
                class: 'header'
            })
        },
    })

    const tagComponent = createComponent('button', {
        props: {
            tag: 'button',
            attrs: {}
        },
        render(node,props,self){
            self.create('div')
            self.call('undefined')
            self.call('list')
            self.list()
            self.pick(props,['tag','attrs'])
            self.omit(props,['name'])
            self.join([1,2,3],'-')
            self.hasProp(props,'tag')
        }
    })

    const errorComponent = createComponent('failed', {
        props:{},
        render(){
            throw Error('failed')
        }
    })



    test('createComponent', () => {

        tagComponent({},['content'])
        listComponent()
        errorComponent()
        replaceComponent({

        })

    })
})

describe('getComponent', () => {
    test('getComponent', () => {
        getComponent('test')
    })
})

describe('configureComponent', () => {
    test('configureComponent', () => {
        configureComponent()
        configureComponent({
            componentCreated() {},
            escapeValue(){},
            tagNodeToString() {},
            isSafeString() {},
        })
    })
})


