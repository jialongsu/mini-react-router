const path = require("path");
const babel = require("rollup-plugin-babel");
const replace = require("rollup-plugin-replace");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const { uglify } = require("rollup-plugin-uglify");

const pkg = require("./package.json");

function isBareModuleId(id) {
  return (
    !id.startsWith(".") && !id.includes(path.join(process.cwd(), "modules"))
  );
}

const cjs = [
  {
    input: "modules/index.js",
    output: {
      file: `cjs/${pkg.name}.js`,
      sourcemap: true,
      format: "cjs",
      esModule: false
    },
    external: isBareModuleId,
    plugins: [
      babel({ exclude: /node_modules/, sourceMaps: true, rootMode: "upward" }),
      replace({ "process.env.NODE_ENV": JSON.stringify("development") })
    ]
  },
  {
    input: "modules/index.js",
    output: { file: `cjs/${pkg.name}.min.js`, sourcemap: true, format: "cjs" },
    external: isBareModuleId,
    plugins: [
      babel({ exclude: /node_modules/, sourceMaps: true, rootMode: "upward" }),
      replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
      uglify()
    ]
  }
];

const esm = [
  {
    input: "modules/index.js",
    output: { file: `esm/${pkg.name}.js`, sourcemap: true, format: "esm" },
    external: isBareModuleId,
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        sourceMaps: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]],
        rootMode: "upward"
      })
    ]
  }
];

const globals = { react: "React" };

const umd = [
  {
    input: "modules/index.js",
    output: {
      file: `umd/${pkg.name}.js`,
      sourcemap: true,
      sourcemapPathTransform: relativePath =>
        relativePath.replace(/^.*?\/node_modules/, "../../node_modules"),
      format: "umd",
      name: "ReactRouterDOM",
      globals
    },
    external: Object.keys(globals),
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        sourceMaps: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]],
        rootMode: "upward"
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/,
        namedExports: {
          "../../node_modules/react-is/index.js": ["isValidElementType"]
        }
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development")
      })
    ]
  },
  {
    input: "modules/index.js",
    output: {
      file: `umd/${pkg.name}.min.js`,
      sourcemap: true,
      sourcemapPathTransform: relativePath =>
        relativePath.replace(/^.*?\/node_modules/, "../../node_modules"),
      format: "umd",
      name: "ReactRouterDOM",
      globals
    },
    external: Object.keys(globals),
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        sourceMaps: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]],
        rootMode: "upward"
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/,
        namedExports: {
          "../../node_modules/react-is/index.js": ["isValidElementType"]
        }
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      uglify()
    ]
  }
];

let config;
switch (process.env.BUILD_ENV) {
  case "cjs":
    config = cjs;
    break;
  case "esm":
    config = esm;
    break;
  case "umd":
    config = umd;
    break;
  default:
    config = cjs.concat(esm).concat(umd);
}

module.exports = config;
