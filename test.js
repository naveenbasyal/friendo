
// foo();
// var foo = 12;

// function foo() {
//     console.log(x);
//     var x = 34;
// }

// foo()

// for (var i = 0; i < 3; i++) {
//     setTimeout(() => {
//         console.log(i)
//     }, 100);
// }
// console.log("start")
// setTimeout(() => {
//     console.log("timeout")
// }, 0);
// Promise.reject().then(() => console.log("promise1")).catch(err => console.log("err"))

// console.log("end")

// async function foo() {
//     return "HeartFilledIcon";
// }
// (async () => {

//     const res = await foo()
//     console.log(res)
// })()

// console.log(res)

// const user1 = {
//     name: "naveen",
//     age: 23,
//     address: {
//         city: "mohali",
//         state: "punjab"
//     }
// }

// const user2 = JSON.parse(JSON.stringify(user1));
// user2.name = "parkash"
// user2.address.city = "ropar"
// console.log(user1)
// console.log(user2)

function abc() {
    // console.log("Hello")
    return { msg: "HI" }
}

const res = new abc();
console.log(res)