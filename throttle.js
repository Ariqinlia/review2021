// 节流: 事件触发的n秒只执行一次，触发立即执行
function throttle(handle,delay) {
    let flag = true;
    return ()=>{
        if(!flag) {
            return;
        }
        flag = setInterval(()=>{
            handle.apply(this,arguments);
            flag = false;
        },delay);
    }
}
function handle() {
    console.log('节流~~')
}
var btn = document.getElementById('btn');
// testDebounce.addEventListener('focus',throttle(handle, 5000))
window.addEventListener('scroll',throttle(handle, 3000))

// 节流可用于：监听单位时间内滚动事件，输入框校验
