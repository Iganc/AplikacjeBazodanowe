/*
Zadanie 3. Zdefiniuj funkcję:
async function rightNumber(arr)
która zwróci, dowolną liczbę z tablicy arr, której cyfry 
tworzą ciąg niemalejący oraz ich suma jest nieparzysta. 
Jeżeli taka liczba nie istnieje, powinien zostać zwrócony błąd AggregateError. 
Sprawdzenie liczb, powinno odbyć się asynchronicznie.

*/


function checkNumber(num){
    let previousDigit = -1;
    let sum = 0;

    while(num > 0){
        let digit = num % 10;
        sum += digit;

        if(digit < previousDigit){
            return false;
        }
        previousDigit = digit;
        num = Math.floor(num / 10);
    }

    return sum % 2 !== 0;
}
async function rightNumber(arr){
    for(let promise of arr){
        const num = await promise;
        if(await checkNumber(num)){
            return num;
        }
    }
    throw new AggregateError([new Error("some error")], "Hello");
}  

const promise1 = Promise.resolve(2);
const promise2 = Promise.resolve(3);
const promise3 = Promise.resolve(5);
const promise4 = Promise.resolve(7);
const promise5 = Promise.resolve(11);

const arr = [promise1, promise2, promise3, promise4, promise5];

rightNumber(arr)
    .then(result => console.log('Znaleziono odpowiednią liczbę:', result))
    .catch(error => console.log('Błąd:', error));