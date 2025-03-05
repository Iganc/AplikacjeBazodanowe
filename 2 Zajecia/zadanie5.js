class Validator {

    validatemail(mail){
        let valid = false;
        for(let i = 0; i < mail.length; i++){
            if(mail[i] === "@"){
                valid = true;
            }
        }
        return valid;
    }
    validateNumberRange(num1, num2, num3){
        if(num1 >= num2 && num1 <= num3){
            return true;
        }
        else{
            return false;
        }
    }
    validateStringLength(str, num){
        let sum = 0;
        for(let i = 0; i < str.length; i++){
            sum += 1;
        }
        if(sum === num){
            return true;
        }else
            return false;
        }
}
const validator = new Validator();
console.log(validator.validatemail("lukasz.mielewczyk@ug.edu.pl"));
console.log(validator.validateNumberRange(10, 1, 100));
console.log(validator.validateStringLength("Hello", 5));
