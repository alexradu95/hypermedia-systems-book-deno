// 1. First, let's create a simple class
class Person {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    sayHi() {
        console.log(`Hi, I'm ${this.name}`);
    }
}

// 2. Create a person
const john = new Person("John");

// 3. Let's try different ways of calling sayHi
console.log("Method 1 - Direct call on object:");
john.sayHi();  // Works! 'this' is john

// 4. Let's store the method in a variable
console.log("\nMethod 2 - Store method in variable and call:");
const justTheSayHiFunction = john.sayHi;
try {
    justTheSayHiFunction();  // Will fail! 'this' is undefined
} catch (error) {
    console.log("Failed because:", error.message);
}

// 5. Let's bind the method to john
console.log("\nMethod 3 - Bind method to john:");
const boundSayHi = john.sayHi.bind(john);
boundSayHi();  // Works! 'this' is john

// 6. Let's see what happens in a callback context
console.log("\nMethod 4 - Using in callback without bind:");
function runLater(callback: () => void) {
    console.log("About to run callback:");
    callback();
}

try {
    runLater(john.sayHi);  // Will fail! 'this' is undefined
} catch (error) {
    console.log("Failed because:", error.message);
}

console.log("\nMethod 5 - Using in callback with bind:");
runLater(john.sayHi.bind(john));  // Works! 'this' is john

// 7. Let's see what happens with arrow functions
console.log("\nMethod 6 - Using arrow function:");
const person2 = {
    name: "Jane",
    sayHi: () => {
        console.log(`Hi, I'm ${person2.name}`);
    }
};

const unboundArrowSayHi = person2.sayHi;
unboundArrowSayHi();  // Works! Arrow functions keep their context
