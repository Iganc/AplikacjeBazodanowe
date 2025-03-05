Object.prototype.sum = function(keys) {
    let sum = 0;

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];

        function getValue(obj, key) {
            let keysArray = key.split('.');
            for (let j = 0; j < keysArray.length; j++) {
                if (obj && obj.hasOwnProperty(keysArray[j])) {
                    obj = obj[keysArray[j]];
                } else {
                    return undefined;
                }
            }
            return obj;
        }

        let value = getValue(this, key);

        if (typeof value === 'object' && value !== null) {
            if (value.hasOwnProperty('c')) {
                sum += value['c'];
            }
        } else if (value !== undefined) {
            sum += value;
        }
    }
    
    return sum;
};

const obj = {
    "a": 1,
    "b": {
        "c": 2,
        "d": 3
    },
    "e": 4
};

const keys = ["a", "b.c", "e"];

console.log(obj.sum(keys)); 
