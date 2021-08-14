import path from 'path';
import _ from 'lodash';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import includePaths from 'rollup-plugin-includepaths';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const PACKAGE_ROOT_PATH = process.cwd();
const inputFile = path.resolve(__dirname, 'src/index.tsx');

const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, 'package.json'));
const umd = process.env.UMD;

const umdName = _.camelCase(PKG_JSON.name);

const includePathOptions = {
  include: {},
  paths: [path.join(PACKAGE_ROOT_PATH, 'src')],
  external: [],
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
};

const plugins = [
  external(),

  includePaths(includePathOptions),

  // Allow Rollup to resolve modules from `node_modules`, since it only
  // resolves local modules by default.
  resolve({
    browser: true,
    // modulesOnly: true,
  }),

  // Allow Rollup to resolve CommonJS modules, since it only resolves ES2015
  // modules by default.
  commonjs({
    include: /node_modules/,
    // namedExports: {
    //   'react-is': ['typeOf', 'isElement', 'isValidElementType'],
    // },
  }),

  // Convert JSON imports to ES6 modules.
  json(),

  // Register Node.js builtins for browserify compatibility.
  builtins(),

  // Register Node.js globals for browserify compatibility.
  globals(),

  postcss({
    extract: `index.css`,
    minimize: true,
  }),

  typescript({
    declarationDir: 'types/',
    // sourceMap: true,
  }),
];

/** @type {import('rollup').RollupOptions} */
const common = {
  input: inputFile,
  plugins,
  watch: {
    clearScreen: false,
  },
};

/** @type {import('rollup').RollupOptions} */
const config = {
  ...common,
  output: [
    {
      format: 'es',
      sourcemap: true,
      file: PKG_JSON.module,
    },
    {
      format: 'cjs',
      sourcemap: true,
      file: PKG_JSON.main,
      exports: 'auto', // fix warning
    },
  ],
  external: [
    /^codemirror-ssr/,
    'hast-util-sanitize/lib/github.json',
    ...Object.keys(PKG_JSON.dependencies || {}),
    ...Object.keys(PKG_JSON.peerDependencies || {}),
  ],
};

/** @type {import('rollup').OutputOptions} */
const umdOutputOption = {
  format: 'umd',
  name: umdName,
  sourcemap: true,
  // inlineDynamicImports: true,
};

/** @type {import('rollup').RollupOptions} */
const umdConfig = {
  ...common,
  output: [
    {
      ...umdOutputOption,
      file: path.resolve('dist/index.js'),
    },
    {
      ...umdOutputOption,
      file: path.resolve('dist/index.min.js'),
      plugins: [terser()],
    },
  ],
  external: Object.keys(PKG_JSON.peerDependencies || {}),
};

/** @type {import('rollup').RollupOptions} */
const es5Config = {
  ...common,
  output: [
    {
      ...umdOutputOption,
      file: path.resolve('dist/index.es5.js'),
    },
    {
      ...umdOutputOption,
      file: path.resolve('dist/index.es5.min.js'),
      plugins: [terser()],
    },
  ],
  plugins: [
    ...common.plugins,
    babel({
      babelHelpers: 'runtime',
      extensions: ['.js', '.mjs', '.html', '.ts', '.tsx'],
    }),
  ],
};

const configs = umd ? [config, umdConfig, es5Config] : [config];

export default configs;
