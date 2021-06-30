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

# 原型
- 所有的对象都有__proto__属性，该属性对应的是该对象的原型prototype
- 所有的函数对象都有prototype属性，该属性的值会赋值给通过该函数创建的对象的__proto__属性
- 所有的原型对象都有constructor属性，该属性对应的是创建所有指向该原型的实例的构造函数
- 函数对象和原型对象通过prototype和constructor属性进行相互关联

# js中的继承方法
## 原型链继承
[实现方式]：将子类的原型链指向父类的对象实例。
[优点]：可以继承父类的所有属性和方法
[缺点]：无法向父类构造函数传参，且所有子类实例共享父类实例的属性，如果父类共有属性有引用类型，则一个子类实例更改父类构造函数共有的属性时，会导致继承的共有属性变化
## 构造函数继承
[实现方式]：在子类构造函数中使用call or apply劫持父类构造函数的方法，并传入参数。
[原理]：使用call或者apply更改子类函数的作用域，使this执行父类构造函数，子类因此可以继承父类共有属性
[优点]：解决了原型链继承的缺点，可以向父类构造函数传参
[缺点]：不能继承父类原型上的属性和方法，构造函数不可复用
## 组合继承
[实现方式]：综合使用原型链继承和构造函数继承。
[优点]：可以继承父类原型上的属性，也可以传参，每个实例引入的构造函数都是私有的(so修改引用类型也不会影响父类属性)
[缺点]：会执行两次父类构造函数，消耗大量内存，子类的构造函数会代替原型上的那个父类构造函数
## 原型式继承
[原理]：类似Object.create(),用一个函数包装一个对象，然后返回这个函数的调用，这个函数就变成了一个可以随意添加属性的实例或对象，结果是将[子对象的__proto__]指向[父对象]
[缺点]：共享引用类型
## 寄生式继承
[原理]：二次封装原型式继承，并拓展
[优点]：可以添加新的属性和方法
[缺点]：共享引用类型
## 寄生组合式继承
[原理]：改进组合继承，利用寄生式继承的思想继承原型，用构造函数继承构造函数的属性和方法。
[优点]：跟组合继承一样，但是少执行了一次父类构造函数
## ES6继承
[实现方式]：class和extends都是es6新增的，class用来创建一个类，extends用来继承。

# new操作符
- 创建了一个空对象
const p = {} // const p = Object.create({})
- 设置原型链，将空对象的__proto__指向构造函数的原型prototype
p.__proto__ = Func.prototype
- 改变this指向并执行构造函数
const result = Func.apply(p,arguments)
- 返回新创建的实例对象，如果返回的不是引用类型的数据则返回空对象，反之，则返回该引用对象
if(typeof(result) === 'object') {
    return result;
} else {
    return p;
}

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

[tips]：在js中，绑定的事件默认的执行时间是在冒泡阶段执行，而非在捕获阶段执行

# 什么是闭包 !!important -- curry柯里化函数
说到闭包应该提到的两点：
（1）作用域，一般来说一个函数中的变量的作用域只存在于这个函数中，其他地方不能访问到，但是可以通过闭包，在一个函数中可以访问到另一个函数作用域里的数据
（2）js的垃圾回收机制，一般的函数不被使用了，栈中的内存地址没有别处引用了，js就会执行垃圾回收机制，释放内存空间;
     而闭包有一个特性，不会被垃圾回收，因为引用一直被保留着，这就会导致内存泄漏的问题，解决内存泄漏的问题可以在使用完之后手动将变量设为null
执行上下文：全局环境和函数环境
闭包可以在函数中访问到另外的函数作用域中的数据
每次执行函数的时候都在内存中新开辟了一块空间
this指向当前调用函数的对象，箭头函数this指向执行上下文
内存泄漏解决方法，可直接将变量设置为null
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
 - 微任务：process.nextTick(), new Promise().then() <new Promise()是同步立即执行>, MutationObserver(html5新特性)
 同是微任务的情况下，process.nextTick()的优先级更高
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
[const和let]：都是块级作用域。const声明一个只读的常量，一旦声明就不能被改变，如果是引用类型，则是引用的地址不能改变，所以声明时必须赋值；
              let声明的变量只在当前作用域中有效，不能变量提升，不允许重复声明
