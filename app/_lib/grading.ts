// app/_lib/grading.ts
export function getLetterGrade(percentage: number): string {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C+";
    if (percentage >= 40) return "C";
    if (percentage >= 33) return "D";
    return "F";
}

export function getOverallPercentage(obtained: number, full: number): number | null {
    if (!full || full <= 0) return null;
    return Math.round((obtained / full) * 1000) / 10;
}