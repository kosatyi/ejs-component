import {babel, resolve, commonjs} from '@kosatyi/rollup'

import pkg from './package.json'

export default [
    {
        input: 'src/index.js',
        output: {
            file: pkg.main,
            format: 'umd',
            exports: 'named',
            name: pkg.name
        },
        plugins: [
            commonjs(),
            resolve({
                browser: true
            }),
            babel({
                babelHelpers: 'bundled'
            }),
        ]
    },
    {
        input: 'src/index.js',
        output: {
            file: pkg.module,
            format: 'esm'
        },
        external: ['@kosatyi/is-type'],
    }
]