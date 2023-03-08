import {rollup} from 'rollup';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import FsExtra from 'fs-extra';
// import gzipPlugin from 'rollup-plugin-gzip/dist-es/index.js';
import path from 'path';
import Recurs from 'recursive-readdir';
import filesize from 'rollup-plugin-filesize';
// import { brotliCompressSync } from 'zlib';

const commonPlugins = [
  terser(),
  filesize(),
  // // GZIP compression as .gz files
  // gzipPlugin(),
  // // Brotil compression as .br files
  // gzipPlugin({
  //   customCompression: content =>
  //     brotliCompressSync(Buffer.from(content)),
  //   fileName: '.br',
  // }),
];

const plugins = {
  esm: [],
  iife: [
    nodeResolve({
      browser: true,
      modulesOnly: true
    }),
    // commonjs(),
    babel({
      babelHelpers: 'bundled',
      sourceMap: false,
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: ['ie 11'],
            },
          },
        ],
      ],
    }),
  ]
};

const settings = ['esm', 'iife'];

const execRollup = async function (file, setting) {
  const ppp = {
    input: file,
    output: {
      sourcemap: false,
      format: setting,
      file: `dist/${file.replace('src/', '').replace('.js', setting === 'esm' ? '.esm.min.js' : '.iife.min.js')}`
    }
  };

  ppp.output.name = setting === 'esm' ? null : 'FormValidator';
  ppp.plugins = plugins[`${setting}`].concat(commonPlugins);

  FsExtra.mkdirsSync(path.dirname(ppp.output.file));

  const bundle = await rollup(ppp);
  await bundle.write(ppp.output);
  // Get a copy in the docs
  FsExtra.copy(ppp.output.file, `docs/${ppp.output.file}`)
};

Recurs('src', ['!*.js', 'src/defaults.js', 'src/utils.js']).then((filesRc) => filesRc.forEach(file => settings.forEach(setting => execRollup(file, setting))));

