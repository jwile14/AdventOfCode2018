const fs = require('fs');

const processData = (rawData) => {
    let prerequisites = {};
    let tasks = []

    rawData.split('\n').forEach((rawPoint) => {
        const splitSentence = rawPoint.split(' ');
        const prereq = splitSentence[7];
        const task = splitSentence[1];

        if (!prerequisites[prereq]) {
            prerequisites[prereq] = [];
        }
        prerequisites[prereq].push(task);

        if (tasks.indexOf(prereq) === -1) {
            tasks.push(prereq)
        }
        if (tasks.indexOf(task) === -1) {
            tasks.push(task)
        }
    });

    tasks = tasks.sort();
    tasks.forEach((task) => {
        if (!prerequisites[task]) {
            prerequisites[task] = [];
        }
    });

    return {
        tasks,
        prerequisites
    };
};

const getNextTask = (tasks, prerequisites) => {
    let currentNextTask;

    Object.keys(prerequisites).forEach((possibleTask) => {
        if (prerequisites[possibleTask].length === 0) {
            if (tasks.some((task) => task === possibleTask) &&
                (!currentNextTask || tasks.indexOf(possibleTask) < tasks.indexOf(currentNextTask))) {
                currentNextTask = possibleTask;
            }
        }
    });
    return currentNextTask;
};

const clearCurrentTask = (tasks, prerequisites, currentTask) => {
    tasks.splice(tasks.indexOf(currentTask), 1);

    delete prerequisites[currentTask];

    return {
        tasks,
        prerequisites
    };
};

const clearWholeTask = (tasks, prerequisites, currentTask) => {
    if (tasks.indexOf(currentTask) >= 0) {
        tasks.splice(tasks.indexOf(currentTask), 1);
    }

    Object.keys(prerequisites).forEach((task) => {
        let index = prerequisites[task].indexOf(currentTask);

        if (index >= 0) {
            prerequisites[task].splice(index, 1);
        }
    });

    return {
        tasks,
        prerequisites
    };
};

const getAvailableWorker = (workers) => {
    for (let i = 0; i < workers.length; i++) {
        if (workers[i] === '.') {
            return i;
        }
    }
    return -1;
}

const solvePart1 = (tasks, prerequisites) => {
    let taskOrder = '';
    do {
        const currentTask = getNextTask(tasks, prerequisites);
        let result = clearWholeTask(tasks, prerequisites, currentTask);
        tasks = result.tasks;
        prerequisites = result.prerequisites;
        taskOrder = taskOrder + currentTask;
    } while (tasks.length > 0);

    console.log(taskOrder);
};

const workComplete = (workDone) => {
    return Object.keys(workDone).every((key) => {
        return workDone[key] === 60 + key.charCodeAt(0) - 64
    });
};

const solvePart2 = (tasks, prerequisites) => {
    let taskOrder = '';
    const workDone = {};

    tasks.forEach((task) => {
        workDone[task] = 0;
    });

    let workers = new Array(5).fill('.');
    let i = 0;
    do {
        let availableWorker = getAvailableWorker(workers);
        let currentTask = getNextTask(tasks, prerequisites);
        while (availableWorker >= 0 && currentTask) {
            workers[availableWorker] = currentTask;
            let result = clearCurrentTask(tasks, prerequisites, currentTask);
            tasks = result.tasks;
            prerequisites = result.prerequisites;
            taskOrder = taskOrder + currentTask;
            availableWorker = getAvailableWorker(workers);
            currentTask = getNextTask(tasks, prerequisites);
        }

        workers.forEach((worker) => {
            if (worker !== '.') {
                workDone[worker] = workDone[worker] + 1;

                if (workDone[worker] === 60 + worker.charCodeAt(0) - 64) {
                    let result = clearWholeTask(tasks, prerequisites, worker);
                    tasks = result.tasks;
                    prerequisites = result.prerequisites;
                    workers[workers.indexOf(worker)] = '.';
                }
            }
        });

        i += 1;
    } while (!workComplete(workDone));

    console.log(`Work done in ${i} seconds`);
};

const clone = (thing) => JSON.parse(JSON.stringify(thing));

fs.readFile('./data.txt', 'utf8', async function(err, rawData) {
    if (err) {
        return console.log(err);
    }
    let {
        tasks,
        prerequisites
    } = processData(rawData);
    solvePart1(clone(tasks), clone(prerequisites));
    solvePart2(clone(tasks), clone(prerequisites));
});
