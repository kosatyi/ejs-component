export class ComponentNode {
    constructor()
    parentNode: ComponentNode
    toParent(parent: any): this
    isSafeString(node: any): boolean
    hasChildNodes(node: any): boolean
    getNode(value: any): ComponentType
    prependTo(node: ComponentTreeType): this
    appendTo(node: ComponentTreeType): this
    remove(): void
    toString(): string
    toJSON(): Record<string, any>
}

export class ComponentSafeNode extends ComponentNode {
    html: string
    constructor(html: string)
}

export class ComponentTextNode extends ComponentNode {
    text: string
    constructor(text: string)
}

export class ComponentListNode extends ComponentNode {
    content: any[]
    constructor(content: any[])
    append(node: any): this
    prepend(node: any): this
    empty(): void
}

export class ComponentTree {
    render(content: any[]): ComponentTreeType
    toString(): string
}

export class ComponentTagNode extends ComponentListNode {
    tag: string
    attrs: Record<string, any>
    content: any[]
    constructor(tag: string, attrs: Record<string, any>, content: any | any[])
    getAttribute(name: string): any
    setAttribute(name: string, value: any): void
    removeAttribute(name: string): void
    classList(): string[]
    addClass(...token: string[]): void
    removeClass(...token: string[]): void
    attr(name: string | Record<string, any>, value?: any): void
}

export type ComponentTreeType = ComponentTagNode | ComponentListNode

export type ComponentType =
    | ComponentTreeType
    | ComponentTextNode
    | ComponentSafeNode

export class Component {
    clean<T extends Record<string, any>>(params: T): Partial<T>
    pick<T, K extends keyof T, E = {}>(
        params: T,
        props: K[],
        extra?: E
    ): Pick<T, K> & E
    omit<T, K extends keyof T, E = {}>(
        params: T,
        props: K[],
        extra?: E
    ): Omit<T, K> & E
    call(
        name: string,
        props?: Record<string, any>,
        content?: any | any[]
    ): ComponentType
    tree(content?: any[]): ComponentTree
    list(content?: any[]): ComponentListNode
    safe(value: string): ComponentSafeNode
    create(
        tag: string,
        attrs?: Record<string, any>,
        content?: any | any[]
    ): ComponentTagNode
    join(list: any[], delimiter: string): string
    hasProp(object: Record<string, any>, prop: string): boolean
    getNodeItem(item: any): ComponentType
    prependList(list: any[], node: ComponentTreeType): void
    appendList(list: any[], node: ComponentTreeType): void
    static extend<Proto>(props: Proto): Proto & Component
}

export interface ComponentConfig {
    logErrors(e: Error): void
    componentCreated(name: string, component: ComponentRenderer): void
    escapeValue(value: string): string
    isSafeString(node: ComponentNode): boolean
    tagNodeToString(node: ComponentTagNode): string
}

export type ComponentRenderer = (
    props: Record<string, any>,
    content?: any | any[]
) => ComponentType

export const renderComponent: ComponentRenderer

export function createComponent<ComponentProps extends Record<string, any>>(
    name: string,
    params: {
        props?: ComponentProps
        render?(
            node: ComponentTreeType,
            props: ComponentProps,
            self: Component
        ): ComponentType | void
    }
): typeof renderComponent

export function getComponent<K extends string, V extends ComponentRenderer>(
    name: K
): V

export function removeComponent(name: string): void

export function configureComponent(options: Partial<ComponentConfig>): void