[解构赋值]：按照一定模式从数组或对象中提取值，然后对变量进行赋值（先提取，再赋值）
- 数组：let [a,b]=[1,2] // a=1,b=2
        let [c,d,...e]=[1,2,3,4,5] // c=1,d=2,e=[3,4,5]
        let [f=100]=[] // 默认值f=100
        let [a,b]='adcd' // a='a',b='b'
- 对象：变量名和属性名一样的才可以
        let {foo} = {foo:1,bar:2} // foo:1
        let {foo: newFoo} = {foo:1,bar:2} // newFoo:1
- 实际运用：交换两个变量的值。[a,b]=[b,a]
           函数默认值。function(a=1) {}
[模板字符串]：用``代表模板字符串，其中变量需要用${变量名}来得到变量值。使用模板字符串可以换行，所有的空格和换行全都会被保留。
[函数的拓展]：函数默认值、rest参数(...变量名)、函数的length属性(返回没有指定默认值的参数个数)、name属性(返回该函数的函数名)、箭头函数
- 箭头函数特点：函数中的this是定义时所在的对象，不是使用时所在的对象；
               不可以当作构造函数，不能用new
               不可以用arguments对象，可使用...
               不可以用yield对象，不能用于Generator函数
[数组的扩展]：
- 扩展运算符(...),将一个数组转化为用逗号分隔的参数序列。合并数组：[...arr1,...arr2,...arr3]
- apply(this,...arg)
- 新增方法：Array.from(),将类数组和可遍历的对象转化为真正的数组
           Array.of()，将一组值转为数组。Array.of(1,2,3) => [1,2,3]
           copyWithin(target,start,end?), [1,2,3,4,5].copyWithin(0,3) => [4,5,3,4,5]
           find(),找到第一个返回值为true的成员并返回该值，没找到返回undefined。[2,3,4,1,3].find(n => n>2) // 3
           findIndex(),找到true的下标
           fill(value,start?,end?)，填充一个数组。[1,2,3].fill(5,0,1) // [5,2,3]
           includes(value),是否包含给定值。[1,2,3].includes(1) // true
           entries(),keys(),values(),用于遍历数组
[对象的扩展]：
- 属性的简写：let {name}=obj ==> name=obj.name
- 属性名可使用表达式：let foo='foo';let obj={ [foo]: 'fooValue' }
- 新增方法：Object.is(),用来比较两个值是否相等，与===一致，但也有不同之处，-0和+0不相等，NaN=NaN
           Object.assign(target,source),将源对象中的枚举属性复制到目标对象中。
- Null传导运算符(?.)
  <const firstname = (msg&&msg.name)> ==> <const firstname = msg?.name>
[Symbol]：ES6新增Symbol数据类型，表示独一无二的值
[Set、Map数据结构]：
- Set,类似于数组，但成员的值都是唯一的，没有重复，本身是构造函数。
  add(value),delete(value),has(value),clear()
  数组去重：Array.from(new Set([1,1,1,2,3,4]))
           [...new Set([1,1,1,2,3,4])]
- Map,类似于数组，是键值对的集合，解决了js的对象只能用字符串作为键的问题。使用set(),get(),delete(),clear(),增，查，删，清空
[Promise]：是异步编程的一种解决方案。
## 特点
- 状态不受外界影响。有三种状态：padding,fulfilled,rejected
- 一旦状态改变就不会再变
## 用法 refer to promise.js
new Promise((resolve,reject) => {}).then(res => {}, err => {}).catch().finally()
- <then()>: Promise实例具有then(),是定义在原型对象Promise.prototype上的。then()返回的是一个新的Promise实例，所以可以采用链式写法
- <catch()>: 捕获发生错误或者异常的回调
- <finally()>: 不管promise对象最后的状态是什么都会执行的操作
- <all()>: 将多个Promise实例，包装成一个新的Promise实例。在all()中可以传递多个Promise对象，当所有实例对象的状态都是fulfilled,就返回fulfilled,否则返回rejected
- <race()>: 将多个promise实例，包装成一个新的promise实例。传递多个promise对象，如果在这些实例中有一个先改变了状态，那么race的状态就会变
[Iterator]：其实就是Symbol内置属性Symbol.iterator(),该方法会返回一个Iterator对象，包含一个next(),调用之后会返回一个迭代器结果对象iteratorResult,这个对象包含两个值：
            value为遍历的item，done为当前数据是否遍历完成。 
            {value: item, done: true/false}
