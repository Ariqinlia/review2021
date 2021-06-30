// 使用递归实现深拷贝
function deepCopy(obj) {
    const result = Array.isArray(obj)?[]:{};
    if(obj && typeof obj === 'object') {
        for(let key in obj) {
            if(typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key])
            } else {
                result[key] = obj[key]
            }
        }
    }
    return result;
}

// JSON.stringify()和JSON.parse()实现深拷贝,有一个缺点，该方法会自动忽略undefined、任意的函数、Symbol值，JSON不支持这些数据类型
const obj = {name: 'rose', play: {game: 'bob', music: 'save and sound', blank: null}, date: new Date(), function() {console.log(111)}, key: Symbol('test')}
const newObj = JSON.parse(JSON.stringify(obj))
newObj.play.game = 'lol'
// console.log(obj,newObj)
// {name: 'rose', play: {game: 'bob', music: 'save and sound'}}
// {name: 'rose', play: {game: 'lol', music: 'save and sound'}}

/*
 * JSON.parse(JSON.stringify(obj))有缺陷
 * 1.对于bigint会直接报错
 * 2.symbol,function,undefined,会直接返回空对象
 * 3.正则和date,不能正确的显示
 *
 */
function _deepCopy(obj) {
    // 对数据类型进行判断
    if(obj===null) return null;
    if(typeof obj !== 'object') return obj
    if(obj instanceof RegExp) return obj;
    if(obj instanceof Date) return obj;
    // 数组和对象再次深拷贝
    let result = new obj.constructor();
    Object.keys(obj).forEach(key => {
        result[key] = _deepCopy(obj[key]);
    })
    return result;
}

function copy(obj) {
    if(!obj) return null;
    if(obj instanceof Date) return obj;
    if(obj instanceof RegExp) return obj;
    const res = obj instanceof Array?[]:{}
    for (const [k,v] of Object.entries(obj)) {
        res[k] = typeof v === 'object'?copy(v):v
    }
    return res
}
const nn = copy(obj)
nn.play.game = 'lol'
console.log(obj)
console.log(nn)