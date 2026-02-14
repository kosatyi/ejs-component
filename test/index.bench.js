import { bench } from 'vitest'
import {
    ComponentListNode,
    ComponentSafeNode,
    ComponentTagNode,
    ComponentTextNode
} from '../src/index.js'

bench(
    'benchmark',
    () => {
        const node = new ComponentTagNode('div', {
            dataTooltip: 'benchmark',
            class: 'flex flex-col justify-center'
        })
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
    },
    {
        time: 1000
    }
)
