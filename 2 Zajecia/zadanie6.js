class CustomSet {
    constructor() {
      this.set = [];
      this.history = [];
    }
  
    add(element) {
      if (!this.contains(element)) {
        this.set.push(element);
        this.history.push({ action: 'add', element: element });
      }
    }
  
    getElements() {
      return this.set;
    }
  
    union(otherSet) {
      let resultSet = new CustomSet();
      this.set.forEach(element => resultSet.add(element));
      otherSet.getElements().forEach(element => resultSet.add(element));
      this.history.push({ action: 'union', result: resultSet.getElements() });
      return resultSet;
    }
  
    intersection(otherSet) {
      let resultSet = new CustomSet();
      this.set.forEach(element => {
        if (otherSet.contains(element)) {
          resultSet.add(element);
        }
      });
      this.history.push({ action: 'intersection', result: resultSet.getElements() });
      return resultSet;
    }
  
    difference(otherSet) {
      let resultSet = new CustomSet();
      this.set.forEach(element => {
        if (!otherSet.contains(element)) {
          resultSet.add(element);
        }
      });
      this.history.push({ action: 'difference', result: resultSet.getElements() });
      return resultSet;
    }
  
    contains(element) {
      return this.set.includes(element);
    }
  
    remove(element) {
      const index = this.set.indexOf(element);
      if (index !== -1) {
        this.set.splice(index, 1);
        this.history.push({ action: 'remove', element: element });
      }
    }
  
    display() {
      console.log(`{${this.set.join(', ')}}`);
    }
  
    showHistory() {
      console.log(this.history);
    }
  }
  
  let setA = new CustomSet();
  setA.add(1);
  setA.add(2);
  setA.add(3);
  
  let setB = new CustomSet();
  setB.add(2);
  setB.add(3);
  setB.add(4);
  
  setA.union(setB).display();
  setA.intersection(setB).display();
  setA.difference(setB).display();
  console.log(setA.contains(3));
  setA.remove(3);
  console.log(setA.contains(3));
  