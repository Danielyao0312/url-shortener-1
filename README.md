# url-shortener
简单的短网址生成器

## 原理
url字段设定为唯一，并且伴随一个自增长 id ；然后将 id 转换为 62 进制数字返回给客户端。
核心部分为双射函数，将客户端请求的 62 进制数转换为 id 去查询数据库，将原始 url 作为 redirect 参数返回客户端；浏览器 301 自动跳转到原网址。
需要实现 Mongodb 的自增长字段，创建一个名为 counter 的只用来计数的 Schema ，每次取值都去更新一下这个字段的值，使其自增 1 。

## API

### encode
```
POST /api/shorten
long_url=http://...
```

OR
```
{ 
  "long_url": "http://..."
}
```

### decode
```
GET /{:short_url}

Location: {:目标网址}
```

## 启动
> npm start

## 环境变量配置
### 端口
> PORT=3000 npm start

### mongodb uri
> MONGOLAB_URI=mongodb://username:password@xxx.mongolab.com:0000/xxx

### domain
> DOMAIN=http://sho.rt/

## Mongodb Schema
### shorten
url 数据集
long: 长链接
seq: 链接数据库序号
### counter
自增长序列用数据集
_id: 标识此自增长序列为哪个字段服务
seq: 当前增长序号
