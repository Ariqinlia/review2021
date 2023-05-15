async function async1() {
    console.log('async1 start')
    await async2();
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}
console.log('script start')
setTimeout(() => {
    console.log('setTimeout')
}, 0);
async1()
new Promise(resolve => {
    console.log('promise1')
    resolve()
}).then(() => {
    console.log('promise2')
})
console.log('script end')




const treeData = {
    root: ['xxx','yyy','aaa'],
    xxx: ['xx1','xx2','xx3'],
    yyy: ['yy1','yy2','yy3'],
    aaa: ['a1','a2','a3'],
    a1: ['aa1','aa2'],
}
print(treeData)
// 结果如下
root
  xxx
    xx1
    xx2
    xx3
  yyy
    yy1
    yy2
    yy3
  aaa
    a1
      aa1
      aa2
    a2
    a3
