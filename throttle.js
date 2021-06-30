// 节流: 事件触发的n秒只执行一次，触发立即执行
function throttle(handle,delay) {
    let flag = null;
    return function() {
        const that = this;
        if(flag) {
            return;
        }
        flag = setTimeout(()=>{
            handle.apply(that,arguments);
            flag = null;
        },delay);
    }
}
function handle() {
    console.log('节流~~')
    console.log(this)
}
var btn = document.getElementById('btn');
// testDebounce.addEventListener('focus',throttle(handle, 5000))
window.addEventListener('scroll',throttle(handle, 3000))

// 节流可用于：监听单位时间内滚动事件，输入框校验


function fangdou() {
    // 在n秒内只执行一次，执行最后一次触发
    let flag = null;
    return function() {
        if(flag) {
            clearTimeout(flag);
        }
        flag = setTimeout(() => {
            handle2.apply(this,arguments)
        }, 2000);
    }
}
function handle2() {
    console.log('fangdou')
    console.log(this)
    this.style.color='red';
}
var testDebounce = document.getElementById('testDebounce');
testDebounce.addEventListener('input',fangdou())
// window.addEventListener('scroll',fangdou())