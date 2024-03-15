## css-loader
- webpack是无法处理css文件的，需要添加对应的css-loader。
- css文件经过css-loader处理之后，将css转化为webpack能够解析的javascript才不会报错。
### css-loader处理
- css-loader会将css处理成字符串。
- css模块经过css-loader处理之后，返回的内容变成了一个js模块。
- 只经过css-loader处理在生产环境是无法正常加载样式的，因为没有用style处理。
```
// css原内容
.wrap {
  color: red;
}

// css-loader处理后内容

// Imports
import ___CSS_LOADER_API_SOURCEMAP_IMPORT___ from "../node_modules/.pnpm/css-loader@6.7.3_webpack@5.79.0/node_modules/css-loader/dist/runtime/sourceMaps.js";
import ___CSS_LOADER_API_IMPORT___ from "../node_modules/.pnpm/css-loader@6.7.3_webpack@5.79.0/node_modules/css-loader/dist/runtime/api.js";
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".wrap {\n  color: red;\n}\n", "",{"version":3,"sources":["webpack://./src/app.css"],"names":[],"mappings":"AAAA;EACE,UAAU;AACZ","sourcesContent":[".wrap {\n  color: red;\n}\n"],"sourceRoot":""}]);
// Exports
export default ___CSS_LOADER_EXPORT___;
```
