import { nodeResolve } from '@rollup/plugin-node-resolve';
import css from "rollup-plugin-import-css";
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

const terserConfig = {
  module: true,
}

export default [
  {
    input: 'main.js',
    watch: {
      include: 'js/**',
      clearScreen: false
    },
    output: {
      file: 'dist/main.js',
      format: 'es',
    },
    plugins: [css(), nodeResolve(), commonjs()]
  },
];
