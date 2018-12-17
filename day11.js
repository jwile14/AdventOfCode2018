const fs = require("fs");

let grid;

const processData = rawData => {
    return {
        serialNumber: Number(rawData)
    };
};

const initGrid = serialNumber => {
    grid = new Array(300);
    for (let i = 0; i < 300; i++) {
        grid[i] = new Array(300);
        for (let j = 0; j < 300; j++) {
            const x = i + 1;
            const y = j + 1;
            const rackId = x + 10;
            let powerLevel = rackId * y;
            powerLevel += serialNumber;
            powerLevel *= rackId;
            powerLevel = Math.floor(powerLevel / 100) % 10;
            powerLevel -= 5;
            grid[i][j] = powerLevel;
        }
    }
};

let knownPowers = {};

const calculatePowerForCell = (x, y, size) => {
    let power = 0;
    let cacheKey = `${x},${y},${size - 1}`;

    if (knownPowers[cacheKey] !== undefined) {
        const prevPower = knownPowers[cacheKey];
        power += prevPower;
        cacheKey = `${x},${y},${size}`;
        if (x + size - 1 >= 300 || y + size - 1 >= 300) {
            knownPowers[cacheKey] = null;
            return null;
        }
        for (let i = x; i < x + size; i++) {
            power += grid[i][y + size - 1];
        }
        for (let j = y; j < y + size - 1; j++) {
            power += grid[x + size - 1][j];
        }

        knownPowers[cacheKey] = power;
    } else {
        cacheKey = `${x},${y},${size}`;

        for (let i = x; i < x + size; i++) {
            for (let j = y; j < y + size; j++) {
                if (i >= 300 || j >= 300) {
                    // console.log(`(${x}, ${y}) not valid cell`);
                    knownPowers[cacheKey] = null;
                    return null;
                }
                power += grid[i][j];
            }
        }

        knownPowers[cacheKey] = power;
    }

    return power;
};

const drawGrid = () => {
    for (let i = 0; i < grid.length; i++) {
        console.log(grid[i].join(" "));
    }
};

const solvePart1 = serialNumber => {
    let highestPower = null;
    let highestX;
    let highestY;
    initGrid(serialNumber);
    for (let i = 0; i < 300; i++) {
        for (let j = 0; j < 300; j++) {
            const cellPower = calculatePowerForCell(i, j, 3);
            if (cellPower !== null) {
                if (highestPower === null || highestPower < cellPower) {
                    // console.log('new highest power');
                    highestX = i;
                    highestY = j;
                    highestPower = cellPower;
                }
            }
        }
    }
    console.log(`(${highestX + 1}, ${highestY + 1}) => ${highestPower}`);
};

const solvePart2 = serialNumber => {
    let highestPower = null;
    let highestSize;
    let highestX;
    let highestY;
    initGrid(serialNumber);
    for (let i = 0; i < 300; i++) {
        // console.log(i, highestPower, highestSize, highestX, highestY);
        for (let j = 0; j < 300; j++) {
            knownPowers = {};
            for (let size = 1; size < 300; size++) {
                const cellPower = calculatePowerForCell(i, j, size);
                if (cellPower !== null) {
                    // console.log('new highest power');
                    if (highestPower === null || highestPower < cellPower) {
                        highestX = i;
                        highestY = j;
                        highestSize = size;
                        highestPower = cellPower;
                    }
                } else {
                    break;
                }
            }
        }
    }
    console.log(
        `${highestSize}: (${highestX + 1}, ${highestY + 1}) => ${highestPower}`
    );
};

fs.readFile("./data.txt", "utf8", async function(err, rawData) {
    if (err) {
        return console.log(err);
    }
    const {
        serialNumber
    } = processData(rawData);

    solvePart1(serialNumber);
    // solvePart2(serialNumber);
});
