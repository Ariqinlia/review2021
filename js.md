## arguments
arguments.callee指向函数自身引用
function test() {
    console.log(arguments)
}
 -- arguments是一个函数的实参，类似数组，其中有一个属性callee指向函数本身,callee.name = 'test'
 -- 与fun.caller的区别：caller是指该函数的调用函数，如果没有函数调用此函数，则返回null

## js的基本类型和引用类型
基本类型: number,string,null,undefined,boolean,symbol(es6),bigint(es6)
引用类型：object(array,date,function,RegExp正则)
## 如何判断js数据类型
type of只能返回number,string,boolean,undefined,object,function,对于特殊对象array,null等都返回object，返回字符串
 -- 最好是用来判断某个变量是否定义或者赋值，如typeof a!=='undefined',而不是if(a){...},不会报语法错误
instenceof就是用来测试一个对象是否在其原型链原型对象的属性，对自定义对象的比较更有意义
 -- [1,2] instence of Array -> true
 -- [1,2] instence of Object -> true // 由于Array是Object的子类，所以是true
 Object.prototype.toString.call：常用来判断浏览器内置对象，对自定义对象没用，只能返回"[Object Object]"
 -- 每一个继承Object的对象都有toString()，如果该方法没有重写的话会返回[Object type]，其中type为对象的类型。
 -- 除了Object对象之外，其它类型直接使用toString()，会返回内容的字符串，所以我们需要用call或者apply去改变上下文的指向
 -- const an = ['hello']; an.toString(); // "hello"
 -- Object.prototype.toString.call(an); // "[Object Array]"
 ## instence of跟原型链有关，可引申到原型链
 const obj = new Object()
 原型链：每个实例对象obj都有一个私有属性__proto__，该属性指向它的构造函数的原型对象prototype，即obj.__proto__ = Object.prototype
        该原型对象也有自己的__proto__，层层向上查找，直到找到原型对象是null。null没有原型，作为原型链的终点
__基于原型链的继承__
### 继承属性：js对象有一个指向原型对象的链，当试图要访问一个属性的时候，不仅仅在当前对象上搜寻，还会在该对象的原型对象搜寻，以及该对象的原型的原型，直到找到一个名字匹配的属性或者原型链的终点null，找不到就返回undefined
function Func() {
    this.a=1;
    this.b=2;
}
let aa = new Func()
Func.prototype.c=3;
Func.prototype.d=4;
// aa是Func的实例对象，本身自带属性a和b，又给aa的构造函数的原型对象增加了新的对象c和d，这时的原型链就是aa.__proto__ -> Func.prototype -> object.prototype -> null
### 继承方法：与属性继承一样，当继承函数被调用时，this的指向是当前继承的对象，而不是继承对象的原型对象
var o = {
  a: 2,
  m: function(){
    return this.a + 1;
  }
};
console.log(o.m()); // 3
// 当调用 o.m 时，'this' 指向了 o.
var p = Object.create(o); // p是一个继承自 o 的对象
p.a = 4; // 创建 p 的自身属性 'a'
console.log(p.m()); // 5
// 调用 p.m 时，'this' 指向了 p
// 又因为 p 继承了 o 的 m 函数
// 所以，此时的 'this.a' 即 p.a，就是 p 的自身属性 'a' 
### 性能问题：在原型链上查找属性比较耗时，层层遍历，试图访问一个不存在的属性会遍历整个原型链
检查对象是否存在自己定义的属性，必须用所有对象从Object.prototype继承的hasOwnPrototype()

# js中的继承方法

# js拷贝
js拷贝分为浅拷贝和深拷贝
__浅拷贝__:只对[基本数据]类型进行拷贝，复杂类型还是引用的被拷贝的数据的地址。方法有：Object.assign(),es6中的解构赋值、展开运算符(...)，数组的slice(),concat(),Array.from()
__深拷贝__:对[所有数据类型]进行真正的拷贝，会另外创造一个一模一样的对象，与被拷贝对象不共享同一个堆地址，修改新对象也不会改变原对象。方法有：利用JSON.parse()和JSON.stringify()、利用递归实现(ref to deepCopy.js)

# 事件处理机制
事件处理机制有三个阶段：事件捕获、目标阶段、冒泡阶段
事件捕获：捕获阶段，在事件对象到达事件目标之前，事件对象必须从window经过目标的祖先节点传播到事件目标。在这个阶段的事件监听器在事件到达目标前必须要先执行事件。
目标阶段：事件对象到达事件目标。一旦事件到达事件目标，该阶段的监听器就会对它进行处理。如果一个事件类型被标记为不能冒泡，那么对应的事件处理到这个阶段就终止。
冒泡阶段：事件对象以一个与捕获阶段相反的方向从事件目标传播，经过其祖先节点传播到window。在此阶段注册的事件监听器会对相应的冒泡事件进行处理。
在一个事件完成了所有的阶段的处理之后，它的[Event.currentTarget]会被设置为[null],[Event.eventPhase]会被设为[0]，Event的其他属性都不会改变
[Event.currentTarget]事件属性返回的是其监听器触发事件的对象，即当前处理该事件的元素、文档或窗口
[Event.eventPhase]返回事件传播的当前阶段，1(捕获阶段)，2(正常事件派发)，3(起泡阶段)
## 阻止事件冒泡
ie浏览器：[event.cancelBubble]=true
非ie浏览器：[event.stopPropagation]()
## 阻止事件的默认行为
事件的默认行为是指浏览器在事件传递和处理完成之后自动执行的动作。例如，单击一个超链接的默认行为是访问其定义的URL
ie：设置[Event.returnValue]=[false]
not ie: [Event.preventDefault]()

