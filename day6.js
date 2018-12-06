const fs = require('fs');

const processData = (rawData) => {
    let data = [];

    rawData.split('\n').forEach((rawPoint) => {
        const coords = rawPoint.split(', ').map(Number);
        data.push(coords);
    });

    return data;
};

const getBoundaries = (points) => {
    let maxX = 0;
    let maxY = 0;

    points.forEach((point) => {
        maxX = Math.max(point[0], maxX);
        maxY = Math.max(point[1], maxY);
    });

    return {
        maxX,
        maxY
    };
};

const getSingleClosest = (x, y, points) => {
    let closestIndex = 0;
    let closestDistance = Math.abs(x - points[0][0]) + Math.abs(y - points[0][1]);
    let tied = false;

    for (let i = 1; i < points.length; i++) {
        const currentDistance = Math.abs(x - points[i][0]) + Math.abs(y - points[i][1]);
        if (currentDistance < closestDistance) {
            closestIndex = i;
            closestDistance = currentDistance;
            tied = false;
        } else if (currentDistance === closestDistance) {
            closestIndex = i;
            closestDistance = currentDistance;
            tied = true;
        }
    }
    return tied ? -1 : closestIndex;
};

const countDangerousArea = (grid, points) => {
    let areaCounts = new Array(points.length).fill(0);
    let isOnEdge = new Array(areaCounts.length).fill(false);

    const onEdge = (x, y) => {
        return (x === 0 || y === 0 || x === grid.length - 1 || y === grid[x].length - 1);
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const closestPointIndex = getSingleClosest(i, j, points);

            if (closestPointIndex >= 0) {
                if (onEdge(i, j)) {
                    isOnEdge[closestPointIndex] = true;
                }
                areaCounts[closestPointIndex] += 1;
            }
        }
    }

    let internalAreaCounts = [];
    for (let i = 0; i < areaCounts.length; i++) {
        if (!isOnEdge[i]) {
            internalAreaCounts.push(areaCounts[i]);
        }
    }

    const maxDangerousArea = Math.max(...internalAreaCounts);
    console.log(`Dangerous area: ${maxDangerousArea}`);
};

const getDistanceCount = (x, y, points) => {
    let count = 0;
    for (let i = 0; i < points.length; i++) {
        count += Math.abs(x - points[i][0]) + Math.abs(y - points[i][1]);
    }
    return count;
}

const countSafeArea = (grid, points) => {
    let count = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const currentDistanceCount = getDistanceCount(i, j, points);

            if (currentDistanceCount < 10000) {
                count += 1;
            }
        }
    }

    console.log(`Safe area: ${count}`);
}

fs.readFile('./data.txt', 'utf8', async function(err, rawData) {
    if (err) {
        return console.log(err);
    }
    let points = processData(rawData);

    let {
        maxX,
        maxY,
    } = getBoundaries(points);

    let grid = new Array(maxX);
    for (let i = 0; i < maxX + 1; i++) {
        grid[i] = new Array(maxY + 1).fill('.');
    }

    countDangerousArea(grid, points); // pt 1
    countSafeArea(grid, points); // pt 2
});
