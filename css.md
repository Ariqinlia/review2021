# 盒子模型(marin+border+padding+content)
[ie盒子模型(怪异盒模型)]：width/height = content+padding+border
[标准盒模型]：width/height = content
## css如何设置这两种模型
ie盒模型和标准盒模型转换可通过[box-sizing:border-box/content-box]
## js如何设置获取盒子模型对应的宽和高
- dom.style.width/height: 只能读取内联样式的宽度和高度
- dom.currentStyle.width/height: 获取即时的计算的样式，只支持IE
- window.getComputedStyle(dom).width/height: 获取当前元素[最终]使用的css属性值的方法，兼容性好
- dom.getBoundingClientRect().width/height: 计算盒模型在页面的绝对位置
- dom.offsetWidth/offsetHeight: 返回元素实际大小