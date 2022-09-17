import pkg from "./package.json";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from 'rollup-plugin-terser'
import json from "@rollup/plugin-json";

export default {
  input: "index.mjs",
  output: [
    {
      file: "bin/" + pkg.main,
      format: "esm",
      banner: "#! /usr/bin/env node"
    }
  ],
  external: [pkg.peerDependencies, pkg.dependencies],
  plugins: [commonjs(), json(), terser()]
};
