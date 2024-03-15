## sequelize
### 配置数据库时间为东八区北京时间
> 配置之后插入数据库的时间数据也会变成东八区时间。

```
// config.default.js
exports.sequelize = {
  // ...

  // 配置数据库时间为东八区北京时间
  timezone: '+08:00',

  // ...
};
```
### service中使用model时model必须首字母大写
```
this.ctx.model.Monitor.create(monitorData);
```
### 连表查询
> 下述例子是查询tableA并关联tableB，最后返回的是按照tableA的条件进行查询的，将tableB的数据拼接上去。

```
// tableA和tableB连表查询
tableA.belongsTo(tableB, {
  as: timestamp, // 一个时间戳，必须每一次请求时都变化，所以使用时间戳
  foreignKey: 'id',  // tableA关联字段
  targetKey: 'aId', // tableB关联字段
});
const cfg = {
  // TableA的查询配置
  attributes: [
    'id',
    'name',
  ],
  where: {
    is_deleted: {
      [this.sequelize.Op.ne]: 1
    }
  },
  order: [['phase', 'ASC']],
  // TableB的查询配置
  include: [
    {
      model: tableB,
      as: timestamp,
      attributes: [
        'aId',
        'sex',
      ],
    },
  ],
  required: false,
  raw: true,
};
// 最后查询tableA
const res = await tableA.findAll(cfg);
```