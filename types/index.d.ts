export class ComponentNode {
    constructor()
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

export class ComponentSafeNode extends ComponentNode {
    html: string
    constructor(html: string)
}

export class ComponentTextNode extends ComponentNode {
    text: string
    constructor(text: string)
}

export class ComponentListNode extends ComponentNode {
    content: ComponentNode[]
    constructor(content: any[])
    append(node: any): this
    prepend(node: any): this
    empty(): void
}

export class ComponentTagNode extends ComponentListNode {
    constructor(tag: string, attrs: Record<string, any>, content: any | any[])
    getAttribute(name: string): any
    setAttribute(name: string, value: any): void
    removeAttribute(name: string): void
    classList(): string[]
    addClass(...token: string[]): void
    removeClass(...token: string[]): void
    attr(name: string | Record<string, any>, value?: any): void
}

export type ComponentType =
    | ComponentTagNode
    | ComponentTextNode
    | ComponentSafeNode
    | ComponentListNode

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
    prependList(list: any[], node: ComponentListNode): void
    appendList(list: any[], node: ComponentListNode): void
    static extend<Proto>(props: Proto): Proto & Component
}

export type ComponentParams<Props> = {
    props: Props
    render(node: ComponentType, props: Props, self: Component): ComponentType
}

export type ComponentRenderer = (
    props: Record<string, any>,
    content?: any | any[]
) => ComponentType

export function createComponent<Props>(
    name: string,
    params: ComponentParams<Props>
): (props: Record<string, any>, content: any) => void

export function getComponent<K extends string, V extends ComponentRenderer>(
    name: K
): V

export interface ComponentConfig extends Record<string, any> {
    logErrors(): void
    componentCreated(name: string, component: ComponentRenderer): void
    escapeValue(value: string): string
    isSafeString(node: ComponentNode): boolean
    tagToNodeString(node: ReturnType<ComponentType>): string
}

export function configureComponent(options: Partial<ComponentConfig>)
