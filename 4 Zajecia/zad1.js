const arr = [4, -2, 1, 6, 5];
function isEven(num){
    return num % 2 === 0;
}

function sumEven(arr){
    let sum = arr.filter(isEven).reduce((acc, num) => acc + num, 0);
    return sum;
}
console.log(sumEven(arr));
