### 个人博客

简洁风格的个人博客，技术栈: react、next.js、typescript、tailwind.css。

### 项目结构

```
├── components─────────────────────────组件目录
│   ├── article-toc.tsx────────────────文章目录组件
│   ├── article.tsx────────────────────首页文章列表组件
│   ├── container.tsx──────────────────布局容器组件
│   ├── external-script.tsx────────────附加scrip标签组件
│   ├── footer.tsx─────────────────────footer组件
│   ├── header.tsx─────────────────────header组件
│   ├── layout.tsx─────────────────────布局组件
│   ├── meta.tsx───────────────────────meta标签组件
│   ├── paginator.tsx──────────────────分页组件
│   ├── post-body.tsx──────────────────文章主体组件
│   └── post-header.tsx────────────────文章头部组件
├── lib────────────────────────────────lib目录
│   ├── api.ts─────────────────────────api，数据源
│   └── constants.ts───────────────────常量文件
├── pages──────────────────────────────页面路由目录
│   ├── article────────────────────────文章路由目录
│   │   └── [articlePath].tsx──────────文章详情页面
│   ├── gallery────────────────────────相册路由目录
│   │   ├── [galleryPath].tsx──────────相册详情页面
│   │   └── index.tsx──────────────────相册主页
│   ├── page───────────────────────────分页路由目录
│   │   └── [index].tsx────────────────分页页面
│   ├── 404.tsx────────────────────────404页面
│   ├── about.tsx──────────────────────关于页面
│   ├── _app.tsx───────────────────────app入口
│   ├── archives.tsx───────────────────归档页面
│   ├── _document.tsx──────────────────自定义文档结构
│   └── index.tsx──────────────────────首页
├── public─────────────────────────────站点根目录文件
│   ├── libs───────────────────────────第三方库目录
│   │   └── fancybox───────────────────fancybox
│   └── medias─────────────────────────资源目录
│       ├── avatar.jpg─────────────────头像图片
│       └── favicon.png────────────────站点图标
├── source─────────────────────────────hexo目录
│   ├── _data──────────────────────────自定义数据目录
│   │   ├── friends.json───────────────友链数据
│   │   └── gallery.json───────────────相册数据
│   └── _posts─────────────────────────文章目录
│       ├── 笔记────────────────────────分类目录
│       ├── 技术────────────────────────分类目录
│       ├── 生活────────────────────────分类目录
│       └── 折腾────────────────────────分类目录
├── styles──────────────────────────────样式目录
│   ├── custom-markdown.scss────────────文章样式
│   ├── custom.sass─────────────────────自定义样式
│   ├── index.css───────────────────────
│   └── theme.scss──────────────────────主题颜色定义
├── _config.yml─────────────────────────hexo配置文件
├── hexo.ts─────────────────────────────hexo初始化文件，提供数据源
├── next.config.js──────────────────────next配置文件
├── next-env.d.ts───────────────────────不知道啥玩意
├── package.json────────────────────────
├── postcss.config.js───────────────────
├── README.md───────────────────────────
├── tailwind.config.js──────────────────tailwind配置文件
└── tsconfig.json───────────────────────ts配置文件

```

### 安装使用

``` bash

# 安装依赖
npm install

# 开发运行
npm run dev

# 构建生产
npm run build

# 导出静态文件(构建之后才能导出)
npm run export

```
