var foo = "parent";

function bar(){
  var foo = "son";
  console.log(window.foo);
}


console.log(window.foo);

bar();
