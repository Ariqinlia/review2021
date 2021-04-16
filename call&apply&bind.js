function _call(context,...args) {
    // this => fn
    let key = Symbol('key'),
        result;
    context = context == undefined?window:context;
    const type = typeof context;
    if(!/^object|function$/.test(type)) {
       if(/^symbol|bigint$/.test(type)) {
          context = Object(context)
       } else {
           let current = context.constructor;
           context = new current(context)
       }
    }
    context[key] = this;
    result = context[key](...args);
    delete context[key]
    return result;
 }

 function _apply(context, args) {
    let key = Symbol('key'),
        result;
    context = context == undefined?window:context;
    const type = typeof context;
    if(!/^object|function$/.test(type)) {
        if(/^symbol|bigint$/.test(type)) {
            context = Object(context);
        } else {
            context = new context.constructor(context);
        }
    }
    context[key] = this;
    result = context[key](...args);
    delete context[key];
    return result;
 }

 function _bind(context, ...args) {
     const type = typeof context;
     context = context==undefined?window:context;
     if(!/^object|function$/.test(type)) {
         if(/^symbol|bigint$/.test(type)) {
             context = Object(context);
         } else {
             context = new context.constructor(context);
         }
     }
     return (...innerArgs) => {
         this.apply(context,[...args,...innerArgs])
     }
 }
 let obj = {
    xxx: 123
 }
 function fn(a,b) {
    this.a = a+b
    console.log(this)
 }
 Function.prototype._call = _call;
 Function.prototype._apply = _apply;
 Function.prototype._bind = _bind;
 fn._call(obj,12,34)
 fn._apply(null,[12,34])
 fn._bind(obj,12,34)()
//  obj.xxx = fn;
//  obj.xxx()
// 执行fn()，并把this指向obj
// 手写call核心

