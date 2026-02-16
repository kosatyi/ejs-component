interface ComponentNode {
    parentNode: ComponentNode
    toParent(parent: any): this
    isSafeString(node: any): boolean
    hasChildNodes(node: any): boolean
    getNode(value: any): ComponentType
    prependTo(node: ComponentType): this
    appendTo(node: ComponentType): this
    remove(): void
    toString(): string
    toJSON(): Record<string, any>
}
interface ComponentSafeNode extends ComponentNode {
    html: string
}

interface ComponentTextNode extends ComponentNode {
    text: string
}
interface ComponentListNode extends ComponentNode {
    content: ComponentNode[]
    append(node: any): this
    prepend(node: any): this
    empty(): void
}
interface ComponentTagNode extends ComponentListNode {
    getAttribute(name: string): any
    setAttribute(name: string, value: any): void
    removeAttribute(name: string): void
    classList(): string[]
    addClass(...token: string[]): void
    removeClass(...token: string[]): void
    attr(name: string | Record<string, any>, value?: any): void
}

type ComponentType =
    | ComponentTagNode
    | ComponentTextNode
    | ComponentSafeNode
    | ComponentListNode

class Component {
    clean<T extends Record<string, any>>(params: T): Partial<T>
    pick<T, K extends string, E = {}>(
        params: T,
        props: K[],
        extra?: E
    ): Pick<T, K> & E
    omit<T, K extends string, E = {}>(
        params: T,
        props: K[],
        extra?: E
    ): Omit<T, K> & E
    call(
        name: string,
        props?: Record<string, any>,
        content?: any | any[]
    ): ComponentType
    list(content?: any[]): ComponentListNode
    safe(value: string): ComponentSafeNode
    create(
        tag: string,
        attrs?: Record<string, any>,
        content?: any | any[]
    ): ComponentTagNode
    join(list: any[], delimiter: string): string
    hasProp(object, prop): boolean
    getNodeItem(item: any): ComponentType
    prependList(list, node: ComponentListNode): void
    appendList(list, node: ComponentListNode): void
    static extend<Proto>(props: Proto): Proto & Component
}

type ComponentConfig<Props> = {
    props: Props
    render(node: ComponentType, props: Props, self: Component): ComponentType
}

type ComponentRenderer = (
    props: Record<string, any>,
    content?: any | any[]
) => ComponentType

export function createComponent<Props>(
    name: string,
    config: ComponentConfig<Props>
): (props: Record<string, any>, content: any) => void

export function getComponent<K extends string, V extends ComponentRenderer>(
    name: K
): V
