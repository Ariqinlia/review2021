# 指令
指令是带有V-前缀的特殊属性，当表达式的值改变时，将其产生的连带影响，响应式的作用于DOM
[v-text]：用来设置当前元素的文本内容，相当于DOM对象的innerText或textContent
[v-html]：更新DOM对象的innerHTML
[v-bind]：通过v-bind为HTML元素绑定属性，使用data中提供的数据，可使用[:]来简化使用。eg: :titie ==> v-bind:title={{msg}}
[v-on]：绑定事件，支持js所有事件类型，v-on绑定的事件方法都要写在Vue实例中的methods对象中，可简写成[@]
[v-model]：在表单元素上创建双向数据绑定。
- 只能用于表单元素中
[v-for]：基于源数据多次渲染元素或模板块
<li v-for='(item,index) in list' :key='item.key'>{{item}}</li>

[v-bind:class]：添加类，可以是数组，也可以是对象
<h2 :class='{pink:true,green:true}'>中国惊奇先生</h2>
<h2 :class='['pink','fz','green']'>斗罗大陆</h2>

[v-bind:style]：为元素添加style
<h2 :style="{ color: activeColor, 'font-size': fontSize + 'px' }">不良人</h2>

[v-if]：根据表达式布尔值的真假决定是否加载这段代码，true会加载DOM，false不会加载DOM
[v-show]：根据布尔值来决定是否显示，但是不管是true还是false都会加载DOM，影响性能
[v-pre]：跳过这个元素和它的子元素的编译过程，可以用来显示原始{{}}
[v-once]：只渲染元素和组件一次。随后的重新渲染，该元素或者组件都会被视为静态内容并跳过
[v-cloak]：页面中使用{{}}的时候，经历了由{{}}到具体内容，页面会造成“闪烁”的问题。可通过v-cloak指令，避免了页面闪烁

# 动态添加数据到data
只有data中的数据才是响应式的，动态添加进来的数据默认为非响应式
可以通过一下方式实现动态添加数据的响应式：
- Vue.set(obj,key,value),适用于添加单个属性
- Object.assign(),适用于添加多个属性

# 异步更新DOM
当绑定的数据发生变动时，Vue异步执行DOM更新，监视所有数据改变，一次性更新DOM
解决方法：Vue.nextTick   this.$nextTick

# filter过滤器
[作用]：文本数据格式化，也就是将数据按照指定的一种格式输出
过滤器可以用在两个地方：{{}}表达式和v-bind指令中
[全局过滤器]：
- 通过全局方式创建的过滤器，在任何一个vue实例中都可以使用
- 在使用全局过滤器的时候，需要先创建全局过滤器，再创建Vue实例
<script>
  Vue.filter('date', function(value, format) {
    // value 要过滤的字符串内容，比如：dateStr
    // format 过滤器的参数，比如：'YYYY-MM-DD hh:mm:ss'
  })

var vm = new Vue({
})
</script>
[局部过滤器]：是在某一个vue实例中创建的，只在当前实例中有效
<div>{{msg | fi("九")}}</div>
  var vm = new Vue({
            el:'#app',
            data:{
                msg:'八百个标兵奔北坡，八百个标兵奔北坡'
            },
            //2. 局部过滤器 只有在当前Vue实例中才起作用
            // 通过 filters 配置项, 来创建过滤器
            filters:{
                // content是内容，format是过滤的规则可以多个参数
                fi:function(content,format){
                    return content.replace(/八/g,format);
                }
            }
        })

