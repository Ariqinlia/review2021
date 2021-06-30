// js的继承方式
// 1.原型链继承
function Parent(name) {
    this.name = name || 'parent';
    this.age = 34;
    this.list = [2]
}
Parent.prototype.sayHi = function() {
    console.log('HI')
}
function Child(sex) {
    this.sex = sex || '女';
}
Child.prototype = new Parent(); // 此时Child.prototype.constructor = Parent
Child.prototype.constructor = Child; // 用这句指向正确的构造函数
// 实例子类的时候无法向父类构造函数传参
const cld1 = new Child();
const cld2 = new Child('男');
// 因为实例的构造函数的原型Child.prototype指向同一个Parent实例，在堆中共用同一块空间，子类实例修改共用引用类型的值就会修改原型链上的值，导致所有继承的子类都会被修改
cld1.list.push('cld1')
console.log('cld1',cld1); // cld2.list = [2,'cld1']
console.log('cld2',cld2); // cld2.list = [2,'cld1']

// 2.构造函数继承
function Parent2(name,age) {
    this.name = name;
    this.age = age;
    this.sayHi = function() {
        console.log('hi')
    }
}
Parent2.prototype.sayName = function() {
    console.log(this.name);
}
function Child2(name,age,sex) {
    Parent2.apply(this, arguments);
    this.sex = sex || '女';
}
const cd2 = new Child2('rose',19);
// console.log(cd2.name) // rose
// console.log(cd2.sayName()) // Error,不能继承父类原型的属性和方法
console.log('cd2',cd2)

// 3.组合继承
function Parent3(name,age) {
    this.name = name;
    this.age = age;
    this.list = [2];
    this.sayHi = function() {
        console.log('hi')
    }
}
Parent3.prototype.sayName = function() {
    console.log(this.name);
}
function Child3(name,age,sex) {
    Parent3.apply(this, arguments);
    this.sex = sex || '女';
}
Child3.prototype = new Parent3();
Child3.prototype.constructor = Child3;
const cd3 = new Child3('rose',19);
cd3.list.push('cd3')
const cd33 = new Child3('jack',20);
console.log('cd3',cd3)
console.log('cd33',cd33)

// 4.原型式继承
function copy(obj) {
    function F() {}
    F.prototype = obj;
    return new F();
}
const obj = {
    name: 'susan',
    list: [2]
}
const cd4 = copy(obj);
const cd44 = copy(obj);
cd4.list.push('cd4')
console.log('cd4',cd4)
console.log('cd44',cd44)
// cd4.__proto__ === cd44.__proto__ is true
// means own the same prototype,缺点也是引用类型修改会影响共用该原型链的所有实例

// 5.寄生式继承
function createObj(obj) {
    const oo = copy(obj);
    oo.sayName = function() {
        console.log(this.name)
    }
    return oo;
}
const cd5 = createObj(obj);
cd5.list.push('cd5')
const cd55 = createObj(obj);
console.log('cd5',cd5)
console.log('cd55',cd55)

// 6.寄生组合式继承
// 在组合继承的基础上减少一次多余的父类构造函数调用,最优方式
function inheritPrototype(subClass,superClass) {
    const p = Object.create(superClass.prototype);
    // const p = copy(superClass.prototype);
    p.constructor = subClass;
    subClass.prototype = p;
}
function Parent6(name,age) {
    this.name = name;
    this.age = age;
    this.list = [2];
    this.sayHi = function() {
        console.log('hi')
    }
}
Parent6.prototype.sayName = function() {
    console.log(this.name);
}
function Child6(name,age,sex) {
    Parent3.apply(this, arguments);
    this.sex = sex || '女';
}
inheritPrototype(Child6,Parent6);
Child6.prototype.show = function() {
    console.log('shssss')
}
const cd6 = new Child6('XIN',24);
cd6.show()
cd6.list.push('cd6');
const cd66 = new Child6('XIN2',25);
console.log('cd6',cd6);
console.log('cd66',cd66);

// 7.ES6 extends继承
class Parent7 {
    constructor(name,age) {
        this.name = name;
        this.age = age;
        this.list = [2];
    }
    sayName() {
        console.log(this.name);
    }
}
class Child7 extends Parent7 {
    constructor(name,age,sex='女') {
        // 子类必须在constructor中调用super，否则新建实例会报错，因为子类没有自己的this，而是继承父类的this
        super(name,age); // 子类构造函数中调用super()，表示父类构造函数，用来新建父类的this对象
        this.sex = sex;
    }
}
const cd7 = new Child7('CC',26);
cd7.list.push('cd7');
const cd77 = new Child7('CC2',26,'男');
console.log('cd7',cd7);
console.log('cd77',cd77);