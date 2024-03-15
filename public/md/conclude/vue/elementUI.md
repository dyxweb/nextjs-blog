## elementUI
> 安装依赖 npm i element-ui -save,main.js引入，可以按需引入详见官网。绑定vue组件的属性或事件一定要加:

```
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
```
 
**绑定elementUI组件的自定义事件使用:**
```
:before-close="close"
```
**table使用当前行的数据**
```
// slot-scope="scope"必须有无论是否要传值
<el-table-column
    label="操作">
    <template slot-scope="scope">
        <el-button type="text" size="small" @click="toDetail(scope.row)">详情</el-button>
    </template>
</el-table-column>

toDetail(row){
    this.$router.push(`user/${row.id}/detail`)
}
```
**input使用原生事件以及自定义组件使用事件**
> 加.native

```
// @keyup.enter改为 @keyup.enter.native
<el-input @keyup.enter.native="addTodo" v-model.trim="input" placeholder="请输入要添加事项"></el-input>
```
**form的表单值获取**
> 将值存在data中，直接读取即可

```
data() {
    return {
    ruleForm: {
        name: '',
        fee: '',
        phone: '',
        createTime: '',
    },
    }
},
methods: {
  submitForm(formName) {
    this.$refs[formName].validate((valid,values) => {
        if (valid) {
             // this.ruleForm直接是一个对象
        get('http://localhost:3001/adduser', this.ruleForm).then(res => {
            this.toUser();
            this.getList();
        })
        } else {
        console.log('error submit!!');
        return false;
        }
    });
  },
}
```

**NavMenu导航菜单的默认选中的项的设置**
```
// 使用$route来动态匹配默认选中项
:default-active="$route.path"  // 一定要有:
```