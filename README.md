# url-shortener
简单的短网址生成器

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