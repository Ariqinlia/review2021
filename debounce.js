// 防抖：事件触发后n秒内只会执行一次，只执行最后一次事件触发
// 思想：每次执行事件前都先取消之前的延迟方法
var testDebounce = document.getElementById('testDebounce');
function debounce(handle,delay) {
    let timeid = null;
    console.log(this)
    const func = function() {
        // const that = this;
        console.log(this)
        // console.log(that)
        if(timeid) {
            clearInterval(timeid);
        }
        timeid = setInterval(() => {
            handle.apply(this,arguments);
        },delay);
    }
    return func;
}
function handle(e) {
    console.log('防抖~~')
    console.log(this)
    this.style.color='red';
}

var btn = document.getElementById('btn');
testDebounce.addEventListener('input',debounce(handle, 5000))
// testDebounce.addEventListener('input',handle)
// window.addEventListener('scroll',debounce(handle, 3000))

// 防抖可以作用于：验证码，提交表单，输入框内容校验，窗口大小resize