# watch监听配置项
watch是一个对象，键是需要观察的表达式，值是对应的回调函数。
当表达式的值发生变化后，会调用对应的回调函数完成响应的监视操作
<script>
        var vm = new Vue({
            el: '#app',
            data: {
                userName: '',
                isError: false,
                stu: {
                    age: 10,
                }
            },
            // 通过 watch 配置项，来监视数据变化
            // 只能监视 data 中的数据，要监视的数据，作为watch的属性
            watch: {
                // 监视userName值的变化，方法名要用要监视的值的名字
                userName:function(curVal, oldVal){
                    console.log('当前值为：', curVal, '上一次值为：', oldVal);
                    if(curVal.length>=4 && curVal.length<=8){
                        this.isError = false;
                    }else{
                        this.isError = true;
                    }
                },
                // 监听对象，加上deep:true
                // 注意：如果监视对象的变化，那么，curVal 和 oldVal 是相同的，指向同一个对象
                stu:{
                    handler:function(curVal, oldVal){
                        console.log('当前值为：', curVal, '上一次值为：', oldVal);
                    },
                    deep: true
                },
                // 一般都是监听对象中的属性
                // 只需要监视某个属性的变化，而不是整个对象中所有的属性的变化
                'stu.age':function(curVal, oldVal){
                    console.log('当前值为：', curVal, '上一次值为：', oldVal);
                }
            }
        })
    </script>

# computed计算属性
- 计算属性是基于它们的依赖属性进行缓存的，只有在它的依赖属性发生改变时才会重新计算。
- {{}}中不要放入太多的逻辑，否则会让模板过重，难以理解和维护
- computed中的属性不能与data中的属性同名，会报错
- 内部使用缓存机制，如果页面多个地方用到了计算属性，只会被计算一次
<div id="app">
        <input type="text" v-model='num1'>+
        <input type="text" v-model='num2'>=
        <input type="text" v-model='result'>
</div>
<script>
    var vm = new Vue({
        el: '#app',
        data: {
            num1: 0,
            num2: 0,
            // result: 0 计算属性名不能和data中的属性相同
        },
        // 特点：计算属性依赖的属性（比如：num1 和 num2）发生改变，那么计算属性就会被重新计算
        // 优势：内部使用缓存机制，如果页面中多个地方都用到了计算属性，那么计算属性只会被重新计算一次！！！
        computed: {
            result:function(){
                return (this.num1-0)+(this.num2-0);
            }
        }
    })
</script>

# 事件修饰符
[.native]：
[.stop]：阻止向上冒泡，不会调用父事件
[.prevent]：阻止默认行为，调用event.preventDefault()
[.capture]：捕获冒泡，即有冒泡发生时，有该修饰符的dom元素会先执行，如果有多个，从外向内依次执行，然后再按自然顺序执行
    如果不给爷爷加该事件修饰符，点击儿子，此时的触发顺序是儿子->爸爸->爷爷；
    如果给爷爷加上修饰符，点击儿子，触发顺序是爷爷->儿子->爸爸
[.self]：只有当事件在该元素本身触发时，才会触发事件
[.once]：事件只触发一次

# 键值修饰符（包括键盘、鼠标）
在监听键盘事件时，Vue允许为v-on在监听键盘事件时添加关键修饰符
<div id="app">
    <!-- 键值修饰符 包括键盘、鼠标 -->
    <!-- 13是Enter键的code值 -->
    <input type="text" v-model='msg' @keyup.13='submit'>
    <input type="text" v-model='msg2' @keyup.enter='submit2'><br>
    <!-- 使用自定义键值修饰符 -->
    <input type="text" v-model='msg' @keyup.f2='submit'>
</div>
Vue.config.keyCodes.f2 = 113;

# vue生命周期钩子函数
[beforeCreate()]：数据观测和初始化事件还未开始。在加载实例时触发
- 此时无法获取data中的数据，methods中的方法
- 可以在这个钩子函数中开启页面加载loading的效果
[created()]：实例初始化完成，可以调用methods中的方法，改变data中的属性
- 发送请求，获取数据
[beforeMounted()]：组件将要挂载到页面中，也就是说组件的内容还没有被挂载到页面中
- 此时，获取不到DOM元素
[mounted()]：组件已经被挂载到了页面中，可以对DOM进行操作了
[beforeUpdate()]：数据更新前调用，发生在虚拟DOM重新渲染和打补丁之前。可以在这个钩子函数中进一步更改状态，这不会触发附加的重新渲染过程
[updated()]：组件DOM已经更新完成，这时可以执行依赖于DOM的操作
[beforeDestroy()]：实例销毁之前调用，执行清理任务
[destroyed()]：Vue实例销毁后调用。

