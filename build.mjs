import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import FsExtra from 'fs-extra';
// import gzipPlugin from 'rollup-plugin-gzip/dist-es/index.js';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import Recurs from 'recursive-readdir';
import rollup from 'rollup';
import terser from 'rollup-plugin-terser';
import { brotliCompressSync } from 'zlib';

const commonPlugins = [
  terser.terser(),
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
    resolve(),
    commonjs(),
    babel({
      externalHelpers: false,
      sourceMap: false,
      exclude: [/\/core-js\//],
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
  const name = setting === 'esm' ? null : 'FormValidator';
  const output = `dist/${file.replace('src/', '').replace('.js', setting === 'esm' ? '.esm.min.js' : '.iffe.min.js')}`;
  const ppp = {
    input: file,
    output: {
      sourcemap: false,
      format: setting,
      file: output
    }
  };

  if (name) {
    ppp.output.name = name;
  }

  ppp.plugins = plugins[`${setting}`].concat(commonPlugins);

  FsExtra.mkdirsSync(path.dirname(output));

  const bundle = await rollup.rollup(ppp);
  await bundle.write(ppp.output);

  // eslint-disable-next-line no-console
  console.log(`Generated: ${ppp.output.file}`);
  // console.log(`Generated: ${ppp.output.file}.gz`);
  // console.log(`Generated: ${ppp.output.file}.br`);
  // eslint-disable-next-line no-console
  console.log('#############################');
};

Recurs('src', ['!*.js', 'src/formvalidatorbase.js', 'src/defaults.js', 'src/utils.js'])
  .then((filesRc) => {
    filesRc.forEach(function (file) { settings.forEach(function (setting) { execRollup(file, setting); }); },
      (error) => {
        // eslint-disable-next-line no-console
        console.error(error.formatted);
      }
    );
  });


Recurs('src', ['!*.html', ''])
  .then((filesRc) => {
    filesRc.forEach((file) => {
      const output = file.replace('src', 'dist');
      FsExtra.mkdirsSync(path.dirname(output));
      FsExtra.copyFileSync(file, output);
    },
      (error) => {
        // eslint-disable-next-line no-console
        console.error(error.formatted);
      }
    );
  });
