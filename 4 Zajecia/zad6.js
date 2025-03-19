const arr = ["ala", "kot", "pies", "masa", "baca", "abc"];
call = el => el.length;
function minElms(arr, call){
    const min = Math.min(...arr.map(call));
    return arr.filter(el => call(el) === min);    
}
console.log(minElms(arr, call));