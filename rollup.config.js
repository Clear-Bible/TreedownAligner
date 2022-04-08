import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/bundle.ts',
  output: [
    {
      format: 'cjs',
      sourcemap: true,
      dir: 'dist',
    },
  ],
  plugins: [typescript(), postcss()],
  external: ['react', 'react-dom'],
};
