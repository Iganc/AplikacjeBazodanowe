async function asyncSort(arr, n) {
    const chunkArray = (arr, n) => {
        const chunkSize = Math.ceil(arr.length / n);
        return Array.from({ length: n }, (_, i) => 
            arr.slice(i * chunkSize, (i + 1) * chunkSize)
        );
    };

    const asyncBubbleSort = async (arr) => {
        return new Promise(resolve => {
            let sorted = false;
            for (let i = 0; i < arr.length; i++) {
                sorted = true;
                for (let j = 0; j < arr.length - 1 - i; j++) {
                    if (arr[j] > arr[j + 1]) {
                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                        sorted = false;
                    }
                }
                if (sorted) break;
            }
            resolve(arr);
        });
    };

    const asyncMerge = async (left, right) => {
        return new Promise(resolve => {
            const result = [];
            let i = 0, j = 0;
            
            while (i < left.length && j < right.length) {
                left[i] <= right[j] 
                    ? result.push(left[i++]) 
                    : result.push(right[j++]);
            }
            
            resolve([...result, ...left.slice(i), ...right.slice(j)]);
        });
    };

    const chunks = chunkArray(arr, n);
    
    let sortedChunks = await Promise.all(
        chunks.map(chunk => asyncBubbleSort(chunk))
    );

    while (sortedChunks.length > 1) {
        const mergeTasks = [];
        
        for (let i = 0; i < sortedChunks.length; i += 2) {
            const left = sortedChunks[i];
            const right = sortedChunks[i + 1] || [];
            mergeTasks.push(asyncMerge(left, right));
        }
        
        sortedChunks = await Promise.all(mergeTasks);
    }

    return sortedChunks[0];
}

(async () => {
    const arr = [5, 3, 8, 1, 2, 7, 6, 4];
    const sorted = await asyncSort(arr, 3);
    console.log(sorted); 
})();