# 自定义指令
通过Vue.directive()自定义指令
第一个参数: 表示自定义指令的名称；
第二个参数：1.表示自定义指令运行的时候, 需要执行的逻辑操作；
           2.还可以是一个对象，对象中是指令的钩子函数;

# 对于MVVM的理解
MVVM是Model-View-ViewModel的缩写
[Model]代表数据模型，也可以在Model中定义数据修改和操作的业务逻辑
[View]代表UI组件，可以将数据模型转化成UI展现出来
[ViewModel]监听模型数据的改变和控制视图行为、处理用户交互，简单理解就是一个同步View和Model的对象，连接Model和View。
在MVVM架构下，View和Model之间没有直接的联系，而是通过ViewModel进行交互。Model和ViewModel之间的交互是双向的，因此View数据的变化会同步到Model中，而Model数据的变化也会立即反应到View上。ViewModel通过双向数据绑定把View层和Model层连接了起来，而View和Model之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作DOM，不需要关注数据状态的同步问题，复杂的数据状态维护完全由MVVM来统一管理。

# vue实现双向数据绑定
采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter,getter。
在数据变动时发布消息给订阅者，触发相应的监听回调。
当把一个普通的js对象传给vue实例作为它的data选项时，vue将遍历它的属性，用Object.defineProperty将它们转为getter/setter。
用户看不到getter/setter，但是在内部让vue追踪依赖，在属性被访问和修改时通知变化。
----------------------
vue的数据双向绑定，将MVVM作为数据绑定的入口，整合Observer,Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令（vue是用来解析{{}}）,
最终利用watcher搭起observer和compile之间的通信桥梁，达到数据变化->视图更新；视图交互变化->数据model变更双向绑定效果

# vue组件间的参数传递
（1）父组件与子组件传值
父传子：子组件通过props接收参数
子传父：子组件通过$emit()传递参数
（2）非父子组件间的数据传递，兄弟组件传值

# v-show和v-if的区别
v-show是css切换，即对display属性进行切换，v-if是完整的销毁和重新创建。
频繁切换时用v-show，运行时较少改变用v-if。
v-if是条件渲染，如果是false，不会渲染DOM

# 生命周期经历的阶段和钩子函数
（1）实例化vue(组件)对象：new Vue()
（2）初始化事件和生命周期，init events & init cycle
（3）[beforeCreate()]：
    在实例初始化之后，数据观测和事件配置之前被调用。
    即此时vue(组件)对象被创建了，但是vue对象的属性(如data、computed)还没有绑定，还没有值。
    此时还没有数据和真实DOM。
-------------------------------
即：属性还没有赋值，也没有动态创建template属性对应的HTML元素
-------------------------------
（4）挂载数据(属性赋值)：包括属性和computed的运算
（5）[Created()]：
    vue对象有值了，但是DOM还没有生成，[$el属性还不存在]。
    此时有数据了，但是还没有真实的DOM。
-------------------------------
即data,computed都执行了，属性已经赋值，但还没有动态创建template属性对应的HTML元素，所以，此时如果更改数据不会触发Updated()。
-------------------------------
    如果初始化的数据来自后端，可以发送异步请求获取数据，此时不会触发DOM更新
（6）检查
a.检查是否有$el属性，有就继续检查template属性，没有则手动绑定调用vm.$mount(),完成全局变量$el的绑定
b.检查是否有template属性，有就会替换$el对应的内容，没有则将整个$el对象进行填充。如果有render属性，那么render就会替换template
-------------------------------
即优先关系：render > template > $el
-------------------------------
（7）[beforeMount()]：模板编译(template)、数据挂载(把数据显示在模板里)之前执行的钩子函数。
    此时this.$el有值，但是数据还没挂载到页面上。
-------------------------------
即，此时页面中的{{}}的变量还没有被数据替换
-------------------------------
（8）模板编译：用vue对象的属性替换模板中的内容
（9）[Mounted()]：模板编译完成，数据挂载完毕
-------------------------------
即，此时已经把数据挂载到了页面上，所以能够在页面上看到正确的数据了。
一般来说，我们在此处发送异步请求，获取服务器上的数据，显示在DOM里
-------------------------------
（10）[beforeUpdate()]：
    组件更新之前执行的函数，只有数据更新后，才能触发beforeUpdate()。
    注意：此数据一定是模板上出现的数据，否则不会，也没必要触发组件更新(因为数据不出现在模板里，就没有必要重新渲染)
    数据更新了，但是vue对象对应的DOM中的内部innerHTML没有变，所以叫做组件更新前。
