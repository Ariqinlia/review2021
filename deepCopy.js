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
const obj = {name: 'rose', play: {game: 'bob', music: 'save and sound'}}
const newObj = JSON.parse(JSON.stringify(obj))
newObj.play.game = 'lol'
console.log(obj,newObj)
// {name: 'rose', play: {game: 'bob', music: 'save and sound'}}
// {name: 'rose', play: {game: 'lol', music: 'save and sound'}}