## SGS-query
数据来源 [raineggplant.github.io/noname]

使用indexed DB储存

做简单查询

## 需求
### 查询方式
1. 拼音首字母
ABC DFG HJK LMN PQR STW XYZ

2. 势力
* 魏 
* 蜀
* 吴 
* 群 
* 晋

3. 武将包 
* 界限突破 ~refresh
* 神话再临 shenhua
* 星火燎原 xinhuoliaoyuan
* 一将成名 yijiang
* 璀璨星河 sp
* 系列专属 sp2

###  正则处理
1. character:{
```
re_xunyou:['male','wei',3,['reqice','rezhiyu'],['clan:颍川荀氏']],
[0] 性别
[1] 势力
[2] 血量
[3] 技能
[4] 其他包
```

```
3. translate:{
```
re_zhangliao:'界张辽',
```

TODO
translate优先缓存
后续匹配技能

### REFRERNCE

https://useworker.js.org/docs/api-useworker

https://www.npmjs.com/package/bifur