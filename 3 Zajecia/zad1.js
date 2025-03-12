function promiseMul(arr) {
    return Promise.all(arr).then(values => {
        let result = 1;
            for(let i = 0; i < arr.length; i++){
                result *= values[i];
            }
            return result;
        });
}


const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(1);
const promise3 = Promise.resolve(1);
const promise4 = Promise.resolve(5);
const promise5 = Promise.resolve(5);

const arr = [promise1, promise2, promise3, promise4, promise5];

promiseMul(arr).then(result => {
    console.log(result); 
});