function add(a){
    function s(b){
       a = a + b;
       return s;
    }
    s.toString = function(){return a;}
    return s;
   }
// console.log(add(1)(2)(3))

for (var i=1; i<=5; i++) {
   (function(a){
      setTimeout( function timer() {
         // console.log(a++);
     }, a*1000 );
   })(i) // 在执行队列中保留每个i的值
   // 1，2，3，4，5
}

for (var i=1; i<=5; i++) {
   function test(i) {
      setTimeout( function timer() {
         // console.log(i);
     }, i*1000 );
   }
   test(i)
}

function curry(fn) {
   var args = Array.prototype.slice.call(arguments, 1); // 截取curry的第一个传参，返回一个新数组，不改变数组本身
   return function() {
       var innerArgs = Array.prototype.slice.call(arguments);
       var finalArgs = args.concat(innerArgs);
       return fn.apply(null, finalArgs);
   };
}

function add(num1, num2) {
   return num1 + num2;
}
var curriedAdd = curry(add, 5);

var curriedAdd2 = curry(add, 5, 12);

// alert(curriedAdd(3))    // 8
// alert(curriedAdd2())    // 17

function curry22(fn) {
   const len = fn.length;
   console.log(len)
   return function t() {
      let innerLength = arguments.length;
      console.log('innerLength',innerLength)
      let nextArg = Array.prototype.slice.call(arguments);
      if(innerLength>=len) {
         return fn.apply(null,nextArg);
      } else {
         return function() {
            const innerArgs = Array.prototype.slice.call(arguments);
            return t.apply(null,[...nextArg,...innerArgs]);
         }
      }
   }
}
function add22(num1, num2, num3,num4) {
   return num1 + num2+num3+num4;
}
const cury = curry22(add22);
console.log(cury(1)(2)(3)(4))

// 参数未明确个数
function curry33(fn) {
   // 保存预置参数
   let arg = [].slice.call(arguments,1);
   let len = fn.length;
   function inner() {
      let args = [].slice.call(arguments);
      arg = [...arg,...args];
      return inner
   }
   // 重写toString()
   inner.toString = function() {
      return fn.apply(null,arg);
   }
   return inner;
}
function add33() {
   return [].slice.call(arguments).reduce((n1,n2) => {
      return n1+n2;
   })
}
const cury33 = curry33(add33);
// console.log(cury33(1))

function rand(a,b) {
   const arr = [];
   const aTemp = a;
   while(a <= b) {
      arr.push(a++)
   }
   const index = Math.floor(Math.random()*(b-aTemp+1));
   return arr[index]
}
console.log(rand(-5,5))

const arr = [
   {
      age: 18, wight: 50
   },
   {
      age: 20, wight: 60
   },
   {
      age: 18, wight: 40
   }
]
function sortArr(arr) {
   arr.sort((a,b)=>{
      if(a.age<b.age) {
         return -1;
      } else if(a.age>b.age) {
         return 1;
      } else if(a.age===b.age) {
         return a.wight<b.wight?-1:1
      }
   })
}
sortArr(arr)
console.log(arr)

let name='0';
let p1 = {
   name: '1',
   sayName: function() {
      console.log('aaa',this)
      console.log(this.name)
   }
}
let p2 = {
   name: '2',
   sayName: () => {
      console.log(this)
      console.log(this.name)
   }
}
let p3 = {
   name: '3',
   sayName: (function() {
      return function() {
         console.log(this.name)
      }
   })()
}
let p4 = {
   name: '4',
   sayName: (function() {
      return () => {
         console.log(this.name)
      }
   })()
}
p1.sayName()
p1.sayName.bind(p2)()
p2.sayName()
p2.sayName.bind(p1)()
p3.sayName()
p3.sayName.bind(p1)()
p4.sayName()
p4.sayName.bind(p1)()

function Person(name) {
   this.name = name;
   return ""
}
console.log(name)
let pp1 = new Person('1')
console.log(pp1.name)
console.log(name)
let Person2 = Person.bind({})
let pp2 = new Person2(2)
console.log(pp2.name)
console.log(name)

var i = 0;
Object.defineProperty(window,'a',{
   get(){ return ++this.i }
})
if(a == 1 && a ==2 && a==3) {
   console.log('wwww')
}

var x=1;
function func(x,y=function anonymous() {x=2}) {
   var x=3;
   y();
   console.log(x);
}
func(5)
console.log(x)

var x=5,y=6;
function func() {
   x+=y;
   func = function(y) {
      console.log(y+(--x))
   }
   console.log(x,y)
}
func(4);
func(3);
console.log(x,y)

function func1() {
   console.log('func1 start'); //=>3,8
   return new Promise(resolve => {
      resolve('ok'); // 异步
   });
}
function func2() {
   console.log('func2 start'); //=>4
   return new Promise(resolve => {
      setTimeout(() => {
         resolve('ok')
      }, 10);
   })
}
console.log(1); //=>1
setTimeout(async () => {
   console.log(2); //=>7
   await func1();
   console.log(3); //=>9
}, 20);
for(let i=0;i<90000000;i++) {} // 同步
console.log(4); //=>2
func1().then(result => {
   console.log(5); //=>6
});
func2().then(result => {
   console.log(6); //=>10
})
setTimeout(() => {
   console.log(7); //=>11
}, 0);
console.log(8); //=>5
// -------------
// 执行队列
// 微任务：1.func1 promise
// 宏任务：1.settimeout 
//    微任务：1.func1 promise
//        2.func2 settimeout
//           1.func2 resolve
//        3.settimeout
// 宏任务里谁的时间少就先执行谁
// 1,4,func1 start,func2 start,8,5,7,6,2,func1 start,3 => it is right
// 1,4,func1 start,func2 start,8,5,2,func1 start,3,6,7

{
   function foo() {}
   foo=1;
}
console.log(foo); //1
{
   function foo() {}
   foo=1;
   function foo() {}
}
console.log(foo);
{
   function foo() {}
   foo =1;
   function foo() {}
   foo=2;
}
console.log(foo);