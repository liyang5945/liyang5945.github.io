---
title: webpack和vite devServer的进阶用法：配置proxy修改请求和响应

date: 2022-05-25 10:30
articlePath: 2022-05-25-advanced-proxy-config
categories: 
    - 技术
toc: false
tags:
  - vite
  - webpack
  - proxy

---

在前端日常开发中我们一般都是配置本地开发服务器的proxy来解决跨域问题，查看官网文档或者通过搜索引擎搜出来的都是比较基础的用法：

```
 proxy: {
     '/api/': {
         target: 'http://dev.test.com'
     }
 }
```

我最近有这么一个需求，需要修改请求头里的一些东西，我最初使用node启动一个本地服务来做代理，后面我觉得有点麻烦，每次开发都要手动来开启。后来又瞄了下vue-cli的官网，里面提到：如果你想要更多的代理控制行为，也可以使用一个 path: options 成对的对象。完整的选项可以查阅 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#proxycontext-config) 

页面里给出了如下的代码：

```js
createProxyMiddleware({
  target: 'http://www.example.org',
  on: {
    proxyReq: (proxyReq, req, res) => {
      /* handle proxyReq */
    },
    proxyRes: (proxyRes, req, res) => {
      /* handle proxyRes */
    },
    error: (err, req, res) => {
      /* handle error */
    },
  },
});

```

看到上述代码，你可能会直接把on那里面的东西直接复制到上面配置的target下面，不过我尝试了之后，并没有生效。我搜索了一下http-proxy-middleware之后，搜到了如下的代码，经过测试之后，确定可用，文章原文地址：https://juejin.cn/post/6993644913900388359 ，下面是正确的配置选项：
```js

module.exports = {
  //...
  devServer: {
    //...
    proxy: {
      '/api/': {
        target: 'http://www.abc.com',
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
          proxyReq.removeHeader('referer')  //移除请求头
          proxyReq.removeHeader('origin') //移除请求头
          proxyReq.setHeader('origin','www.abc.com') //添加请求头
          proxyReq.setHeader('host','www.abc.com') //添加请求头
        },
        onProxyRes: (proxyRes, req, res) => {
          /*添加或删除响应头有两种写法，第一种是操作 proxyRes 参数*/
          delete proxyRes.headers['set-cookie']
          proxyRes.headers['set-cookie'] = 'new cookie value';

          /*第二种方法是操作 res 参数*/
          res.removeHeader("Access-Control-Allow-Origin");
          res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
          res.setHeader("Access-Control-Allow-Credentials", 'true');
          res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
          res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        },
      }
    }
  }
}


```

上面的代码是移除请求头里面的referer和origin字段，因为我要请求的api对这个字段进行了校验，我们前端本地的服务器一般是localhost:8080之类的，通过浏览器请求携带的是本地地址，api拒绝请求，移除和修改这些请求头之后，就可以正常请求api了。如果你想修改api响应的数据，写在proxyRes事件里，上面proxyRes里的代码示例是添加允许跨域的响应头。

最近vite也逐渐流行起来，我最近在新项目中也开始使用vite，查看了vite官网文档，官网给出了如下用法：

```js
'/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 是 'http-proxy' 的实例
        }
      }

```

更详细的用法指向了如下地址：https://github.com/http-party/node-http-proxy#listening-for-proxy-events

里面代码如下：
```js

proxy.on('proxyRes', function (proxyRes, req, res) {
  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});

```
直接将上述代码复制到configure里面就可以运行了，下面是示例：

```js
export default {
  //...
  server:{
    //...
    proxy: {
      '/api/': {
        target: 'http://www.abc.com',
        changeOrigin: true,
        prependPath: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', function (proxyReq, req, res) {
            proxyReq.removeHeader('referer')  //移除请求头
            proxyReq.removeHeader('origin') //移除请求头
            proxyReq.setHeader('host','www.abc.com') //添加请求头
          });
          proxy.on('proxyRes', function (proxyRes, req, res) {
            /*添加或删除响应头有两种写法，第一种是操作 proxyRes 参数*/
            delete proxyRes.headers['set-cookie']
            proxyRes.headers['set-cookie'] = 'new cookie value';

            /*第二种方法是操作 res 参数*/
            res.removeHeader("Access-Control-Allow-Origin");
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
            res.setHeader("Access-Control-Allow-Credentials", 'true');
            res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
          });
        }
      }
    }
  }
}

```

上面示例均是将地址/api/的请求转发到www.abc.com ，例：本地地址：127.0.0.1:8080/api/getUserInfo，目标api是:www.abc.com/api/getUserInfo 。
以上示例之给出了proxyReq事件，完整事件如下(机翻)：

````js
error：如果对目标的请求失败，则会发出错误事件。我们不对客户端和代理之间传递的消息以及代理和目标之间传递的消息进行任何错误处理，因此建议您侦听错误并进行处理。
proxyReq：在发送数据之前发出此事件。它使您有机会更改 proxyReq 请求对象。适用于“网络”连接
proxyReqWs：在发送数据之前发出此事件。它使您有机会更改 proxyReq 请求对象。适用于“websocket”连接
proxyRes：如果对目标的请求得到响应，则会发出此事件。
open：一旦创建代理 websocket 并将其通过管道传输到目标 websocket，就会发出此事件。
close：一旦代理 websocket 关闭，就会触发此事件。
proxySocket（已弃用）：建议使用open.

````
