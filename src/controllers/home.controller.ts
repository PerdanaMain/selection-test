import { Request, Response } from "express";

export class HomeController {
  public static index(req: Request, res: Response) {
    const history = [] as any[];

    res.render("dashboard", {
      history,
      result: {
        input1: null,
        input2: null,
        caseType: null,
        percentage: null,
        details: null,
      },
      error: null,
      editingTask: null,
    });
  }
}
