export const isString = (v) => typeof v === 'string'
export const isNumber = (v) => typeof v === 'number'
export const isFunction = (v) => typeof v === 'function'
export const isArray = (v) => Array.isArray(v)

export const isPlainObject = (o) => {
    if (typeof o !== 'object' || o === null) return false
    let proto = o
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto)
    }
    return Object.getPrototypeOf(o) === proto
}

export const merge = (target, ...list) => {
    for (const index of Object.keys(list)) {
        const source = list[index]
        for (const key of Object.keys(source)) {
            const value = source[key]
            if (isPlainObject(value)) {
                target[key] = merge(target[key] || {}, value)
                continue
            }
            if (isArray(value)) {
                target[key] = merge(target[key] || [], value)
                continue
            }
            target[key] = value
        }
    }
    return target
}

const attrRe = /[\w-]+/
const attrCamelRe = /^(data|aria)/
const upperRe = /[A-Z]/g

export const attrName = (name) => {
    name = String(name)
    if (name.match(attrRe)) {
        if (name.match(attrCamelRe)) {
            name = name.replace(upperRe, '-$&').toLowerCase()
        }
        return name
    }
}
