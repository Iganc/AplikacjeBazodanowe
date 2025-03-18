function Node(value) {
    this.value = value; 
    this.left = null; 
    this.right = null;
}

Node.prototype.setLeft = function(childNode) {
    this.left = childNode;
};

Node.prototype.setRight = function(childNode) {
    this.right = childNode;
};

const root = new Node(10);

const leftChild = new Node(5);
const rightChild = new Node(15);

root.setLeft(leftChild);
root.setRight(rightChild);

const leftLeftChild = new Node(0);
const leftRightChild = new Node(20);

leftChild.setLeft(leftLeftChild);
rightChild.setRight(leftRightChild);


async function asyncTreeSearch(tree, el) {
    if (!tree) return false;
    if (tree.value === el) return true;

    const children = [];
    if (tree.left) children.push(tree.left);
    if (tree.right) children.push(tree.right);

    const results = await children
        .map(child => asyncTreeSearch(child, el))
        .reduce(async (accPromise, promise) => {
            const acc = await accPromise;
            return acc || await promise;
        }, Promise.resolve(false));

    return results;
    
}
(async () => {
    const testValues = [10, 5, 15, 0, 20, 100];
    
    for (const val of testValues) {
      const result = await asyncTreeSearch(root, val);
      console.log(`Value ${val}: ${result ? 'Found' : 'Not found'}`);
    }
  })();