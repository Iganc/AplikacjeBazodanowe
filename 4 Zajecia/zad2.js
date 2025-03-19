const arr = [4, 9, 12, 16, 20, 25]
function isSqrt(num){
    return Math.sqrt(num) % 1 === 0;
}
function sqrtInt(arr){
    let result = arr.filter(isSqrt).map(Math.sqrt);
    return result;
}
console.log(sqrtInt(arr));