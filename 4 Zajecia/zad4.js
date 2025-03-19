let arr = ['a', 'b', 'a', 'c', 'c', 'a'];
function numDat(arr){
    const arrNumDat = arr.reduce((acc, repeats)=>{
        if(acc[repeats]){
            acc[repeats]++;
    }   else{
            acc[repeats] = 1;
    }
    return acc;
    }, {});
    return arrNumDat;
}
console.log(numDat(arr));