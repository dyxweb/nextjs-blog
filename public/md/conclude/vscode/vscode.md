## vscode
### vscode 配置保存时根据eslint规则自动处理
1. vscode从插件库里安装eslint和prettier
2. vscode  文件-首选项-用户设置-settings.json中配置
```
{
  "eslint.autoFixOnSave": true,
	"eslint.validate": [
		"javascript",
		"javascriptreact",
		{
			"language": "html",
			"autoFix": true
		},
		{
			"language": "vue",
			"autoFix": true
		}
	],
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": true
	},
	"typescript.tsdk": ""
}
```
3. vscode 重新启动即可
### vscode 汉化
1. vscode从插件库里安装 Chinese (Simplified) Language Pack for Visual Studio Code
2. 快捷键【CTRL+SHILF+P】打开命令面板并输入【config】后找到【Configure Display Language】选项并点击然后选择 zh-cn  即可

### vscode中通过正则匹配时不需要加斜杠
### vscode函数的注释 直接输入/** 然后回车即可
### 输入英文!然后回车会生成一个html文件结构