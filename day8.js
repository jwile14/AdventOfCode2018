const fs = require('fs');

const processData = (rawData) => {
    return rawData.split(' ').map(item => Number(item));
};

const evaluateNodePart1 = (data, node) => {
    let totalMetadata = 0;
    const numChildren = data[node];
    const numMetadata = data[node + 1];
    if (data[node] === 0) {
        totalMetadata = data.slice(node + 2, node + 2 + numMetadata).reduce((acc, val) => acc += val, 0);
        return {
            length: 2 + numMetadata,
            totalMetadata
        };
    } else {
        let start = node;
        let currentIndex = node + 2;
        for (let i = 0; i < numChildren; i++) {
            const result = evaluateNodePart1(data, currentIndex);
            currentIndex += result.length;
            totalMetadata += result.totalMetadata;
        }
        totalMetadata += data.slice(currentIndex, currentIndex + numMetadata).reduce((acc, val) => acc += val, 0);
        return {
            length: currentIndex - start + numMetadata,
            totalMetadata
        };
    }
    return -1;
};

const evaluateNodePart2 = (data, node) => {
    let totalMetadata = 0;
    const numChildren = data[node];
    const numMetadata = data[node + 1];
    if (data[node] === 0) {
        totalMetadata = data.slice(node + 2, node + 2 + numMetadata).reduce((acc, val) => acc += val, 0);
        return {
            length: 2 + numMetadata,
            totalMetadata
        };
    } else {
        let totalMetadata = 0;
        let start = node;
        let currentIndex = node + 2;
        let childrenCounts = new Array(numChildren).fill(0);
        for (let i = 0; i < numChildren; i++) {
            const result = evaluateNodePart2(data, currentIndex);
            currentIndex += result.length;
            childrenCounts[i] = result.totalMetadata;
        }
        const metadataReferences = data.slice(currentIndex, currentIndex + numMetadata);
        metadataReferences.forEach((reference) => {
            if (reference - 1 < numChildren) {
                totalMetadata += childrenCounts[reference - 1];
            }
        });
        return {
            length: currentIndex - start + numMetadata,
            totalMetadata
        };
    }
    return -1;
};

const clone = (thing) =>
    JSON.parse(JSON.stringify(thing));

fs.readFile('./data.txt', 'utf8', async function(err, rawData) {
    if (err) {
        return console.log(err);
    }
    const data = processData(rawData);
    console.log(evaluateNodePart1(clone(data), 0));
    console.log(evaluateNodePart2(clone(data), 0));
});
