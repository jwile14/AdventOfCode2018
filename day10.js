const fs = require("fs");

let xMin = null;
let xMax = null;
let yMin = null;
let yMax = null;

let grid;

class Point {
	constructor(x, y, xVelocity, yVelocity) {
		this.x = x;
		this.y = y;
		this.xVelocity = xVelocity;
		this.yVelocity = yVelocity;
	}

	move() {
		this.x += this.xVelocity;
		this.y += this.yVelocity;
	}
}

const processData = rawData => {
	let points = [];
	let splitData = rawData.split("\n");
	let pointDataRegExp = /position=<[ ]*([-0-9]*),[ ]*([-0-9]*)> velocity=<[ ]*([-0-9]*),[ ]*([-0-9]*)>/;

	splitData.forEach(line => {
		const result = pointDataRegExp.exec(line);
		const x = Number(result[1]);
		const y = Number(result[2]);

		xMin = xMin === null ? x : Math.min(x, xMin);
		xMax = xMax === null ? x : Math.max(x, xMax);
		yMin = yMin === null ? y : Math.min(y, yMin);
		yMax = yMax === null ? y : Math.max(y, yMax);

		const xVelocity = Number(result[3]);
		const yVelocity = Number(result[4]);
		const point = new Point(x, y, xVelocity, yVelocity);
		points.push(point);
	});

	points.forEach(point => {
		point.x = point.x - xMin;
		point.y = point.y - yMin;
	});

	yMax -= yMin;
	yMin = 0;
	xMax -= xMin;
	xMin = 0;

	return {
		points
	};
};

const sleep = ms =>
	new Promise(resolve => {
		setTimeout(resolve, ms);
	});

const initGrid = () => {
	// console.log(xMin, xMax, yMin, yMax);
	grid = new Array(yMax - yMin + 1);
	for (let i = 0; i < yMax - yMin + 1; i++) {
		grid[i] = new Array(xMax - xMin + 1).fill(".");
	}
};

const drawPoints = points => {
	initGrid();
	points.forEach(point => {
		const x = point.x - xMin;
		const y = point.y - yMin;
		try {
			grid[y][x] = "#";
		} catch (e) {
			// console.log('oof');
		}
	});
	drawGrid();
};

const drawGrid = () => {
	for (let i = 0; i < grid.length; i++) {
		console.log(grid[i].join(""));
	}
};

const solvePart1 = async points => {
	console.log("solving");
	for (let i = 0; i < 50000; i++) {
		if ((xMax - xMin) * (yMax - yMin) <= 10000) {
			console.log(`${i} seconds:`);
			drawPoints(points);
			await sleep(1000);
		}
		xMin = null;
		xMax = null;
		yMin = null;
		yMax = null;
		points.forEach(point => {
			point.move();

			xMin = xMin === null ? point.x : Math.min(point.x, xMin);
			xMax = xMax === null ? point.x : Math.max(point.x, xMax);
			yMin = yMin === null ? point.y : Math.min(point.y, yMin);
			yMax = yMax === null ? point.y : Math.max(point.y, yMax);
		});
	}
	console.log("done solving");
};

fs.readFile("./data.txt", "utf8", async function(err, rawData) {
	if (err) {
		return console.log(err);
	}
	const { points } = processData(rawData);
	console.log(points);

	solvePart1(points);
});
