const promise = new Promise((resolve, reject) => {
    let status = false;
    if (status) {
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

const pro1 = new Promise((resolve, reject) => {
    // resolve()
    setTimeout(() => {
        resolve();
    }, 1000);
})
const pro2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, 2000);
})
const pro3 = new Promise((resolve, reject) => {
    // resolve()
    setTimeout(() => {
        reject();
    }, 2000);
})
const proAll = Promise.all([pro1, pro2, pro3]).then(res => {
    console.log('all fulfilled')
}, err => {
    console.log('rejected')
});

const proRace = Promise.race([pro1, pro2, pro3]).then(res => {
    console.log('changed status to fulfilled first')
}, err => {
    console.log('changed status to rejected first')
})

// Iterator遍历器
let arr = [1, 2, 3]
let iter = arr[Symbol.iterator]()
console.log(iter.next()) // {value: 1, done: false}
console.log(iter.next()) // {value: 2, done: false}
console.log(iter.next()) // {value: 3, done: false}
console.log(iter.next()) // {value: undefined, done: true}

// Generator函数
function* helloworld() {
    let a = yield 'hello';
    let b = a + 'change12'
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
    const ret = new Promise((resolve, reject) => {
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


// 简单实现promise，但是还不能链式调用
// class MyPromise {
//     static PENDING = 'pending';
//     static FULFILLED = 'fulfilled';
//     static REJECTED = 'rejected';
//     constructor(executor) {
//         this.status = MyPromise.PENDING;
//         this.value = undefined;
//         this.reason = undefined;
//         this.resolvedCallbacks = [];
//         this.rejectedCallbacks = [];
//         executor(this._resolve.bind(this), this._reject.bind(this));
//     }
//     _resolve(value) {
//         if (this.status === MyPromise.PENDING) {
//             this.status = MyPromise.FULFILLED;
//             this.value = value;
//             this.resolvedCallbacks.forEach(fn => fn());
//         }
//     }
//     _reject(value) {
//         if (this.status === MyPromise.PENDING) {
//             this.status = MyPromise.REJECTED;
//             this.reason = value;
//             this.rejectedCallbacks.forEach(fn => fn());
//         }
//     }
//     then(onFulFilled, onRejected) {
//         if (this.status === MyPromise.PENDING) {
//             this.rejectedCallbacks.push(() => {
//                 onRejected(this.reason);
//             });
//             this.resolvedCallbacks.push(() => {
//                 onFulFilled(this.value);
//             });
//         } else if (this.status === MyPromise.REJECTED) {
//             onRejected(this.reason);
//         } else {
//             onFulFilled(this.value);
//         }
//     }
// }

class MyPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(executor) {
        this.status = MyPromise.PENDING;
        this.value = undefined;
        this.callbacks = [];
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }
    resolve(value) {
        if (this.status === MyPromise.PENDING) {
            this.status = MyPromise.FULFILLED;
            this.value = value;
            // 解决没有异步的问题
            setTimeout(() => {
                this.callbacks.map(callback => callback.onFulFilled(value))
            }, 1000);
        }
    }
    reject(reason) {
        if (this.status === MyPromise.PENDING) {
            this.status = MyPromise.REJECTED;
            this.value = reason;
            setTimeout(() => {
                this.callbacks.map(callback => callback.onRejected(reason))
            }, 1000);
        }
    }
    then(onFulFilled, onRejected) {
        console.log(this)
        if (typeof onFulFilled !== 'function') {
            // then的穿透，当then没参数的时候，直接将value返回
            // onFulFilled = value => value;
            onFulFilled = () => this.value;
        }
        if (typeof onRejected !== 'function') {
            onRejected = value => value;
        }
        return new MyPromise((resolve, reject) => {
            if (this.status === MyPromise.PENDING) {
                this.callbacks.push({
                    onFulFilled: value => {
                        try {
                            const result = onFulFilled(value)
                            if (result instanceof MyPromise) {
                                result.then(data => {
                                    resolve(data)
                                },reason => {
                                    reject(reason)
                                })
                            } else {
                                resolve(result)
                            }
                        } catch (error) {
                            reject(error)
                        }
                    },
                    onRejected: reason => {
                        try {
                            const result = onRejected(reason)
                            if (result instanceof MyPromise) {
                                result.then(data => {
                                    resolve(data)
                                },
                                reason => {
                                    reject(reason)
                                })
                            } else {
                                resolve(result)
                            }
                        } catch (error) {
                            reject(error)
                        }
                    }
                })
            }
            if (this.status === MyPromise.FULFILLED) {
                console.log('eeeee')
                setTimeout(() => {
                    try {
                        const result = onFulFilled(this.value)
                        resolve(result)
                    } catch (error) {
                        reject(error)
                    }
                }, 1000);
            }
            if (this.status === MyPromise.REJECTED) {
                console.log('this.value', this.value)
                setTimeout(() => {
                    try {
                        const result = onRejected(this.value)
                        resolve(result)
                    } catch (error) {
                        reject(error)
                    }
                }, 1000);
            }
        })
    }
}
const xx = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        // console.log('inner promise')
        // resolve('fdas');
        reject('拒绝');
        console.log('inner22 promise')
    }, 1000);
})
    .then(
        data => {
            console.log(data)
            return new MyPromise((resolve, reject) => {
                resolve('new promise')
            })
            // return 'success'
        },
        reason => {
            console.log('error:', reason)
            // return new MyPromise((resolve, reject) => {
            //     reject('dsa')
            // })
            return 'faild'
        })
    .then(data => console.log('success ' + data), reason => console.log('error122:', reason));

// const aa = new Promise((resolve,reject) => {
//     reject('wwww')
// })
// .then(data => {
//     // console.log(data)
//     return new Promise((resolve,reject) => {
//         resolve('6.8')
//     })
// },
// reason => {
//     return new Promise((resolve,reject) => {
//         reject('ffff')
//     })
// })
// .then(data => {
//     console.log(data)
// },
// reason => {
//     console.log('fail:',reason)
// })


function permute(nums) {
    let matrix = [];
    const subfunc = (arr, temp) => {
      if (arr.length === 0) {
        matrix.push(temp)
      }
      for (let i = 0; i < arr.length; i++) {
        let newarr = arr.slice(0, i).concat(arr.slice(i + 1))
        subfunc(newarr, temp.concat(arr[i]))
      }
    }
    subfunc(nums, [])
    return matrix;
}
const aa = permute([1,2,3])
console.log('aa',aa)