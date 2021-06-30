function Hero(msg) {
    const obj = {};
    obj.msg = msg
    obj.time = 0;
    console.log('msg', obj.msg)
    obj.kill = function (number) {
        if (number === 1) {
            obj.msg += ' Kill 1 bug'
            // console.log('msg',obj.msg)
        } else {
            setTimeout(() => {
                obj.msg += ` Kill ${number} bugs`
                console.log('msg', obj.msg)
            }, 1000 * obj.time);
        }
        return obj;
    }
    obj.recover = function (num) {
        obj.msg += ` Recover ${num} bloods`
        console.log('msg', obj.msg)
    }
    obj.sleep = function (num) {
        obj.time = num
        return obj;
    }
    return obj;
}
Hero('37er')
Hero('37er').kill(1).recover(30)
Hero('37er').sleep(10).kill(2)

function test() {
    // for(let i=1;i<=5;i++) {
    //     setTimeout(() => {
    //         console.log(i)
    //     }, 1000*i);
    // }
    for (var i = 1; i <= 5; i++) {
        (function (i) {
            setTimeout(() => {
                console.log(i)
            }, i * 1000);
        })(i)
    }
}
test();

function convert(name) {
    // 将_转换为驼峰命名
    const arr = name.split('_')
    if(arr.length>0) {
        if(!arr[0]) {
            arr.splice(0,1)
        }
        if(!arr[arr.length-1]) {
            arr.splice(arr.length-1,1)
        }
    }
    const newName = arr.map((item,index) => {
        const first = typeof item.charAt(0) === 'string'?item.charAt(0):item
        const rest = typeof first === 'string'?item.slice(1).toLowerCase():''
        const tt = index===0?item:first.toUpperCase()+rest
        return tt
    })
    console.log('old --> new', name, newName.join(''))
}
convert('_test_main_')

for(let i=0;i<5;i++) {
    for(let j=0;j<i;j++) {
        document.write('*')
    }
    document.write('<br/>')
}

const temp = [
    {title: 'zzz', name: 'licy'},
    {title: 'bbb', name: 'ancodzzz'},
    {title: 'xxxzzz', name: 'ols'}
]
function templete() {
    return `
    <ul>
    ${
        temp.map(item => links`
        <li>标题是${item.title}，姓名是${item.name}</li>
        `).join('')
    }
    </ul>
    `
}
// 把所有的zzz都加上链接
// str总是会比key多
function links(str, ...args) {
    return str.map((item,key) => {
        return item + (args[key]?args[key].replace('zzz',`<a href='http://www.baidu.com'>zzz</a>`):'')
    }).join('')
}
document.body.innerHTML = templete();

// 电话号码模糊处理
function phone(mobile,len=3) {
    return mobile.toString().slice(0,len*-1)+'*'.repeat(len)
}
document.body.innerHTML += phone(13423890921,6)
document.write('<br/>')

const lessons = ['js','css','html']
const des = '学习js和css以及html'
function toLinks() {
    return lessons.reduce((pre,cur) => pre.replace(cur, `<a href='?${cur}'>${cur}</a>`),des)
}
document.body.innerHTML += toLinks()
document.write('<br/>')

// 实现杨辉三角
function yHui(row=5) {
    for(let i=1;i<row;i++) {
        for(let n=row-i;n>0;n--) {
            document.write('*')
        }
        for(let m=2*i-1;m>0;m--) {
            document.write('^')
        }
        document.write('<br/>')
    }
}
yHui(10)

// 随机生成
// [min,max] 随机生成min~max(包含)之间的整数
// min+Math.floor(Math.random()*(max-min+1))
function random(arr,start=1,end=arr.length) {
    start--
    const index = start + Math.floor(Math.random()*(end-start))
    return arr[index]
}
console.log(random([-3,-2,-1,0,1,2,3]))

// 时间格式
function formatDate(date,format='YYYY-MM-DD hh:mm:ss') {
    const config = {
        'YYYY': date.getFullYear(),
        'MM': date.getMonth()<9?`0${date.getMonth()+1}`:date.getMonth()+1,
        'DD': date.getDay()<10?`0${date.getDay()}`:date.getDay(),
        'hh': date.getHours()<10?`0${date.getHours()}`:date.getHours(),
        'mm': date.getMinutes()<10?`0${date.getMinutes()}`:date.getMinutes(),
        'ss': date.getSeconds()<10?`0${date.getSeconds()}`:date.getSeconds()
    }
    for (const key in config) {
        format = format.replace(key,config[key])
    }
    return format;
}
const date = new Date()
console.log(formatDate(date,'YYYY年MM月DD日 hh时mm分ss秒'))

// reduce
function sum(arr) {
    return arr.reduce((pre,cur) => {
        pre += +cur.price
        return pre
    },0)
}
const arrList = [
    {name: 'iphone', price:'6000'},
    {name: 'xiaomi', price:'2300'},
    {name: 'huawei', price:'6800'},
    {name: 'xiaomi', price:'4300'}
];
console.log(sum(arrList))

// 去重
function deleteByName(arr) {
    return arr.reduce((pre,cur) => {
        const flag = pre.find(v => v.name === cur.name)
        if(!flag) {
            pre.push(cur)
        }
        return pre
    },[])
}
console.table(deleteByName(arrList))

function getNameByPrice(arr,price) {
    return arr.reduce((pre,cur) => {
        if(cur.price>price) {
            pre.push(cur)
        }
        return pre
    },[])
}
console.table(getNameByPrice(arrList,5000))

// 获取最大值
function getMaxPrice(arr) {
    return arr.reduce((total,cur) => {
        return total.price>cur.price?total:cur
    })
}
console.table(getMaxPrice(arrList))
