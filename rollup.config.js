import builtins from '@erquhart/rollup-plugin-node-builtins';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
  input: 'docs/admin/util',
  output: {
    file: 'docs_public/admin/util.js',
    format: 'iife',
    name: 'previewUtil',
  },
  plugins: [
    builtins(),
    nodeResolve(),
    commonjs(),
    json(),
  ]
};
