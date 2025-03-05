class Arr{
    constructor(){
        this.arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    head(){
        return this.arr[0];
    }
    tail(){
        return this.arr.slice(1);
    }

    
}
const NewArr = new Arr();
console.log(NewArr.head());
console.log(NewArr.tail());