export abstract class BaseTask {
  private static idCounter = 1;
  private readonly id: number;
  protected readonly createdAt: Date;

  constructor(id?: number) {
    this.id = id ?? BaseTask.idCounter++;
    this.createdAt = new Date();
  }

  getId(): number {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  abstract getSummary(): string;
}
