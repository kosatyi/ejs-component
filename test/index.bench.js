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
        createComponent('slot', {
            props: { tag: 'div', attrs: { class: '' } },
            render() {}
        })
        createComponent('customComponent', {
            props: {
                tag: 'div',
                attrs: {
                    class: 'ui-component',
                    dataControl: 'component',
                    ariaLabel: 'component'
                }
            },
            render(node, props, self) {
                node.addClass(
                    'bg-dark-100',
                    'tc-white-80',
                    'flex-col',
                    'md:flex-row'
                )
                node.append(self.safe('<div>Content</div>'))
                node.append('text node')
                node.append(
                    self.list(['item1', 'item2', 'item3', 'item4', 'item5'])
                )
                const { root } = self.tree([
                    'slot',
                    { class: 'widget' },
                    [
                        [
                            'slot',
                            { $key: 'header', class: 'widget-header' },
                            'header'
                        ],
                        [
                            'slot',
                            { $key: 'content', class: 'widget-content' },
                            'content'
                        ],
                        [
                            'slot',
                            { $key: 'footer', class: 'widget-footer' },
                            'footer'
                        ]
                    ]
                ])
                node.append(root)
                node.append('content')
            }
        })
        getComponent('customComponent')()
    },
    {
        time: 1000
    }
)
