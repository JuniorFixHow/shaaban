export function averageAndRound(numbers: number[]): number | null {
    if (numbers.length === 0) {
        return null; // Handle empty array case
    }

    const total = numbers.reduce((acc, num) => acc + num, 0);
    const average = total / numbers.length;
    const roundedAverage = Math.round(average);

    return roundedAverage;
}


export function formatArraysAsString(X: number[], Y: number[]): string {
    if (X.length !== Y.length) {
        throw new Error("Arrays must be of the same length.");
    }

    const result: string[] = [];
    
    for (let i = 0; i < X.length; i++) {
        result.push(`(${Y[i]}   ${X[i]})`);
    }

    return result.join(', ');
}