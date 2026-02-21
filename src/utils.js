export const isString = (v) => typeof v === 'string'
export const isNumber = (v) => typeof v === 'number'
export const isFunction = (v) => typeof v === 'function'
export const isPlainObject = (v) => {
    if (!v || typeof v !== 'object') return false
    const proto = Object.getPrototypeOf(v)
    const hasObjectPrototype =
        proto === null ||
        proto === Object.prototype ||
        Object.getPrototypeOf(proto) === null
    if (!hasObjectPrototype) {
        return false
    }
    return Object.prototype.toString.call(v) === '[object Object]'
}

export const merge = (target, ...list) => {
    for (const index of Object.keys(list)) {
        for (const key of Object.keys(list[index])) {
            const value = list[index][key]
            if (isPlainObject(value)) {
                target[key] = merge(target[key] || {}, value)
                continue
            }
            if (Array.isArray(value)) {
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
