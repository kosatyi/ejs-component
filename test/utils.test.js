import { describe, expect, it } from 'vitest'
import { isPlainObject, merge } from '../src/utils.js'

describe('merge', () => {
    it('nested', () => {
        const firstObject = { prop: 'content', empty: null, undef: undefined }
        const secondObject = {
            nested: { key: 'value' }
        }
        const resultObject = {
            undef: undefined,
            empty: null,
            prop: 'content',
            nested: { key: 'value' }
        }
        expect(merge(firstObject, secondObject)).toEqual(resultObject)
    })
    it('array', () => {
        const firstArray = [1, 2, 3, 4, 5]
        const secondArray = [null, 'value', undefined]
        const resultArray = [null, 'value', undefined, 4, 5]
        expect(merge([], firstArray, secondArray)).toEqual(resultArray)
    })
    it('nested array', () => {
        const firstArray = [1, [1, 2, 3], 3, 4, 5]
        const secondArray = [null, 'value', undefined]
        const resultArray = [null, 'value', undefined, 4, 5]
        expect(merge([], firstArray, secondArray)).toEqual(resultArray)
    })
})

describe('isPlainObject', () => {
    it(`check: string`, () => {
        expect(isPlainObject('string')).toBe(false)
    })
    it(`check: empty string`, () => {
        expect(isPlainObject('')).toBe(false)
    })
    it(`check: 0`, () => {
        expect(isPlainObject(0)).toBe(false)
    })
    it(`check: 1`, () => {
        expect(isPlainObject(1)).toBe(false)
    })
    it(`check: 1.2`, () => {
        expect(isPlainObject(1.2)).toBe(false)
    })
    it(`check: undefined`, () => {
        expect(isPlainObject(undefined)).toBe(false)
    })
    it(`check: null`, () => {
        expect(isPlainObject(null)).toBe(false)
    })
    it(`check: NaN`, () => {
        expect(isPlainObject(NaN)).toBe(false)
    })
    it(`check: []`, () => {
        expect(isPlainObject([])).toBe(false)
    })
    it(`check: [1,2,3]`, () => {
        expect(isPlainObject([1, 2, 3])).toBe(false)
    })
    it(`check: boolean true`, () => {
        expect(isPlainObject(true)).toBe(false)
    })
    it(`check: boolean false`, () => {
        expect(isPlainObject(false)).toBe(false)
    })
    it(`check: Date`, () => {
        expect(isPlainObject(Date)).toBe(false)
    })
    it(`check: new Date`, () => {
        expect(isPlainObject(new Date())).toBe(false)
    })
    it(`check: new RegExp`, () => {
        expect(isPlainObject(new RegExp(''))).toBe(false)
    })
    it(`check: Object.create(new Date)`, () => {
        expect(isPlainObject(Object.create(new Date()))).toBe(false)
    })
    it(`check: Object.create({})`, () => {
        expect(isPlainObject(Object.create({}))).toBe(false)
    })
    it(`check: Object.create(null)`, () => {
        expect(isPlainObject(Object.create(null))).toBe(false)
    })
    it(`check: () => {}`, () => {
        const callback = () => {}
        expect(isPlainObject(callback)).toBe(false)
        expect(isPlainObject(callback.prototype)).toBe(false)
    })
    it(`check: function constructor`, () => {
        function ConstRuct() {
            this.length = 1
        }
        ConstRuct.prototype = { length: 0 }
        const constRuct = new ConstRuct()
        expect(isPlainObject(constRuct)).toBe(false)
    })
    it(`check: empty object {}`, () => {
        expect(isPlainObject({})).toBe(true)
    })
    it(`check: nested object {}`, () => {
        expect(isPlainObject({ nested: { object: {} } })).toBe(true)
    })
})
