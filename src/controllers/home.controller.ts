import { Request, Response } from "express";

type IdParam = { id: string };
import { AnalysisTask } from "../models/AnalysisTask";

const history: AnalysisTask[] = [];

export class HomeController {
  public static index(req: Request, res: Response) {
    res.render("dashboard", {
      history,
      result: null,
      error: null,
      editingTask: null,
    });
  }

  public static analyze(req: Request, res: Response) {
    const { input1, input2, caseType } = req.body;

    if (!input1 || !input2) {
      return res.render("dashboard", {
        history,
        result: null,
        error: "Please provide both input strings for analysis.",
        editingTask: null,
      });
    }

    const isCaseSensitive = caseType !== "non-sensitive";
    const { percentage, details } = AnalysisTask.calculate(String(input1), String(input2), isCaseSensitive);

    const task = new AnalysisTask(String(input1), String(input2), isCaseSensitive, percentage, details);
    history.unshift(task);

    res.render("dashboard", {
      history,
      result: { percentage, details },
      error: null,
      editingTask: null,
    });
  }

  public static editMode(req: Request<IdParam>, res: Response) {
    const id = parseInt(req.params.id);
    const task = history.find((t) => t.getId() === id);

    if (!task) {
      return res.redirect("/");
    }

    res.render("dashboard", {
      history,
      result: null,
      error: null,
      editingTask: task,
    });
  }

  public static update(req: Request<IdParam>, res: Response) {
    const id = parseInt(req.params.id);
    const { input1, input2, caseType } = req.body;
    const index = history.findIndex((t) => t.getId() === id);

    if (index === -1) {
      return res.redirect("/");
    }

    const isCaseSensitive = caseType !== "non-sensitive";
    const { percentage, details } = AnalysisTask.calculate(String(input1), String(input2), isCaseSensitive);

    const updated = new AnalysisTask(String(input1), String(input2), isCaseSensitive, percentage, details, id);
    history[index] = updated;

    res.redirect("/");
  }

  public static delete(req: Request<IdParam>, res: Response) {
    const id = parseInt(req.params.id);
    const index = history.findIndex((t) => t.getId() === id);

    if (index !== -1) {
      history.splice(index, 1);
    }

    res.redirect("/");
  }
}
