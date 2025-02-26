let word1 = "kotek";
let word2 = "stonoga";
let output = "";
let lower_length = 0;
let higher_lenght = 0;
let chosen_word = word1;

if(word1.length < word2.length){
    lower_length = word1.length;
    higher_lenght = word2.length;
    chosen_word = word2;
}
else if(word1.length > word2.length){
    lower_length = word2.length;
    higher_lenght = word1.length;
    chosen_word = word1;
}
else{
    lower_length = word1.length;
    higher_lenght = word1.length;
    chosen_word = word1;
}

for(let i = 0; i < lower_length; i++){
    output += word1[i];
    output += word2[i];
}
for(let j = lower_length; j < higher_lenght; j++){
    output += chosen_word[j];
}

console.log(output);