let box1 = document.getElementsByClassName('box1')[0];
let box2 = document.getElementsByClassName('box2')[0];
console.log('box1.offsetWidth:', box1.offsetWidth) // 100px
console.log('box2.offsetWidth:', box2.offsetWidth) // 130px
console.log('win1', window.getComputedStyle(box1).width) // 100, ie中90
console.log('win2', window.getComputedStyle(box2).width) // 120
console.log('dom1', box1.getBoundingClientRect().width) // 100
console.log('dom2', box2.getBoundingClientRect().width) // 130