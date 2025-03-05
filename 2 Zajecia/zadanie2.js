class StringClass{
    constructor(){
        this.str = '<table border="{border}"><tr><td>{first_name}</td><td>{last_name}</td></tr></table>';
    }
    
    swap(obj){
        let result = this.str;
        for(let key in obj){
            let regex = new RegExp(`{${key}}`, 'g');
            result = result.replace(regex, obj[key]);
        }
        return result;
    }

}
const string = new StringClass();
obj = {
    first_name: "Jan", 
    last_name: "Kowalski", 
    birth_date: "1997-04-21"
};

console.log(string.swap(obj));