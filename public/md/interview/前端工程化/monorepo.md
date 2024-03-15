## monorepo
### lerna + yarn的workspaces
- lerna初始化
```
// npm install lerna -g
lerna init

monorepo
├── packages
├── lerna.json
├── package.json
```
- 修改lerna.json
```
{
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "useWorkspaces": true,
  "npmClient": "yarn",
  "version": "0.0.0"
}
```
- 修改package.json
```
{
  "name": "root",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "devDependencies": {
    "lerna": "^6.4.1"
  }
}
```
- packages目录下新建子项目utils、pc
```
monorepo
├── packages
    ├── pc
    ├── utils
├── lerna.json
├── package.json
```
- pc项目依赖utils项目，在pc项目的package.json的dependencies下手动添加一行依赖。名称和版本来自utils项目的package.json的数据。
```
"utils": "1.0.0"
```
- 使用TypeScript时如果某一个包依赖于另一个包，必须明确让TypeScript知道这种依赖关系。例如pc项目依赖utils项目，需要在pc项目的tsconfig文件中添加references配置。
```
{
  "references": [{ "path": "../utils/tsconfig.json" }],
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "paths": {
      "@/*": ["src/*"],
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
- pc项目安装依赖，启动项目。pc项目之所以可以引用utils项目内容依赖于yarn的workspaces功能会自动管理/package.json里workspaces字段指定包下的所有依赖。
```
yarn
yarn start
```
