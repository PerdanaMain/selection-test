let idCounter = 1;

export class AnalysisTask {
  private id: number;
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
    this.id = id ?? idCounter++;
    this.input1 = input1;
    this.input2 = input2;
    this.isCaseSensitive = isCaseSensitive;
    this.resultPercentage = resultPercentage;
    this.details = details;
  }

  getId(): number {
    return this.id;
  }

  static calculate(input1: string, input2: string, isCaseSensitive: boolean): { percentage: string; details: string } {
    const s1 = isCaseSensitive ? input1 : input1.toLowerCase();
    const s2 = isCaseSensitive ? input2 : input2.toLowerCase();

    const matches = s1.split("").filter((char) => s2.includes(char));
    const percentage = s1.length > 0 ? ((matches.length / s1.length) * 100).toFixed(2) : "0.00";
    const details = `Found ${matches.length} of ${s1.length} characters from Input 1 present in Input 2.`;

    return { percentage, details };
  }
}
