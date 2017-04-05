const obj = {
    foo: 123,
    bar() {
        const f = () => console.log(this.foo); // 123

        f();

        const o = {
            foo: 234,
            p: () => console.log(this.foo) };

        o.p();
    }
};

obj.bar();
