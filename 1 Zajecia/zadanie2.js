let n = "9";
let sum = 0;
for(let i = 0; i<n.length; i++){
    sum += Math.pow(n[i], n.length);
}
if(sum === parseInt(n)){
    console.log("Correct");
}
else{
    console.log("Incorrect");
}
