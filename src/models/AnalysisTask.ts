import { BaseTask } from "./BaseTask";

export class AnalysisTask extends BaseTask {
  public input1: string;
  public input2: string;
  public isCaseSensitive: boolean;
  public resultPercentage: string;
  public details: string;

  constructor(
    input1: string,
    input2: string,
    isCaseSensitive: boolean,
    resultPercentage: string,
    details: string,
    id?: number
  ) {
    super(id);
    this.input1 = input1;
    this.input2 = input2;
    this.isCaseSensitive = isCaseSensitive;
    this.resultPercentage = resultPercentage;
    this.details = details;
  }

  getSummary(): string {
    const mode = this.isCaseSensitive ? "sensitive" : "non-sensitive";
    return `[${mode}] "${this.input1}" vs "${this.input2}" → ${this.resultPercentage}%`;
  }

  static calculate(
    input1: string,
    input2: string,
    isCaseSensitive: boolean
  ): { percentage: string; details: string } {
    const chars1 = input1.split("");
    const chars2 = input2.split("");

    let matchCount = 0;

    for (const c1 of chars1) {
      for (const c2 of chars2) {
        if (isCaseSensitive) {
          if (c1 === c2) {
            matchCount++;
            break;
          }
        } else {
          if (c1.toLowerCase() === c2.toLowerCase()) {
            matchCount++;
            break;
          }
        }
      }
    }

    const percentage =
      chars1.length > 0
        ? ((matchCount / chars1.length) * 100).toFixed(2)
        : "0.00";
    const details = `Found ${matchCount} of ${chars1.length} characters from Input 1 present in Input 2.`;

    return { percentage, details };
  }
}
