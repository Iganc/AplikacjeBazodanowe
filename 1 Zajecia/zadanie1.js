let i;
let j;
let output = "";

for(i = 0; i <= 5; i++){
    for(j = 0; j < i; j++){
        output += "*";
    }
    output += "\n";
}
console.log(output);

output = "";
for(i = 5; i >= 1; i--){
    for(j = 0; j < i; j++){
        output += "*";
    }
    output += "\n";
}
console.log(output);

output = "";
for(i = 0; i <= 5; i++){
    for(let s = 1; s <= (5 - i); s++){
            output += " ";

    }
    for(j = 0; j < i; j++){
        // output += " ";
        output += "*";
    }
    output += "\n";
}
console.log(output);

output = "";
for(i = 5; i >= 1; i--){
    for(let s = 1; s <= (5 - i); s++){
            output += " ";

    }
    for(j = 0; j < i; j++){
        // output += " ";
        output += "*";
    }
    output += "\n";
}
console.log(output);