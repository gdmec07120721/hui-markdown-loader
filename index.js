/*!
 * hui-markdown-loader <https://github.com/gdmec07120721/hui-markdown-loader.git>
 *
 * Copyright (c) 2019, xaobi.
 * Licensed under the MIT License.
 */

const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

//缓存文件夹
const cacheDemoPath = path.resolve(__dirname, '../../src/page/docs/cache/demo');
const cachePagePath = path.resolve(__dirname, '../../src/page/docs/cache/page');

//判断Cache文件夹是否存在
if(!fs.existsSync(cacheDemoPath)) {
    //异步创建Cache文件夹
    fs.mkdirSync(cacheDemoPath);
}

module.exports = function(content) {
    // 获取到用户给当前 Loader 传入的 options
    const options = loaderUtils.getOptions(this);

    // 不包含后缀的文件名
    let fileName = path.basename(this.resourcePath, '.md').replace(/\b(\w)|\s(\w)/g,function(m){
        //把首字符转化为大写
        return m.toUpperCase();
    });

    let demo_title = content.match(/(#{1,3})\s(.*?)(\s|\n|\r|\r\n)/) ? content.match(/(#{1,3})\s(.*?)(\s|\n|\r|\r\n)/)[2] : '';
    let demos = [];
    let demo_blocks = [];
 
    /*
    * 把下面格式
    * :::
    * ```html
    *  //内容
    * ```
    * :::
    * 内容提取
    * 提取生成示例
    */
    content = content.replace(/(^|\r|\n|\r\n):::[\s\S]*?```html(\r|\n|\r\n)([\s\S]+?)```[\s\S]*?:::(\r|\n|\r\n|$)/g, function(m, $1, $2, $3){
        //获取示例是否有标题
        let has_title = $3.match(/···\s(.*?)\s···/);
        //去掉标题
        let content = has_title ? $3.replace(has_title[0], '') : '';
        //获取示例标题
        let component_title = has_title ? has_title[1] : '';
        let demo_name = `${fileName}Demo${demos.length + 1}.vue`;
        let component_name = demo_name.replace(/\.vue$/, '');

        demos.push(demo_name);

        //异步创建文件
        fs.writeFileSync(path.join(cacheDemoPath, demo_name), content, 'utf8');

        demo_blocks.push([component_name, component_title]);

        return '```html' + content + '```';
    });

    if (demo_blocks.length > 0) {
        content = `${content}\n<Common-GetMessage />\n<iframe name="VmMobile" id="VmMobile" src="${options.baseUrl}/#/${fileName}Demo" width="360" height="600" frameborder="0" scrolling="no" class="v-press-vm-mobile"></iframe>`;
        
        let cache_content = `<template>
    <vm-mobile title="${demo_title}" demosOption="${demo_blocks.join('|')}" separator="|"></vm-mobile>
</template>
<script>
import VmMobile from "../../common/VmMobile"
export default {
    name: '${demo_title}',
    components: {VmMobile}
}
</script>
`;

        fs.writeFileSync(path.join(cachePagePath, `${fileName}Demo.vue`), cache_content, 'utf8');
    }

    return content;
};