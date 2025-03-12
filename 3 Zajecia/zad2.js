/* 
Zadanie 2. Zdefiniuj funkcję:
async function isPrimes(arr)
która zwróci, informację, czy wszystkie obiekty typu Promise z tablicy arr, 
są liczbami pierwszymi. Sprawdzenie tego czy liczby są pierwsza, 
powinno odbyć się asynchronicznie.
*/
function isPrime(num) {
    if (num <= 1) return false;
    if (num === 2) return true; 
    if (num % 2 === 0) return false;

    for (let i = 2; i < Math.sqrt(num) + 1; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}
async function isPrimes(arr) {
    try{
        const values = await Promise.all(arr);
        for (let num of values) {
            if (!isPrime(num)) {
                return false;
            }
        }
        return true;
    }
    catch(error){
        return false;
    }
}



const promise1 = Promise.resolve(2);
const promise2 = Promise.resolve(3);
const promise3 = Promise.resolve(5);
const promise4 = Promise.resolve(7);
const promise5 = Promise.resolve(11);

const arr = [promise1, promise2, promise3, promise4, promise5];
isPrimes(arr).then(result => { console.log(result); })