# 什么是闭包 !!important -- curry柯里化函数
闭包可以读取到函数内部的变量，通过函数内部的函数实现，在这个函数内部中去访问函数内部的变量，并将其返回，就形成了闭包

# 事件循环机制(event loop)
## js是单线程的，非阻塞的。
 - JavaScript用于用户交互，操作dom。如果它是多线程的就有很多东西要处理，比如现在有两个线程同时操作DOM，一个删除当前DOM节点，一个操作当前节点，那这个时候以谁为准？
  所以它是单线程的
 - 非阻塞通过event loop实现
## 浏览器的事件循环
[执行栈和事件队列]：异步代码执行时，不会等待它返回结果，而是继续执行执行栈中的其他任务。当异步代码返回结果，将它放入事件队列中，这时不会立即执行回调，而是等待当前执行栈中的所有任务执行完毕，主线程空闲状态的时候就会去事件队列中查找是否有任务，如果有，则取出排在第一位的事件并把回调放入执行栈中，然后执行其中的同步代码。
[宏任务和微任务]：各种IO线程执行后的事件一定会放到事件队列中，保持先进先出原则执行，如果有优先级更高的任务要尽快执行，那么一种任务就不合适了，因此引入了微任务队列。
 - 宏任务：script(整体代码)、setTimeout()、setInterval()、postMessage、I/O、UI交互事件
 - 微任务：new Promise().then() <new Promise()是同步立即执行>,MutationObserver(html5新特性)
[运行机制]：执行宏任务，然后执行当前宏任务中产生的微任务，如果微任务在执行过程中又产生了新的微任务，就继续执行微任务，微任务执行完毕后，再回到宏任务中进行下一次循环
 - 执行一个宏任务（栈中没有就从事件队列中获取）
 - 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
 - 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
 - 当前宏任务执行完毕，开始检查渲染，GUI线程接管渲染
 - 渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）
## node环境下的事件循环
和浏览器有何不同？
表现出的状态与浏览器大致相同，不同的是node中有一套自己的模型。如果是node10以及之前的版本，一个阶段执行完毕就会去执行微任务队列中的任务。更新到11之后，跟浏览器趋于一致，一旦执行一个阶段里的宏任务（setTimeout,setInterval,setImmediate）就立即执行微任务

# 前端模块化
commonJS、CMD和sea.js、AMD和require.js、ES6 Module
[commonJS]：node.js是common.js规范的主要实践者，有4个重要的环境变量为模块化的实现提供支持，module，exports，require，global。
            实际使用时，用module.exports定义当前模块对外输出的接口（不推荐直接使用exports），用require加载模块。
            common.js同步加载模块，在浏览器因为网络原因，更合理的方案是异步加载模块。
[AMD和require.js]：AMD规范采用异步加载模块，模块的加载不影响后面语句的运行。所有依赖该模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。
                   用require.js实现AMD规范的模块化，require.config()指定引用路径，define()定义模块，require()加载模块。
                   require.js在声明依赖模块时会在第一时间加载并执行模块内的代码：
    define(["a", "b", "c", "d", "e", "f"], function(a, b, c, d, e, f) { 
    // 等于在最前面声明并初始化了要用到的所有模块
    if (false) {
      // 即便没用到某个模块 b，但 b 还是提前执行了
      b.foo()
    } });
[CMD和sea.js]：与AMD很类似，不同点在于，<AMD推崇依赖前置，提前执行>；<CMD推崇依赖就近，延迟执行>
    define(function(require, exports, module) {
    var a = require('./a'); // 在需要时申明
    a.doSomething();
    if (false) {
        var b = require('./b');
        b.doSomething();
    }
});
[ES6Module]：ES6在语言标准上的层面上，实现了模块功能，主要由export和import构成。export命令用于规定模块的对外接口，import命令用于输入其它模块提供的功能。
    export { basicNum, add };
    /** 引用模块 **/
    import { basicNum, add } from './math'; 
            ES6还提供export default命令，为模块指定默认输出。对应的import不需要大括号
    export default { basicNum, add };
    import math from './math';
    <ES6的模块不是对象，import命令会被JavaScript引擎静态分析，在编译时就引入模块代码，而不是代码运行时加载，所以无法实现条件加载>
## ES6 Module与commonJS模块的差异
 - commonJS模块输出的是一个值的拷贝，ES6模块输出的是值的引用
 - commonJS模块是运行时加载，ES6模块是编译时输出接口（静态定义）
 - - 运行时加载：commonJS模块就是对象；即在输入时先加载整个模块，生成一个对象，然后从这个对象上读取方法，这就叫做运行时加载。
 - - 编译时加载：ES6模块不是对象，而是通过export命令显式指定输出的代码，import采用的静态命令的方式。即在import时可以指定加载某个输出值，而不是加载整个模块

 # ES6新增特性

 # 防抖和节流
 [防抖]：触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间。
 [节流]：高频事件触发，但在n秒内只执行一次，所以节流会稀释函数的执行频率。在n秒内第一次触发则执行，直到n秒结束
 ## 防抖和节流的区别
 




