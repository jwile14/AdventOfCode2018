const fs = require("fs");

const processData = rawData => {
	const numRecipes = Number(rawData);
	let scores = [3, 7];
	return {
		numRecipes,
		scores
	};
};

const clone = thing => JSON.parse(JSON.stringify(thing));

const sleep = ms =>
	new Promise(resolve => {
		setTimeout(resolve, ms);
	});

const solvePart1 = numRecipes => {
	let elf1 = 0;
	let elf2 = 1;
	let scores = "37";

	while (scores.length < numRecipes + 10) {
		const newScore = (
			Number(scores[elf1]) + Number(scores[elf2])
		).toString();

		scores += newScore;

		elf1 = (1 + Number(scores[elf1]) + elf1) % scores.length;
		elf2 = (1 + Number(scores[elf2]) + elf2) % scores.length;
	}

	console.log(scores.substring(numRecipes, numRecipes + 10));
};

const scoreSeen = (scores, endingScore) => {
	if (scores.length > endingScore.length) {
		const oneOption =
			scores.substr(
				scores.length - endingScore.length,
				endingScore.length - 1
			) + scores[scores.length - 1];
		const twoOption = scores.substr(
			scores.length - endingScore.length - 1,
			endingScore.length
		);
		return oneOption === endingScore || twoOption === endingScore;
	}
	if (scores.length === endingScore.length) {
		return scores === endingScore;
	}
	return false;
};

const solvePart2 = endingScore => {
	let elf1 = 0;
	let elf2 = 1;
	let scores = "37";
	let i = 0;

	while (!scoreSeen(scores, endingScore)) {
		i += 1;
		if (i % 100000 === 0) {
			// eslint-disable-next-line no-console
			console.log(i);
		}
		const newScore = (
			Number(scores[elf1]) + Number(scores[elf2])
		).toString();

		scores += newScore;

		elf1 = (1 + Number(scores[elf1]) + elf1) % scores.length;
		elf2 = (1 + Number(scores[elf2]) + elf2) % scores.length;
	}

	console.log(scores.length - endingScore.length);
};

fs.readFile("./data.txt", "utf8", async function(err, rawData) {
	if (err) {
		return console.log(err);
	}
	const { numRecipes, scores } = processData(rawData);
	solvePart1(numRecipes, clone(scores));
	// solvePart2(numRecipes, scores);
});
