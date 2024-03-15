## tsconfig.json文件
> tsconfig.json文件是用于描述将TypeScript转为JavaScript代码的配置文件。

- IDE（代码编辑器）将会根据tsconfig.json文件来对当前项目中支持不同程度的类型约束。
- 对TSC编译TypeScript代码过程做一些预定义、约束入口和编译输出目录等配置。
### tsconfig.json配置详解
- files
> 用于指明需要tsc编译的一个或多个ts文件。

```
{
  "files": [
    "index.ts",
    "global.d.ts"
  ],
}
```
- include
> 用于指明需要被tsc编译的文件或文件夹列表。

```
{
  "include": [
    "src",
    "global.d.ts"
  ],
}
```
- exclude
> 用于排除不需要tsc编译的文件或文件夹列表。exclude字段中的声明只对include字段有排除效果，对files字段无影响，即与include字段中的值互斥。如果tsconfig.json文件中files和include字段都不存在，则默认包含tsconfig.json文件所在目录及子目录的所有文件，且排除在exclude字段中声明的文件或文件夹。

```
{
  "exclude": [
    "test.ts",
    "src/test.ts"
  ],
}
```
- compileOnSave
> 声明是否需要在保存时候自动触发tsc编译的字段，一般我们的代码编译过程会通过Rollup、Webpack等打包构建工具，并且使用热更新，因此无需配置该项。

```
{
  "compileOnSave": false,
}
```
- extends
> 用于指明继承已有的tsconfig配置规则文件。可以结合自己团队的情况，抽离一个基础且公共的tsconfig配置并将其发包，然后作为extends字段的值来继承配置。

```
// 继承一个发包后的tsconfig基础配置，并通过显示声明编译的目标代码版本为ES2016来覆盖覆盖@tsconfig/recommended中对应配置项。
{
  "extends": "@tsconfig/recommended/tsconfig.json",
  "compilerOptions": {
    "target": "ES2016"
  }
}
```
### compilerOptions
> compilerOptions是一个描述TypeScript编译器功能的大字段，其值类型是对象，包含了很多用于描述编译器功能的子字段。

- target
> 指明经过TSC编译后的ECMAScript代码语法版本，根据ECMAScript语法标准，默认值为ES3。TypeScript是JavaScript的超集，是对JavaScript语法和类型上的扩展，因此我们可以使用ES5、ES6甚至是最新的ESNext语法来编写TS。target的值有es3、es5、es6(es2015)、es2016一直到es2022、然后还有esnext，esnext指的是当前版本的TS编译器支持的最高版本。

```
// 把使用了最新ECMAScript语法的TS文件编译为符合ES5语法规范的js文件。
{
  "compilerOptions": {
    "target": "ES5",
  }
}
```
- lib
> 用于为了在我们的代码中显示的指明需要支持的ECMAScript语法或环境对应的类型声明文件。例如我们的代码会使用到浏览器中的一些对象window、document，这些全局对象API对于TypeScript Complier来说是不能识别的。显式引入在DOM即浏览器环境下的一些默认类型定义，即可在代码中使用window、document等浏览器环境中的对象，TS在运行时以及编译时就不会报类型错误。

```
{
  "compilerOptions": {
    "target": "ES5",
    "lib": ["ES5", "ES6", "DOM"],
  }
}
```
- module
> 指明tsc编译后的代码应该符合何种模块化方案，可以指定的枚举值有：none, commonjs, amd, system, umd, es2015, es2020, ESNext，默认值为none。可以设置allowSyntheticDefaultImports字段为true，来允许合成默认导入。

```
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
  }
}
```
- esModuleInterop
> 支持合成默认导入，使用ESM编写代码引入了CJS的模块，由于CJS模块没有默认导出内容，因此需要通过我们的工具去自动化合成CJS的默认导出，以支持在ESM下流畅开发。当esModuleInterop字段设置为true时候，allowSyntheticDefaultImports字段也会自动设置为true。

```
{
  "compilerOptions": {
    "esModuleInterop": true,
  }
}
```
- moduleResolution
> 声明如何处理模块，值：classic、node，会根据module字段决定默认值。推荐手动设置为node，更符合现在大家的编码认识一些，而且大部分的构建打包工具都是基于Node。

```
{
  "compilerOptions": {
    "moduleResolution": "node",
  }
}
```
- baseUrl & paths
> baseUrl：设置基本目录以解析非绝对模块名称（定义一个根目录，以此进行绝对文件路径解析）；paths：用于设置模块名或路径映射列表，这样就可以简写项目中自定义模块的文件路径。

```
{
  "compilerOptions": {
    "baseUrl": ".", 
    "paths": {
      "@/*": ["src/*"],
      "moduleA": ["src/libs/moduleA"]
    }
  }
}

// 代码里这么写
import Toast from '@/components/Toast.ts' // 模块实际位置: src/components/Toast.ts
import TestModule from 'moduleA/index.js' // 模块实际位置: src/libs/moduleA/index.js
```
- rootDir
> 指定TypeScript识别读取的根目录。"rootDir": "./src"，则src目录下的TS文件不能引用src目录以外的ts文件，一般我们会设置为./src或 ./（即 tsconfig.json所在目录）

```
{
  "compilerOptions": {
    "rootDir": "./src"
  }
}
```
- outDir
> 输出目录即tsc编译后的文件输出的文件夹路径（基于tsconfig.json文件的相对路径）。"outDir": "./dist"，及将TSC编译输出的JS文件，统一输出的./dist目录下。

```
{
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```
- jsx
> 如果是有jsx语法需要支持的项目，可以设置值preserve、react、react-jsx等。

```
{
  "compilerOptions": {
    "jsx": "react-jsx",
  },
}
```
- importHelpers
> 决定是否启用从tslib库引入语法降级辅助函数，以避免重复冗余的辅助函数声明。建议设置为true来启用。

```
{
  "compilerOptions": {
    "importHelpers": true,
  },
}
```
- experimentalDecorators
> 用于声明是否启实验性用装饰器模式。

```
{
  "compilerOptions": {
    "experimentalDecorators": true,
  },
}
```
- noEmit
> 设置是否输出js文件，一般是设置为false，将打包等工作交给Webpack等工具。

```
{
  "compilerOptions": {
    "noEmit": false,
  },
}
```
### 建议配置
```
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "paths": {
      "@/*": ["src/*"]
    },
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src",
    "global.d.ts"
  ]
}
```
### Webpack + TypeScript
> 需要安装typescript和ts-loader两个模块。Webpack主要是依赖ts-loader实现对TypeScript语法的编译支持。

```
// webpack配置
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```
### Babel + TypeScript
> Babel处理TS需要安装@babel/preset-typescript模块，然后在babel项目配置文件中声明。Babel只会对TS代码转为JS代码（通过parseTS文件为AST，并直接移除类型信息，然后打印目标代码），不会去做TS类型检查，所以Babel编译TS文件相较于TSC的速度更快！因为Babel会根据不同的兼容环境，按需引入pollyfill，比TSC直接引入core-js更优雅，因此使用了Babel打包的体积也会更小。

```
// .babelrc
{
  "presets": ["@babel/preset-typescript"]
}
```
### Rollup + TypeScript
> 添加@rollup/plugin-typescript插件即可，该插件会默认读取项目根目录下的tsconfig.json配置文件。

```
// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [typescript()]
};
```