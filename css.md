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
## BFC -- 边距重叠解决方案
BFC，块级格式化上下文，是一个独立的块级渲染区域，该区域拥有一套渲染规格来约束块级盒子的布局，与区域外部无关。
[BFC的原理]：
- BFC这个元素的垂直边距会发生重叠
- BFC的区域不会与浮动元素的float重叠
- 独立的容器，内外元素互不影响
- 计算BFC高度，浮动元素也参与计算
[如何创建BFC]：
- float不为none的时候
- position不为static或者relative的时候
- display与table相关的时候
- overflow为auto，hidden的时候
[BFC使用场景]：
- 兄弟元素之间的边距重叠问题，只需要给兄弟元素加上父元素，使之成为BFC
- 左右布局，左边浮动，右边会占据左边位置的问题，只需要给右边加上BFC
- 浮动问题，给父元素加上BFC使父元素有高度

# 行内元素和块级元素
[行内元素]：不能自行定义宽高的元素称为行内元素，如span,em,i,b,strong,a
[块级元素]：独占一行，可以定义宽高的元素称为块级元素，如div,p,section,header,footer,h1~h6,ul,li
[行内块元素]：可以自定义宽高并且在同一行显示，如textarea,input,button,img
[空元素]：hr,input,img,link,meta
行内元素可通过display: block转换为块级元素；display: inline-block转换为行内块级元素
块级元素也可通过display: inline-block转换为行内块级元素
行内块级元素可以实现float横向排列布局，但是存在间隙

# 水平垂直居中
[水平居中]：
- 文字居中：text-align: center
- 块级元素已知宽高：margin: 0 auto;
- flex布局主轴居中(默认row)：display: flex; justify-content: center;
- position定位：子绝父相，left: 50%; transform: translateX(-50%);
[垂直居中]：
- flex布局：display: flex; align-items: center;
- position定位：子绝父相，top: 50%, transform: translateY(-50%);
[垂直水平居中]：
- flex布局：display: flex; justify-content: center; align-items: center;
- position：子绝父相，left: 50%; top: 50%; transform: translate(-50%,-50%);
- position,margin auto：子绝父相，top:0; right:0; left: 0; bottom: 0; margin: auto;

# position属性
[static]：默认值，元素出现在正常文档流中
[fixed]：固定定位，相对于浏览器窗口进行定位
[relative]：相对定位
- 不会使元素脱离文档流
- 不影响元素本身特性
- 没有定位偏移量时，对元素没影响
- 提升层级z-index
[absolute]：绝对定位
- 使元素完全脱离文档流
- 影响元素本身特性
- 相对于最近一个有定位的父元素偏移，若父元素没有则往上找，直到document
- 提升层级z-index
[sticky]：粘性定位
- 基于用户滚动的位置
- 行为就像relative，但当页面滚动超出目标区域时，它的表现就像fixed，会固定在目标位置