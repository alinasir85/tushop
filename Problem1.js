const readline = require('readline');

class Job {
    constructor(startTime, endTime, profit) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.profit = profit;
    }
}

function convertToMinutes(time) {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    return hours * 60 + minutes;
}

function isOverlapping(job1, job2) {
    const start1 = convertToMinutes(job1.startTime);
    const end1 = convertToMinutes(job1.endTime);
    const start2 = convertToMinutes(job2.startTime);
    const end2 = convertToMinutes(job2.endTime);
    return (start1 < end2 && start2 < end1);
}

function findMaximumProfit(jobs) {
    jobs.sort((a, b) => b.profit - a.profit);
    const selectedJobs = [];
    let totalProfit = 0;

    for (let i = 0; i < jobs.length; i++) {
        let canAdd = true;
        for (let selected of selectedJobs) {
            if (isOverlapping(jobs[i], selected)) {
                canAdd = false;
                break;
            }
        }
        if (canAdd) {
            selectedJobs.push(jobs[i]);
            totalProfit += jobs[i].profit;
        }
    }
    const remainingJobs = jobs.length - selectedJobs.length;
    let remainingEarnings = 0;

    for (let job of jobs) {
        if (!selectedJobs.includes(job)) {
            remainingEarnings += job.profit;
        }
    }

    return [remainingJobs, remainingEarnings];
}

function isValidTime(time) {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (query) => new Promise((resolve) => rl.question(query, resolve));

    try {
        console.log("Enter the number of Jobs");
        const n = parseInt(await question(""));

        if (n <= 0 || n > 100) {
            console.log("Number of jobs should be between 1 and 100");
            rl.close();
            return;
        }

        const jobs = [];
        console.log("Enter job start time, end time, and earnings");

        for (let i = 0; i < n; i++) {
            const startTime = parseInt(await question(""));
            const endTime = parseInt(await question(""));
            const profit = parseInt(await question(""));

            if (startTime >= endTime || startTime > 2359 || endTime > 2359 ||
                !isValidTime(startTime) || !isValidTime(endTime)) {
                console.log("Invalid time format or start time is greater than or equal to end time");
                rl.close();
                return;
            }

            jobs.push(new Job(startTime, endTime, profit));
        }

        const [remainingTasks, remainingEarnings] = findMaximumProfit(jobs);

        console.log("The number of tasks and earnings available for others");
        console.log(`Task: ${remainingTasks}`);
        console.log(`Earnings: ${remainingEarnings}`);

    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        rl.close();
    }
}

main();
