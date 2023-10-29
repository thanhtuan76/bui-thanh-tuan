// Problem 1

// Task
// Provide 3 unique implementations of the following function in JavaScript.
// Input: n - any integer
// Assuming this input will always produce a result lesser than Number.MAX_SAFE_INTEGER.
// Output: return - summation to n, i.e. sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15.
// var sum_to_n_a = function(n) {
//     // your code here
// };

// var sum_to_n_b = function(n) {
//     // your code here
// };

// var sum_to_n_c = function(n) {
//     // your code here
// };

var sum_to_n_a = function(n) {
    let s = 0;
    for (let i = 0; i <= n; i++) {
        s += i;
    }
    return s;
};

var sum_to_n_b = function(n) {
    if (n === 0)
        return 0;
    return n + sum_to_n_b(n - 1);
};

var sum_to_n_c = function(n) {
    const arr = Array.from({length: n}, (_, i) => i + 1);
    return arr.reduce((a, b) => a+b);
}