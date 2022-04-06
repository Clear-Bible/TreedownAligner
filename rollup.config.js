import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-import-css';

export default {
  input: 'src/bundle.ts',
  output: [
    {
      format: 'cjs',
      sourcemap: true,
      dir: 'dist',
    },
  ],
  plugins: [typescript(), css()],
  external: ['react', 'react-dom'],
};
