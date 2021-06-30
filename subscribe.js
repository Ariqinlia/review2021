// 发布-订阅者模式：由事件调度中心来连接发布者和订阅者，监听发布以及分发给订阅者
class PubSub {
    constructor() {
        this.subscribes = [];
    }
    subscribe(name,callback) {
        const callbacks = this.subscribes[name];
        if(!callbacks) {
            this.subscribes[name] = [callback]
        } else {
            callbacks.push(callback);
        }
    }
    publish(name,...msgs) {
        const callbacks = this.subscribes[name] || [];
        callbacks.forEach(callback => callback(...msgs));
    }
}
function handle(msg) {
    console.log(msg)
}
// 创建事件调度中心，为发布者、订阅者提供调度服务
const pp = new PubSub();
// A订阅了sms事件，A只关注sms事件本身，不关心谁发布这个事件
pp.subscribe('sms',handle);
// B订阅了sms事件
pp.subscribe('sms',handle);
// C订阅了click事件
pp.subscribe('click',handle);
// D发布了sms事件，D只关注sms事件本身，不关心谁订阅了这个事件
pp.publish('sms','publish12');
pp.publish('click','publish12 click');

// 观察者模式：没有中间组件，所有的通信都是观察者与被观察者自己发出的，观察者将自己交给目标管理，目标发布事件的时候，自己去通知所有观察者
class Subject {
    constructor() {
        this.observers = [];
    }
    add(observer) {
        this.observers.push(observer)
    }
    notify(...msgs) {
        this.observers.forEach(item => item.update(...msgs))
    }
}

class Observer {
    update(...msg) {
        console.log(...msg)
    }
}
// 创建被观察者(目标)sub
const sub = new Subject();
// 创建观察者ob
const ob = new Observer();
// 创建观察者ob1
const ob1 = new Observer();
// 给目标添加观察者，目标和观察者建立了联系
sub.add(ob);
sub.add(ob1);
// 目标触发了事件，主动通知观察者
sub.notify('update successful')