const fs = require("fs");

let grid;
let carts;

class Cart {
	constructor(x, y, dir) {
		this.x = x;
		this.y = y;
		this.dir = dir;
		this.nextTurn = "L";
		this.moved = false;
	}

	resetMoved() {
		this.moved = false;
	}

	turnLeft() {
		switch (this.dir) {
			case "^":
				this.dir = "<";
				break;
			case "v":
				this.dir = ">";
				break;
			case ">":
				this.dir = "^";
				break;
			case "<":
				this.dir = "v";
				break;
		}
	}

	turnRight() {
		switch (this.dir) {
			case "^":
				this.dir = ">";
				break;
			case "v":
				this.dir = "<";
				break;
			case ">":
				this.dir = "v";
				break;
			case "<":
				this.dir = "^";
				break;
		}
	}

	move() {
		switch (this.dir) {
			case "^":
				this.y -= 1;
				break;
			case "v":
				this.y += 1;
				break;
			case ">":
				this.x += 1;
				break;
			case "<":
				this.x -= 1;
				break;
		}

		if (grid[this.y][this.x] === "+") {
			switch (this.nextTurn) {
				case "L":
					this.turnLeft();
					this.nextTurn = "S";
					break;
				case "S":
					this.nextTurn = "R";
					break;
				case "R":
					this.turnRight();
					this.nextTurn = "L";
					break;
			}
		} else if ("/\\".indexOf(grid[this.y][this.x]) >= 0) {
			switch (grid[this.y][this.x]) {
				case "/":
					switch (this.dir) {
						case "^":
						case "v":
							this.turnRight();
							break;
						case ">":
						case "<":
							this.turnLeft();
							break;
					}
					break;
				case "\\":
					switch (this.dir) {
						case "^":
						case "v":
							this.turnLeft();
							break;
						case ">":
						case "<":
							this.turnRight();
							break;
					}
					break;
			}
		}
		this.moved = true;
	}
}

const processData = rawData => {
	grid = [];
	carts = [];

	const lines = rawData.split("\n");

	for (let i = 0; i < lines.length; i++) {
		grid.push(new Array(lines[i].length));

		for (let j = 0; j < lines[i].length; j++) {
			if ("v^<>".indexOf(lines[i][j]) >= 0) {
				const cart = new Cart(j, i, lines[i][j]);
				carts.push(cart);
				grid[i][j] = "v^".indexOf(lines[i][j]) >= 0 ? "|" : "-";
			} else {
				grid[i][j] = lines[i][j];
			}
		}
	}
};

const drawCarts = canvas => {
	carts.forEach(cart => {
		if ("^v<>".indexOf(canvas[cart.y][cart.x]) >= 0) {
			canvas[cart.y][cart.x] = "x";
		} else {
			canvas[cart.y][cart.x] = cart.dir;
		}
	});
};

const clone = thing => JSON.parse(JSON.stringify(thing));

const sleep = ms =>
	new Promise(resolve => {
		setTimeout(resolve, ms);
	});

const drawGrid = () => {
	let canvas = clone(grid);
	drawCarts(canvas);
	canvas.forEach(line => {
		console.log(line.join(""));
	});
};

const sortCarts = () => {
	carts.sort((cart1, cart2) => {
		if (cart1.y < cart2.y) {
			return -1;
		} else if (cart1.y === cart2.y) {
			if (cart1.x < cart2.x) {
				return -1;
			} else if (cart1.x === cart2.x) {
				return 0;
			}
			return 1;
		}
		return 1;
	});
};

const solvePart1 = async () => {
	let crashDetected = false;
	let time = 0;
	while (!crashDetected) {
		time++;
		sortCarts();

		for (let i = 0; i < carts.length; i++) {
			const cart = carts[i];
			cart.move();

			for (let j = 0; j < carts.length; j++) {
				if (i !== j) {
					const otherCart = carts[j];
					if (otherCart.x === cart.x && otherCart.y === cart.y) {
						console.log(
							`CRASH AT ${otherCart.x}, ${
								otherCart.y
							} at time ${time}`
						);
						crashDetected = true;
						break;
					}
				}
			}
		}
	}
};

const removeCarts = (i, j) => {
	let newCarts = [];

	for (let k = 0; k < carts.length; k++) {
		if (k !== i && k !== j) {
			newCarts.push(carts[k]);
		}
	}
	carts = newCarts;
};

const hasntMoved = cart => !cart.moved;

const solvePart2 = async () => {
	let time = 0;
	while (carts.length > 1) {
		time++;
		sortCarts();

		while (carts.some(hasntMoved)) {
			for (let i = 0; i < carts.length; i++) {
				let crashDetected = false;
				const cart = carts[i];
				if (!cart.moved) {
					cart.move();

					for (let j = 0; j < carts.length; j++) {
						if (i !== j) {
							const otherCart = carts[j];
							if (
								otherCart.x === cart.x &&
								otherCart.y === cart.y
							) {
								console.log(
									`CRASH AT ${otherCart.x}, ${
										otherCart.y
									} at time ${time}`
								);

								removeCarts(i, j);
								crashDetected = true;
								break;
							}
						}
					}
					if (crashDetected) {
						break;
					}
				}
			}
		}

		carts.map(cart => cart.resetMoved());
	}
	console.log(`Last Cart at ${carts[0].x},${carts[0].y}`);
};

fs.readFile("./data.txt", "utf8", async function(err, rawData) {
	if (err) {
		return console.log(err);
	}
	processData(rawData);
	sortCarts();
	solvePart1();
	solvePart2();
});
