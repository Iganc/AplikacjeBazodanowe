let n = 8;
let primes = [];
let evens = [];

for(let i = 1; i <= n; i++){
    let isNotPrime = Math.sqrt(i)%1 === 0;
    if(!isNotPrime){
        primes.push(i);
    }
}
for(let i = 1; i <= n; i++){
    let isEven = i % 2 === 0;
    if(isEven){
        evens.push(i);
    }
}
let final_nums = [];
for(let i = 0; i < evens.length; i++){
    let target = evens[i];
    for(let j = 0; j < primes.length; j++){
        for(let k = 0; k < primes.length; k++){
            if(primes[j]+primes[k] === target){
                final_nums.push(primes[j]);
                final_nums.push(primes[k]);
            }
        }
    }
}
let output = "";
for(let i = 1; i < final_nums.length; i += 2){
    output += final_nums[i - 1];
    output += "+";
    output += final_nums[i];
    output += "=";
    output += (final_nums[i - 1] + final_nums[i]);
    output += "\n";
}
console.log(output);