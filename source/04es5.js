var parent = "456";

function init() {

  foo();

  function foo() {
    console.log(parent);
  }

  let parent = "123";
}

init();
