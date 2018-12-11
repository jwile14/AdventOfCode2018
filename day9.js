});
const fs = require('fs');

const processData = (rawData) => {
    let splitData = rawData.split(' ');
    return {
        numPlayers: Number(splitData[0]),
        lastMarbleScore: Number(splitData[6])
    };
};

class DoublyLinkedNode {
    constructor(value, next = this, previous = this) {
        this.value = value;
        this.previous = previous;
        this.next = next;
    }

    insertAfter(node) {
        this.next.previous = node;
        node.next = this.next;
        this.next = node;
        node.previous = this;
    }

    removePrevious() {
        this.previous.previous.next = this;
        this.previous = this.previous.previous;
    }
}

const printList = (currentMarble) => {
    let seen = [];

    while (!seen.some((marble) => marble.value === currentMarble.value)) {
        console.log(`${currentMarble.value} - prev: ${currentMarble.previous.value}, next: ${currentMarble.next.value}`);
        seen.push(currentMarble);
        currentMarble = currentMarble.next;
    };
}

const solvePart1 = (numPlayers, lastMarbleScore) => {
    let scores = new Array(numPlayers).fill(0);
    console.log(numPlayers, lastMarbleScore);
    let marbleValue = 0;
    let currentMarble = new DoublyLinkedNode(marbleValue);
    let currentPlayer = -1;
    const listHead = currentMarble;
    let newCurrentMarble;
    let lastScore = 0;

    while (marbleValue < lastMarbleScore) {
        marbleValue += 1;
        currentPlayer = (currentPlayer + 1) % numPlayers;

        if (marbleValue % 23 === 0) {
            let marbleToRemove = currentMarble.previous.previous.previous.previous.previous.previous.previous;
            newCurrentMarble = marbleToRemove.next;
            newCurrentMarble.removePrevious();
            lastScore = marbleToRemove.value + marbleValue;
            scores[currentPlayer] = scores[currentPlayer] + lastScore;
        } else {
            newCurrentMarble = new DoublyLinkedNode(marbleValue)
            currentMarble.next.insertAfter(newCurrentMarble);
        }
        currentMarble = newCurrentMarble;
    };
    console.log('Highest score:', Math.max(...scores));
};

fs.readFile('./data.txt', 'utf8', async function(err, rawData) {
    if (err) {
        return console.log(err);
    }
    const {
        numPlayers,
        lastMarbleScore
    } = processData(rawData);
    solvePart1(numPlayers, lastMarbleScore);
});