（11）[Updated()]：组件更新后执行的函数。
    vue对象对应的DOM中的内部改变了，所以叫做组件更新后
（12）activated()：keep-alive组件激活时调用
（13）deactivated()：keep-alive组件停用时调用
（14）[beforeDestroy()]：vue对象销毁之前，实例还存在
（15）[Destroyed()]：vue组件销毁后，所有相关的都被销毁，包括子组件

# 什么是vue的生命周期
vue实例从创建到销毁的过程就是生命周期。从开始创建、初始化数据、编译模板、挂载DOM，渲染、更新，渲染、销毁等一系列过程，称之为vue的生命周期。

# vue生命周期的作用是什么
生命周期中有多个事件钩子函数，让我们在控制整个vue实例的过程中更容易形成更好的逻辑

# vue生命周期总共有几个阶段
总共分为8个阶段，创建前后、挂载前后、更新前后、销毁前后

# 第一次页面加载会触发哪些钩子
beforeCreate(),Created(),beforeMount(),Mounted()

# DOM渲染在哪个周期中就已经完成
Mounted()

# 绑定class的数组用法
对象方法：<div :class="{'isShow': true,'isRed': false}"></div>
数组方法：<div :class="['class1','class2']"></div>
行内：<div :style="{color: red}"></div>

# computed计算属性和watch监听的区别
[计算属性computed]：
- 支持缓存，只有依赖数据发生改变，才会重新进行计算
- 不支持异步，当computed内有异步操作时无效，无法监听数据的变化
- computed属性值默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于data中声明过或者父组件传递的props中的数据通过计算属性得到的值
- 如果一个属性是由其他属性计算而来，这个属性依赖其他属性，是一个多对一或一对一，一般用computed
- 如果computed属性的属性值是函数，那么会默认走get方法，函数的返回值就是属性的值；在computed中的每一个属性都有一个get和set方法，当数据变化时，调用set方法
[监听属性watch]：
- 不支持缓存，数据变，直接会触发相应的操作
- watch支持异步
- 监听的函数支持两个参数，第一个是最新的值，第二个是输入之前的值
- 当一个属性发生变化时，需要执行对应的操作；一对多
- 监听数据必须时data中声明过或者父组件传递过来的props中的数据，当数据变化时，触发其他操作，函数有两个参数，immediate(组件加载立即触发回调函数执行)，deep(深度监听，为了发现对象内部值的变化)。deep无法监听到数组的变动和对象的新增，只有以响应式的方式触发才会被监听到

当需要在数据变化时执行异步或开销较大的操作时，建议使用watch
当数据需要随着另外的一些数据变化时，建议使用computed

（1）computed是一个对象时，有哪些选项
    get和set
（2）computed和methods有什么区别
    computed是一个属性，不能接受参数，是可以缓存的，而methods是方法，能接受参数，但不能缓存
（3）computed是否能依赖其他组件的数据
    computed可以依赖其他computed，甚至其他组件的data
（4）watch是一个对象时，有哪些选项
    handle监听函数，immediate是否立即执行，deep是否深度

# vue的路由实现
[hash模式]：在浏览器中符号“#”，#以及后面的字符称之为hash，用window.locaton.hash来获取
- hash虽然在URL中，但不被包括在HTTP请求中，仅hash之前的内容会被包含在请求中；用来指导浏览器动作，对服务器端完全无用，hash不会重新加载页面
- 可以为hash的改变添加监听事件
- 每一次改变hash，都会在浏览器的访问记录中增加一个记录
利用以上特点可以实现前端路由“更新视图但不重新请求页面”的功能了
[history模式]：采用HTML5的新特性，提供了两个新方法：pushState(),replaceState(),可以对浏览器历史记录栈进行修改，以及popState事件的监听到状态变更
window.history.pushState(stateObject, title, URL)
window.history.replaceState(stateObject, title, URL)
stateObject：当浏览器跳转到新的状态时，将触发popState事件，该事件将携带所提供的参数
这两个方法有个共同特点：当调用他们修改浏览器历史记录栈后，当前URL改变了，但是浏览器不会刷新页面。

