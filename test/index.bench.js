import { bench } from 'vitest'
import {
    ComponentListNode,
    ComponentSafeNode,
    ComponentTextNode,
    createComponent,
    getComponent
} from '../src/index.js'

bench(
    'benchmark',
    () => {

        createComponent('component',{
            props: {
                tag: 'div',
                attrs: {
                    class: 'ui-component',
                    dataControl: 'component',
                    ariaLabel: 'component',
                }
            },
            render(node,props,self) {
                node.addClass('bg-dark-100', 'tc-white-80')
                const safe = new ComponentSafeNode('<div>Content</div>')
                const child = new ComponentTextNode('content')
                const list = new ComponentListNode([
                    'item1',
                    'item2',
                    'item3',
                    'item4',
                    'item5'
                ])
                node.append(safe)
                node.append(child)
                node.append(list)
                node.append('content')
            }
        })
        const item = getComponent('component')
        const result = item({})
    },
    {
        time: 1000
    }
)
