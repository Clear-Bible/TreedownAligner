import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
//import postcss from 'rollup-plugin-postcss';
import styles from 'rollup-plugin-styles';
import css from 'rollup-plugin-import-css';

const packageJson = require('./package.json');

export default {
  input: 'src/bundle.ts',
  output: [
    {
      //file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      dir: 'dist',
    },
    //{
    //file: packageJson.module,
    //format: 'esm',
    //sourcemap: true,
    //dir: 'dist',
    //},
  ],
  plugins: [
    //peerDepsExternal(),
    //resolve(),
    //commonjs(),
    typescript(),
    css(),
  ],
  external: ['react', 'react-dom'],
};