# vue和angular的区别
[与angular的区别]：
- 相同点：都支持指令(内置指令和自定义指令)；都支持过滤器(内置过滤器和自定义过滤器)；都支持双向数据绑定；都不支持低端浏览器
- 不同点：angular学习成本较高，比如增加依赖注入，服务等特性，而vue本身提供的api比较简单、直观；
         在性能上：angular依赖对数据做脏检查，所以watcher越多越慢
                  vue使用基于依赖追踪的观察并使用异步队列更新，所有的数据都是独立触发的

# 组件中的data为什么必须是函数，return一个对象，而在实例中，data直接是一个对象
因为组件是用来复用的，js里对象是引用关系，这样的话作用域没有隔离，每次调用函数会在内存中新开辟一块空间。而vue实例是不会被复用的，因此不存在引用对象的问题

# 对于vue是一套渐进式框架的理解

# vue的两个核心是什么
数据驱动(双向数据绑定)和组件化

# vue中key值的作用
使用key来给每个节点做一个唯一标识。key的作用主要是为了高效的更新虚拟DOM。

如果都不写key的话，新生成的vnode和旧的vnode不匹配，就会直接销毁再创建新的，如果有key的话，只需要找到新的key和哪个旧的key相匹配，匹配的旧的key就会移动到匹配位置，不用再做销毁处理，这也是key作为标识符的好处。所以必须保证每个key是唯一的才能知道一个元素改变前后的位置，如果不是唯一的话，元素可能会移动到其他元素的位置而不是这个元素实际变化的位置。

key不能是随机数，因为新老产生的随机数不一样，所以不能作为新老对比的标识；
index也不能作为key，如果下标发生变化，如果是有排序功能的话，就会出现问题，最好使用业务中的key值，比如id，字符串等等

# diff算法
（1）只比较同一层级，不跨级比较
（2）tag不相同，则直接删掉重建，不再深度比较
（3）tag和key都相同，则认为是相同节点，通过比较新旧节点的细节上的不同，比如文本不一样，是否存在子节点来进行增加和删除以及修改

# 模板编译
vue通过template compiler将模板编译为render函数，执行render函数会生成vnode，如果模板更改了，会生成一个新的vnode，通过新旧vnode的diff，patch出所有需要变更的差异，然后应用到真实DOM上进行ui的更新

# v-for与v-if的优先级
v-for > v-if

# vue中组件之间的传值的方法
（1）父组件向子组件传值：
    父组件在子组件的标签中绑定[自定义属性];
    子组件通过[props]属性接收；
    <Child :name='123' />
    子组件：props：['name']
（2）子组件向父组件传值：
    在父组件中的子组件标签绑定自定义事件(子组件发射出来的事件)；
    子组件通过this.$emit()触发自定义事件，传值给父组件；
    <Child @changeName="changeName">
    data() {
        return {
            name: '';
        }
    }
    methods: {
        changeName(value) {
            this.name = value;
        }
    }
    子组件:
    <button @click="changeParentName"></button>
    methods: {
        changeParentName(value) {
            this.$emit('changeName','hhh' );
        }
    }
（3）兄弟组件之间传值：
    共同传值给父组件，再由父组件分发，即状态提升；
    使用vuex；
    利用自定义事件进行vue组件通讯，利用bus事件总线（中央事件总线）：
    eg: A组件中注册事件
        mounted() {
            event.$on('addTitle',this.handleAdd)
        }
        beforeDestroy() {
            // 及时销毁，否则可能造成内存泄漏
            event.$off('addTitle',this.handleAdd)
        }
        在B组件中触发事件
        import event from './event.js'
        add() {
            // 在B组件中触发A组件事件，进行通信
            event.$emit('addTitle',this.title)
        }
        // 创建event.js，其实就是创建一个vue实例
        import Vue from 'vue'
        export default new Vue()

