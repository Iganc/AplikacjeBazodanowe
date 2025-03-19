const arr = [1, 1, 2, 4, 4, 4, 1, 3];

function noRep(arr){
    const arrNoRep = arr.reduce((acc, current)=>{ if(!acc.includes(current)) {
        return [...acc, current];
    }
    return acc;
    }, []);
    return arrNoRep;
}
console.log(noRep(arr));