# Webpack
Webpack是一个前端构建工具。构建工具就是把开发环境的代码转化成运行环境代码，是为了更快的执行
一般需要构建工具处理的几种情况：1.代码压缩
                             2.编译语法
                             3.处理模块化
webpack是一个现代JavaScript应用程序的静态模块打包器。当webpack处理应用程序时，会递归地构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个bundle

# Webpack四个概念
[entry]：项目的入口文件，可以配置多页面
[output]：出口地址，项目编译完成后的文件输出路径
[loader]：webpack只能理解JavaScript，loader能够去处理非js文件并转化为js。将源文件处理成能被识别的js文件，一次处理一个
[plugins]：用来扩展webpack功能，插件能够执行很多任务，比如打包优化、压缩等

# 核心对象
