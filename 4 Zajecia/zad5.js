const arr = [1, 2, 3, 1, 4, 2, 5, 3, 6];
pred = el => el > 3
function numSat(arr, pred){
    return arr.filter(pred).length;
}
console.log(numSat(arr, pred));