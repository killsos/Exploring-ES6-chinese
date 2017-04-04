function parent(){
  function son(){

  }
}

console.log(window);

console.log(window.parent); // 最外面是全局对象的一个属性

console.log(window.son);    // 函数里面函数不是
