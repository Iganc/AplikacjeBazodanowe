const obj = { person: { address: { street: 'Wiejska' }, name: 'Tomasz' }};
const path = 'person.address.street';
function lenVal(obj, path){
    const value = path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    return value && typeof value === 'string' ? value.length : undefined;
}
console.log(lenVal(obj, path));