- 为各种数据提供统一的，简便的访问接口
- 使数据结构的成员能按某种次序排列
- 主要供for...of使用
原生有iterator的数据结构：Array,Map,Set,某些类似数组的对象(String,arguments,Nodelist etc)
- 解构赋值：对数组和Set结构进行解构赋值时，会默认调用Symbol.iterator
            <let set = new Set().add('a').add('b').add('c')>
            <let [x,y] = set> ==> x='a',y='b'
            <let [first,...rest] = set> ==> first='a', rest=['b','c']
- 扩展运算符：只要某个数据结构部署了Iterator接口，就可以使用扩展运算符，转为数组。
             一个数据结构只要具有[Symbol.iterator]属性就认为是[可遍历的]
- yield*
- 其他场合： for...of,Array.from().Map(),Set(),WeakMap(),WeakSet(),Promise.all(),Promise.race()
            由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，都调用了。
## for...of 和for...in
- for...of: 可以遍历获得键值value，但是数组的遍历只会返回具有数字索引的属性，不能遍历普通对象，可通过Object.keys搭配使用
- for...in: 只能获得对象的键名key，以字符串的形式，不饿能直接获取键值，也就是说用for...in循环数组，得到的键名是字符串
<let arr = [1,3,5]; arr.foo = 'a'>
<for(let i in arr) {console.log(i); console.log(typeof i)}> // 0,1,2,'a' string
<for(let i of arr) {console.log(i); console.log(typeof i)}> // 1,3,5 number

[Generator]：是es6提供的一种异步编程解决方案。Generator函数是一个普通函数，有两个特征：
             1.function关键字与函数名之间有一个*。function* funName() {}
             2.内部使用yield语句，定义不同的状态
- 遇到yield语句，暂停执行后面的操作，并将yield后面的值作为返回value的值
- 直到return语句，将return后面的值作为返回对象的属性值
- 如果没有return语句，value为undefined
- Genertor函数可以不用yield语句，这时就变成了一个单纯的暂缓执行函数
- yield语句不能用在普通函数中，会报错
- next()的参数：yield本身没有返回值，或者说总是返回undefined
               next()可以带一个参数，该参数会被当做上一个yield语句的返回值
- for...of可以自动遍历Generator函数生成的Iterator对象，不需要调用next()，一旦next()返回对象的done为true，for...of循环会中止
    function* foo() { yield 1; yield2; yield3; return 4; }
    for(let v of foo()) { console.log(v) } // 1,2,3
## 在ES2017中提出了async await,是Generator的语法糖
用法：async function a() {
            await something;
            do something
            await ...
     }
- 执行a()时不会阻塞函数外面的代码，a()中代码会按顺序执行
[class]：ES5没有类的概念
ES5定义一个类
function Point(x,y) { this.x=x; this.y=y; } let p = new Point(1,2)
ES6定义一个类
class Point { constructor(x,y) { this.x=x; this.y=y; } } let p = new Point(1,2)
- constructor()是类的默认方法，通过new命令生成对象时会调用此方法，如果声明类时没有定义，会默认定义一个空的
- 生成实例必须用new，不然会报错
- 不存在变量提升(先定义类，再生成实例)
## 类的静态方法
所有在类中定义的方法都会被实例继承，如果不想被继承，可以在定义时加上static，表示为静态方法
## 类的静态属性
ES6中并没有给类设置静态属性，但可以定义,类名.属性名
class Foo {}
Foo.prop = 1;
## class继承 extends
[Module]：[ES6Module]
[Proxy]：用于修改某些操作的默认行为，在目标对象之前设一层拦截，可以对外界的访问进行过滤和改写

 # 防抖和节流
 [防抖]：触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间。
 [节流]：高频事件触发，但在n秒内只执行一次，所以节流会稀释函数的执行频率。在n秒内第一次触发则执行，直到n秒结束
 ## 防抖和节流的区别
 [相同点]：都可以通过延时来实现，都是为了降低执行频率，节省资源
 [不同点]：防抖在一定时间内多次触发只会执行最后一次触发，节流侧重于一段时间只执行一次
 
