const promise = new Promise((resolve,reject) => {
    let status = false;
    if(status) {
        resolve('成功');
    } else {
        reject('失败');
    }
}).then(res => {
    console.log('resolved')
}, err => {
    console.log(err);
    throw new Error('excption'); // this line is invalid
}).catch(err => {
    console.log('error')
}).finally(() => {
    console.log('finally')
})
// Promise实例具有then(),是定义在原型对象Promise.prototype上的。then()返回的是一个新的Promise实例，所以可以采用链式写法
// new Promise().then().then()
// then()有两个参数，一个是成功的回调，一个是失败的回调。但是最好失败的回调用catch()，因为catch会捕获then()里的错误，有错误程序也不会中止
// promise实例当状态改变为rejected或者操作失败抛出异常，就会被catch()捕获。
// 所以在实例中reject()等同于抛出错误。如果promise状态已经变为rejected，再抛出异常无效。

const pro1 = new Promise((resolve,reject) => {
    // resolve()
    setTimeout(() => {
        resolve();
    }, 1000);
})
const pro2 = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve();
    }, 2000);
})
const pro3 = new Promise((resolve,reject) => {
    // resolve()
    setTimeout(() => {
        reject();
    }, 2000);
})
const proAll = Promise.all([pro1,pro2,pro3]).then(res => {
    console.log('all fulfilled')
}, err => {
    console.log('rejected')
});

const proRace = Promise.race([pro1,pro2,pro3]).then(res => {
    console.log('changed status to fulfilled first')
}, err => {
    console.log('changed status to rejected first')
})

// Iterator遍历器
let arr = [1,2,3]
let iter = arr[Symbol.iterator]()
console.log(iter.next()) // {value: 1, done: false}
console.log(iter.next()) // {value: 2, done: false}
console.log(iter.next()) // {value: 3, done: false}
console.log(iter.next()) // {value: undefined, done: true}

// Generator函数
function* helloworld() {
    let a = yield 'hello';
    let b = a+'change12'
    console.log(b) // hello changechange12
    yield 'world';
    return 'ending'
}
let hw = helloworld(); // 不会调用
console.log(hw.next()) // {value: 'hello', done: false}
console.log(hw.next('hello change')) // {value: 'world', done: false}
console.log(hw.next()) // {value: 'ending', done: false}
console.log(hw.next()) // {value: undefined, done: false}

// async  await
async function a() {
    console.log('async start')
    await b()
    console.log('async end')
}
function b() {
    const ret = new Promise((resolve,reject) => {
        console.log('promise')
        // setTimeout(() => {
            resolve('ret ret')
        // },2000)
    }).then(res => {
        console.log(res)
    })
}
console.log('11111111')
a()
console.log('2222222222')