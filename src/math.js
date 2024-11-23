export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function produceEquation(max = 100) {
    const maxRandomLimit = max + 1;
    const left = getRandomInt(maxRandomLimit);
    const rightMax = maxRandomLimit - left;
    const right = getRandomInt(rightMax);
    const isPlus = getRandomInt(2) > 0;
    const answer = isPlus ? left + right : left - right;
    const eq = `${left} ${isPlus ? '+' : '-'} ${right} = `;
    if (answer < 0) {
        return produceEquation(max);
    }
    return {eq, answer};
}

export function generateExamples(amount = 10, maxSum = 20) {
    const output = [];
    for (let i = 0; i < amount; i++) {
        const {eq, answer} = produceEquation(maxSum);
        output.push({label: eq, id: i, answer});
    }
    return output;
}
