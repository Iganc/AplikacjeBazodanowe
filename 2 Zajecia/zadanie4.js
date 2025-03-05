class Calculator {
    constructor(){
        this.history = [];
    }
    
    add_history(num1, num2, op, res) {
        this.history.push({ num1, num2, op, res });
    }
    
    add(num1, num2) {
        const result = num1 + num2;
        this.add_history(num1, num2, '+', result);
        return result;
    }
    
    sub(num1, num2) {
        const result = num1 - num2;
        this.add_history(num1, num2, '-', result);
        return result;
    }
    
    mul(num1, num2) {
        const result = num1 * num2;
        this.add_history(num1, num2, '*', result);
        return result;
    }
    
    div(num1, num2) {
        const result = num1 / num2;
        this.add_history(num1, num2, '/', result);
        return result;
    }
    
    mod(num1, num2) {
        const result = num1 % num2;
        this.add_history(num1, num2, '%', result);
        return result;
    }
    getLastOp() {
        if (this.history.length === 0) {
            return null; 
        }
        return this.history[this.history.length - 1];
    }
}

const calc = new Calculator();

console.log(calc.add(2, 3));
console.log(calc.sub(10, 5)); 
console.log(calc.mul(4, 3)); 
console.log(calc.div(10, 2)); 
