import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

import pkg from './package.json' with { type: 'json' }

const pkgName = pkg.name.replace(/-([a-z])/g, (m, w) => w.toUpperCase())

export default [
    {
        input: 'src/index.js',
        output: [
            {
                file: pkg.main,
                format: 'cjs'
            },
            {
                file: pkg.module,
                format: 'esm'
            },
            {
                file: pkg.browser,
                format: 'umd',
                exports: 'named',
                name: pkgName
            },
            {
                file: pkg.browser.replace('.umd.js', '.min.js'),
                format: 'umd',
                exports: 'named',
                name: pkgName,
                plugins: [terser()]
            }
        ],
        plugins: [commonjs(), resolve()]
    }
]