# setTimeout 和 setInterval 的区别
- setTimeout(fn,time): 在规定的time后只执行一次函数内的代码，只执行一次，以后便不再执行
- setInterval(fn,time): 按照规定的time来[循环调用]函数或要执行的代码，直到clearInterval()被调用或者窗口被关闭。会循环执行代码，直到清除id
setInterval的缺点：使用setInterval时，某些间隔会被跳过；即使调用的方法出错也会继续执行
                  无视网络延迟，可能多个定时器会连续执行，达不到定时器的效果
总的来说：每个setTimeout产生的任务会直接push到任务队列中，而setInterval每次在push到任务队列中之前，会先判断，看上一次的任务是否还在队列中，如果在的话则直接跳过当前定时器

# 观察者模式和订阅发布者模式的区别
[观察者模式]：观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态改变时，所有依赖它的对象都会得到通知，并自动更新，观察者模式就是观察者和被观察者之间的通讯。
            还有一个别称叫做“订阅-发布模式”
[订阅-发布者模式]：在现在的订阅-发布者模式中，称为发布者的消息发送者不会直接将消息发送给订阅者，这意味着发布者和订阅者不知道彼此的存在。在发布着和订阅者之间存在第三个组件，称为
            调度中心或事件通道，维持着发布者和订阅者之间的联系，过滤所有发布者传入的消息并相应的分发给他们的订阅者
观察者模式使观察者和被观察者耦合在一起，订阅-发布者模式将订阅者和发布者解耦，交给第三方组件进行两者通信

# mouseenter和mouseover的区别
都是鼠标进入的事件
[mouseover]：鼠标滑入元素或者子元素都会触发该事件，会触发多次，因为该事件存在冒泡的过程。对应的移除事件是[mouseout]
[mouseenter]：鼠标进入元素本身，即不包含元素的子元素会触发该事件，不存在冒泡。对应的移除事件是[mouseleave]

# 异步加载js的方式
异步加载js？
使js文件脱离html解析的瀑布流加载，从而使js可以并行下载。
为什么要异步加载？
一般把js写在head中，默认就是同步加载，同步加载可能会导致页面加载堵塞，引发白屏，用户体验不佳
（1）可以动态的添加一个script标签，
（2）使用defer，可以延迟脚本的执行，但是只在ie中有效
    1.defer只适用于外联样式
    2.如果有多个脚本声明了defer，会按顺序下载和执行
    3.defer脚本会在DOMContentLoaded和load事件之前执行
（3）script标签上添加async属性
    1.只适用于外联样式
    2.如果有多个声明了async，其下载和执行也是异步的，无法确定执行顺序
    3.async会在load事件之前执行，不确定DOMContentLoaded的先后顺序
（4）创建并执行iframe，异步执行js

# DOM文档的加载步骤
[解析HTML结构]
[加载外部脚本和样式文件]
[解析并执行脚本]
[构建DOM模型]：当初始的HTML文档被完全解析并加载之后，[DOMContentLoaded]事件就会被触发，无需等待外部资源文件加载完成，如image。可以操作DOM节点
[加载外部资源文件]
[页面渲染完成]：页面上所有的资源（图片，视频，音频等）被加载以后才会触发load事件，可以对资源进行一系列的操作

# 数组的方法
[修改原数组]:
- push(), 往数组的末尾添加一个或多个元素，返回修改后数组的长度
- pop(), 删除并返回数组的最后一个元素
- unshift(), 向数组的开头添加一个或多个元素，返回数组的长度
- shift()，删除并返回数组的第一个元素
- sort()，对数组进行排序
- reverse()，颠倒数组中元素的顺序
- splice(startIndex, how many, ...item)，删除或者替换元素,删除元素并向数组添加新的元素
实例方法：
- copyWithin(target, startIndex, endIndex)，将指定位置的元素复制到其他位置，返回当前数组
- fill(), 使用给定值，填充一个数组。 // [a,b,c].fill(5) => [5,5,5]
[不修改原数组]：
- concat()，合并数组，返回新数组
- join()，把数组的所有元素都放入一个字符串，并用指定的字符分隔
- slice(start, end)，切分数组并返回，也可以用[Array.prototype.slice.call(arguments)]将类数组转换为数组
- indexOf()，查找元素的下标，没找到返回-1，找到返回下标
- lastIndexOf()，从数组末尾开始查找
迭代方法：每个方法都接受两个参数，一个是回调函数callback(value,index,array)，另一个参数可以用来指定this，如果第二个参数不指定，则默认为window，严格模式下是undefined
         除了forEach的callback没有返回值，其它的都需要有return，否则会返回undefined
