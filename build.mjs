import rollup from 'rollup';
import terser from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import pkg from '@rollup/plugin-babel';
const {babel} = pkg;
import FsExtra from 'fs-extra';
// import gzipPlugin from 'rollup-plugin-gzip/dist-es/index.js';
import path from 'path';
import Recurs from 'recursive-readdir';
import {brotliCompressSync} from 'zlib';

const commonPlugins = [
  terser.terser()
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
    resolve({
      browser: true,
      modulesOnly: true
    }),
    // commonjs(),
    babel({
      babelHelpers: 'bundled',
      sourceMap: false,
      // exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: ['ie 11']
            }
          }
        ]
      ]
    })
  ]
};

const settings = ['esm', 'iife'];

const execRollup = async function(file, setting) {
  const name = setting === 'esm' ? null : 'FormValidator';
  const output = `dist/${file
    .replace('src/', '')
    .replace('.js', setting === 'esm' ? '.esm.min.js' : '.iife.min.js')}`;
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
  // Get a copy in the docs
  FsExtra.copy(ppp.output.file, `docs/${ppp.output.file}`);

  // eslint-disable-next-line no-console
  console.log(`Generated: ${ppp.output.file}`);
  console.log('#############################');
};

Recurs('src', [
  '!*.js',
  'src/formvalidatorbase.js',
  'src/defaults.js',
  'src/utils.js'
]).then(filesRc => {
  filesRc.forEach(file => {
    settings.forEach(setting => {
      execRollup(file, setting);
    });
  });
});

// Recurs('src', ['!**/*.html', ''])
//   .then((filesRc) => {
//     filesRc.forEach((file) => {
//       const output = file.replace('src', 'dist');
//       FsExtra.mkdirsSync(path.dirname(output));
//       FsExtra.copyFileSync(file, output);
//     },
//       (error) => {
//         // eslint-disable-next-line no-console
//         console.error(error.formatted);
//       }
//     );
//   });

FsExtra.copy('node_modules/bonsai.css/dist/bonsai.min.css', 'docs/assets/bonsai.min.css');
