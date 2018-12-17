const fs = require("fs");

let grid;

const processData = rawData => {
    let rules = {};

    const lines = rawData.split("\n");
    const stateLine = lines[0].split(" ");
    const padding = ".".repeat(2000);
    const state = padding + stateLine[stateLine.length - 1] + padding;

    for (let i = 2; i < lines.length; i++) {
        const splitRule = lines[i].split(" ");
        const pattern = splitRule[0];
        const result = splitRule[2];
        rules[pattern] = result;
    }

    return {
        state,
        rules
    };
};

const getPattern = (index, state) => {
    let pattern = "";
    for (let i = index - 2; i < index + 3; i++) {
        if (i < 0 || i >= state.length) {
            return null;
        }
        pattern += state[i];
    }
    return pattern;
};

const solve = (state, rules) => {
    const initState = state;

    let currentState = initState;
    for (let generation = 0; generation <= 50000000; generation++) {
        if (generation % 100 === 0) {
            let score = 0;

            for (let i = 0; i < currentState.length; i++) {
                if (currentState[i] === "#") {
                    score += i - 2000;
                }
            }

            console.log("Generation:", generation, "Score:", score);
        }
        let newGeneration = "";

        for (let i = 0; i < currentState.length; i++) {
            const pattern = getPattern(i, currentState);
            newGeneration += rules[pattern] ? rules[pattern] : ".";
        }
        currentState = newGeneration;
    }

    let score = 0;

    for (let i = 0; i < currentState.length; i++) {
        if (currentState[i] === "#") {
            score += i - 20000;
        }
    }

    console.log("Score:", score);
};

fs.readFile("./data.txt", "utf8", async function(err, rawData) {
    if (err) {
        return console.log(err);
    }
    const {
        state,
        rules
    } = processData(rawData);

    solve(state, rules);
});