- forEach()
- map(), 对数组的每一项都运行给定的函数，返回每次函数调用的结果组成的数组
- filter()，对数组进行过滤，返回符合条件的元素的数组
- some()，判断数组中是否存在满足条件的项，只要有一个满足就返回true，否则false，[空数组返回false]
- every()，判断数组中的每一项是否都满足条件，都满足返回true，否则false，[空数组返回false]
归并方法：会迭代数组中的所有项，然后生成一个最终的值，这两个方法都接受两个参数，第一个参数callback(初始值，当前值，当前索引值，当前数组)，函数需要返回一个值，这个值会在下一次迭代中
         作为初始值；第二个参数是迭代初始值，如果没有，则初始值为数组的第一项
- reduce()，接收一个函数作为累加器，数组中的每个值(从左到右)开始缩减，最终计算为一个值。[对于空数组是不会执行回调函数的]
- reduceRight()，与reduce()一样，差异在于是从数组的末尾开始的
- includes()，返回一个布尔值，表示某个数组中是否包含给定的值
- find()，用于找出第一个符合条件的数组元素。参数是一个回调函数，如果没有找到，则返回undefined
- findIndex(), 找出第一个符合条件的数组元素的下标
- entries(),keys(),values()，遍历数组，返回的都是一个遍历器对象，所以可以使用for...of进行遍历
Array方法:
- Array.isArray(), 判断是否为一个数组
- Array.from(likeArray,callback), 将类数组和可遍历的对象转换为真正的数组,也接受第二个参数callback，遍历数组并返回
- Array.of(), 用于将一组值转换为数组。  // Array.of(1,2,3) => [1,2,3]

# 在==比较的过程中，数据转换的规则
[==只要数据转换后的值相等就相等，不考虑类型是否相等，而===更加严格，比较的是类型相等，值也相等才相等]
（1）类型一样的几个特殊点：{}=={} ==> false,
                         []==[] ==> false,
                         NaN==NaN ==> false
                         对象比较的是堆内存中的地址
（2）类型不一样的转换规则：
                         null==undefined ==> true  (null/undefined和其它数据类型都不相等)
                         字符串==对象，先把对象转为字符串，toString()
                         其余的如果==两边类型不一致，需要转换为数字再进行比较
在ES6中新增了Object.is()，与== && === 不同的地方：
    Object.is(NaN,NaN) ==> true
    Object.is(+0,-0) ==> false
# 其它数据类型转换为布尔：
（1）基于以下方式可以把数据类型转换为布尔：!转换为布尔值后取反
                                       !! 转换为布尔类型
                                       Boolean(xxx)
（2）隐式转换：再循环或条件判断中，条件处理的结果就是布尔类型的值
规则：只有[0,NaN,null,undefined,空字符串]，这五个值会变为false，其余都是true
[]==false ==> true
![]==false ==> true
# 其它数据类型转换为Number
[]空数组 ==> 0
{}空对象 ==> NaN

# this关键字的指向
this指向是在运行时被创建的，不是定义的时候
（1）全局环境下，this默认指向window
（2）在一个对象里的变量或者函数，this指向当前调用的对象
（3）构造函数实例化的this，如果构造函数没有返回值或者返回值不是对象类型的值，此时的this就是创建的实例化对象；如果有返回值并且是对象类型的值，this就是当前返回的对象
（4）有时在函数中会丢失正确的this指向，将this指向了window，可以使用call/apply/bind来改变this的指向，指向正确
（5）箭头函数没有this指向，它的this在定义时就被确定，this指向箭头函数的上下文

# 虚拟dom和真实dom
虚拟dom是由js实现的，为了避免频繁更新真实dom，通过js的对象模拟dom中的节点，然后渲染成真实的节点，在数据更新时，渲染得到一个新的虚拟dom，与上一次的虚拟dom进行比对，得到所有需要变更的差异，然后应用到真实dom上实现ui的同步更新。
（1）虚拟dom不会引起回流和重绘
（2）虚拟dom进行频繁的修改，将所有修改一次性应用到真实dom上，会减少回流和重绘的触发频率
（3）真实dom回流和重绘的效率很低，会对性能造成影响
虚拟dom本质就是在js和真实dom之间做了个缓存

# 基础数据类型和引用数据类型

# Object.freeze()
可以使对象冻结，不再被修改