# $NextTick
vue实现响应式并不是在数据发生后立即更新DOM，使用vm.$nextTic是在下次DOM更新循环结束之后立即执行延迟回调。在修改数据之后使用，则可以在回调中获取更新后的DOM

# 异步请求在哪个生命周期中调用
异步请求可以在created和mounted生命周期中调用，对于异步请求不操作dom或者依赖dom的时候，这两种生命钩子函数没有区别。
只有当要操作dom或者要依赖dom的时候，就在mounted中调用

# vue的过滤器
可以使用过滤器来处理通用文本，比如时间格式，文本格式等
[本地过滤器]：可以在组件中定义属于组件的过滤器，通过[filters]属性来定义
            filters: {
                xxxFn(value) { return another }
            }
但是在vue3中过滤器已经被删除，建议使用方法调用和计算属性去替换过滤器。
----------------
[全局过滤器]：如果在应用中全局注册了过滤器，那么在每个组件中用计算属性或方法调用来替换可能就没那么方便了，这时我们可以使用[全局属性]在所有组件中使用它
            app.config.globalProperties.$filters = { something need to filters }
            然后就可以通过[$filters]对象修改所有的模板
            like this: <p>{{ $filters.currencyUSD(accountBalance) }}</p>

# vue自定义指令
[局部指令]：在组件可以定义局部指令，通过[directives]
            directives：{
                defineName: {}
            }
[全局指令]：使用Vue.directive(defineName,{ code for directive })
[指令的钩子函数]：一个指令定义对象可以提供如下几个钩子函数(均为可选)
                [bind]：只调用一次，指令第一次绑定到元素时调用，在这里可以进行一次性的初始化设置
                [inserted]：被绑定元素插入父节点时调用(仅保证父节点存在，但不一定已被插入文档中)
                [update]：所在组件的vnode更新时调用，但是可能发生在其子节点vnode更新之前。指令的值可能发生了改变，也可能没有。可以通过比较更新前后的值来忽略不必要的模板更新
                [componentUpdated]：指令所在组件的vnode及其子组件vnode全部更新后调用
                [unbind]：只调用一次，指令与元素解绑时调用
[钩子函数的参数]：el,binding,vnode,oldVnode
                指令钩子函数会被传入以下参数：
                el: 指令所绑定的元素，可以用来直接操作DOM
                binding：一个对象，包含以下属性：
                        name: 指令名，不包括v-
                        value: 指令的绑定值
                        oldValue: 指令绑定的前一个值，仅在update和componentUpdated钩子中可用
                        expression：字符串形式的指令表达式
                        arg：传给指令的参数，例如v-my-directive:foo 中，参数为 "foo"
                        modifiers：一个包含修饰符的对象
                vnode：Vue编译生成的虚拟节点
                oldVnode：上一个虚拟节点
[动态指令参数]：指令的参数可以是动态的
                v-mydirective:[argument]="value"

# vue中为什么对数组不能劫持
（1）通过下标改变数组，vue无法监听
（2）通过修改数组length去操作数组，vue无法监听
（3）vue中对数组操作需要使用变异方法。push,unshift,pop,shift,sort,reverse,splice
（4）数组中的对象发生变化，是可以被监听的。比如arr[1].a = 1
（5）直接替换数组，可以被监听
在vue对data进行监听的时候，发现需要监听的对象是个数组，那么就不能用defineProperty来对数据进行监听了。
如果是数组，就需要对数组的原方法进行重写。
如果变异方法中，对数组添加对象，这里面的对象是没有被监听的，那么应该怎么处理呢？
定义了一个inserted变量，七个变异方法中，只有push,unshift,splice可以向数组插入值，如果监听到数组被插入数据，即inserted有值，则对inserted进行循环，然后对每一项进行监听
--------------
vue为什么对数组index的修改和lenght修改不做监听呢？
当数组项非常大的时候，操作下标或length会有严重的性能问题

# Vue的高级特性
[v-model]：
[$nextTick]：Vue是异步渲染，data改变之后，Dom不会立即渲染，$nextTick会在DOM渲染之后被触发，以获取最新的DOM节点
[refs]：
[slot]：父组件想往子组件里面插入一些东西
1.基本使用：从父组件向子组件添加内容，通过slot放到子组件指定位置。
            场景：子组件是一个公共的组件，提供一些通用功能，父组件可以往里放一些自定义的展示功能
