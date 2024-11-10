const fs = require('fs');

class GoodieDistributor {
    constructor() {
        this.goodies = [];
    }
    parseInputFile(filename) {
        const fileContent = fs.readFileSync(filename, 'utf8');
        const lines = fileContent.split('\n');
        const employeesLine = lines[0];
        const numEmployees = parseInt(employeesLine.match(/\d+/)[0]);
        for (let i = 2; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '') continue;

            const [goodieName, price] = line.split(':').map(item => item.trim());
            this.goodies.push({
                name: goodieName,
                price: parseInt(price)
            });
        }
        return numEmployees;
    }

    findOptimalDistribution(numEmployees) {
        if (numEmployees > this.goodies.length) {
            throw new Error('Not enough goodies for all employees');
        }
        this.goodies.sort((a, b) => a.price - b.price);
        let minDiff = Infinity;
        let optimalStart = 0;
        for (let i = 0; i <= this.goodies.length - numEmployees; i++) {
            const currentDiff = this.goodies[i + numEmployees - 1].price - this.goodies[i].price;
            if (currentDiff < minDiff) {
                minDiff = currentDiff;
                optimalStart = i;
            }
        }
        const selectedGoodies = this.goodies.slice(optimalStart, optimalStart + numEmployees);
        return {
            goodies: selectedGoodies,
            priceDiff: minDiff
        };
    }

    writeOutputFile(filename, selectedGoodies, priceDiff) {
        let output = 'The goodies selected for distribution are:\n';
        for (const goodie of selectedGoodies) {
            output += `${goodie.name}: ${goodie.price}\n`;
        }
        output += `\nAnd the difference between the chosen goodie with highest price and the lowest price is ${priceDiff}`;
        fs.writeFileSync(filename, output);
    }

    distributeGoodies(inputFile, outputFile) {
        try {
            const numEmployees = this.parseInputFile(inputFile);
            const { goodies, priceDiff } = this.findOptimalDistribution(numEmployees);
            this.writeOutputFile(outputFile, goodies, priceDiff);
            console.log(`Distribution completed successfully. Check ${outputFile} for results.`);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

function main() {
    const distributor = new GoodieDistributor();
    distributor.distributeGoodies('sample_input.txt', 'sample_output.txt');
}

main();
