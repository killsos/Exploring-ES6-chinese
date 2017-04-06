const obj = {
    foo: 123,
    toJSON() {
        return { name: "qinlei" };
    },
};
console.log(JSON.stringify(obj)); 