2.作用域插槽：父组件通过slot获取子组件中的值
             在子组件中通过自定义属性来绑定数据，父组件通过template的v-slot属性接收数据。
             eg: 父组件：<Child>
                            <template v-slot='slotProps'>{{slotProps.slot_info}}</template>
                        </Child>
                 子组件：<slot :slot_info='xxx'></slot>
3.具名插槽：父组件中通过使用v-slot:slotName或者#slotName来定义slot的name，在子组件中通过<slot name='slotName'></slot>来获取内容
4.默认插槽：父组件中没有定义slot name，按照默认顺序往子组件插内容的
[动态、异步组件]：
                动态组件：有时候会根据条件来决定挂载在页面上的是哪个组件
                         用法 --> <component :is='componentName' />
                异步组件：通过import实现异步加载组件，懒加载，用到的时候才会加载
                         components：{ xxxComponent: () => import('组件路径') }
[keep-alive]：会将组件生成的DOM缓存起来，不用再重新创建，重新渲染，下次创建的时候直接使用即可。
              缓存组件，适用于频繁切换，不需要重复渲染，是vue常见的性能优化之一
[​mixin]：多个组件有相同的逻辑，抽离出来
        局部使用：mixins: [mixinName1,name2,name3...]
        全局使用：Vue.mixin({ something logic })
        mixin问题：1.变量来源不明确，不利于阅读；2.多个mixin可能会造成命名冲突；3.mixin和组件可能出现多对多的关系，复杂度较高

# composition API和Options API
在vue3中，Options API将beforeDestroy和Destroyed改为beforeUnmount和Unmount,仅仅是名字改变。
composition API: 新增了setup()，此方法是用来代替beforeCreate和Created生命周期钩子, 在这个方法里写其余的钩子函数只是多加了on，仅仅是名字改变。
composition API带来了什么？
1.更好的代码组织
2.更好的逻辑复用
3.更好的类型推导
如何选择composition API和Options API?
1.不建议共用，会引起混乱
2.小型项目、业务逻辑简单，用Options API
3.中大型项目、逻辑复杂，用Composition API

 ref: 1.可以用于值类型的响应式(最多的用法)。结合reactive()做响应式，在模板和reactive里用不用写.value，其他都需要写.value；2.还可以用于获取一个dom节点，eg: cons testRef = ref(null)

toRef: 针对一个响应式对象(reactive({......data}))的prop；一个响应式对象中的某个属性要用toRef来实现属性的响应式；

toRefs: 将响应式对象(reactive封装)转换为普通对象；对象的每个属性都是对应的ref;两者保持引用的关系

toRef和toRefs的最佳使用方式：

用reactive做对象的响应式，用ref做值类型的响应式；

setup中返回toRefs(state) / toRef(state,'xxx');

ref的变量命名都用xxxRef;

合成函数返回响应式对象时，使用toRefs

为何需要ref?

vue3中实现数据劫持是通过proxy，proxy只能对对象实现响应式，不能对值类型实现响应式，

为何需要.value?

# 为何需要toRef和toRefs?
在不丢失响应式的情况下，把对象数据分解、扩散；
只适用于响应式对象
注意：不创造响应式，而是延续响应式

# vue3升级了哪些重要功能？
(1)createApp:
vue2.x: const app = new Vue({....})
Vue.use(...) / Vue.component(...) etc.
vue3: const ap = Vue.createApp({...})
app.use(...) / app.component(...) etc.
(2)emit:
emits: ['...']
setup(props,{emit}) { emit('onfuncName',msg) }

# watch和watchEffect的区别
watch：对于reactive对象，watch(() => state.xxx, (oldState,newState) => { .... }, { deep: true/false,immi... })
       对于ref对象，watch(xxxRef,(old,new)=>{...},{...})
watchEffect: watchEffect(() => {...}), 在回调函数里写了哪些变量，就会自动侦听这些变量，不需要手动指定，不过在初始化的时候，就会执行一次，因为要shouji侦听的数据