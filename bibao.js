function add(a){
    function s(b){
       a = a + b;
       return s;
    }
    s.toString = function(){return a;}
    return s;
   }
console.log(add(1)(2)(3))