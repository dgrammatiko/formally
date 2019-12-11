import babel from 'rollup-plugin-babel/dist/rollup-plugin-babel.esm.js';
import commonjs from 'rollup-plugin-commonjs/dist/rollup-plugin-commonjs.es';
import FsExtra from 'fs-extra';
import gzipPlugin from 'rollup-plugin-gzip/dist-es';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve/dist/index.es';
import Recurs from 'recursive-readdir';
import { rollup } from 'rollup/dist/rollup.es';
import { terser } from 'rollup-plugin-terser/index';
import { BrotliCompress, gzip } from 'zlib';

// const compBrotli = (fileContent, outputOptions) => {
//   return new Promise((resolve, reject) => {
//     BrotliCompress(fileContent, outputOptions || {}, (err, result) => {
//       if (err) {
//         reject(err);
//       }
//       else {
//         resolve(result);
//       }
//     });
//   });
// };


const compGzip = (fileContent, outputOptions) => {
  return new Promise((resolve, reject) => {
    gzip(fileContent, outputOptions || {}, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(result);
      }
    });
  });
};

const commonPlugins = [
  terser(),
  gzipPlugin({
    customCompression: (content, outputOptions) => compGzip(Buffer.from(content), outputOptions)
  }),
  // gzipPlugin({
  //   fileName: '.br',
  //   customCompression: (content, outputOptions) => compBrotli(Buffer.from(content), outputOptions),
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
}

const settings = ['esm', 'iife'];

const execRollup = async function (file, setting) {
  const name = setting === 'esm' ? null : 'FormValidator';
  const output = `dist/${file.replace('src/', '').replace('.js', setting === 'esm' ? '.es6.min.js' : '.iffe.es5.min.js')}`;
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

  const bundle = await rollup(ppp);
  await bundle.write(ppp.output);

  console.log(`Generated: ${ppp.output.file}`);
  console.log(`Generated: ${ppp.output.file}.gz`);
  // console.log(`Generated: ${ppp.output.file}.br`);
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