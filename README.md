## Hui-markdown-loader

基于 Vuepress 的一个简单的 Thinkive-hui UI 组件库 Markdown 文档 Loader。

### 安装
---

```
> npm install hui-markdown-loader --save-dev
```

### 使用
---

在config.js文件修改内部的 Webpack 配置（[configureWebpack](https://vuepress.vuejs.org/zh/config/#configurewebpack)）


```js
//修改内部的 Webpack 配置
configureWebpack: (config, isServer) => {
  //...
  //添加‘.md’文件模块解析规则
  config.module.rules = config.module.rules.map(item => {
    let copy_item = {...item};

    if (copy_item.test.toString().indexOf('.md') > -1) {
        //使用markdown-load-vue解析器
        item.use.push({
            loader: 'hui-markdown-loader'
        });
    }           
    return item;
  });
}
```

在.md文件中使用

```md
:::
```html
//...写些vue代码

```
:::
```

