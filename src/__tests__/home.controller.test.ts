import { Request, Response } from "express";
import { HomeController } from "../controllers/home.controller";

function mockRes(): jest.Mocked<Pick<Response, "render" | "redirect">> {
  return {
    render: jest.fn(),
    redirect: jest.fn(),
  } as any;
}

function mockReq(overrides: Partial<Request> = {}): Request {
  return { body: {}, params: {}, ...overrides } as unknown as Request;
}

// Reset the in-memory history between tests by re-requiring the module
beforeEach(() => {
  jest.resetModules();
});

describe("HomeController.index", () => {
  it("renders dashboard with empty history and no result", () => {
    const req = mockReq();
    const res = mockRes();

    HomeController.index(req, res as any);

    expect(res.render).toHaveBeenCalledWith("dashboard", expect.objectContaining({
      result: null,
      error: null,
      editingTask: null,
    }));
    const [, payload] = (res.render as jest.Mock).mock.calls[0];
    expect(Array.isArray(payload.history)).toBe(true);
  });
});

describe("HomeController.analyze", () => {
  it("renders error when inputs are missing", () => {
    const req = mockReq({ body: { input1: "", input2: "" } });
    const res = mockRes();

    HomeController.analyze(req, res as any);

    expect(res.render).toHaveBeenCalledWith("dashboard", expect.objectContaining({
      error: expect.stringContaining("both input"),
    }));
  });

  it("calculates and adds result to history", () => {
    const req = mockReq({ body: { input1: "abc", input2: "axy", caseType: "non-sensitive" } });
    const res = mockRes();

    HomeController.analyze(req, res as any);

    const [, payload] = (res.render as jest.Mock).mock.calls[0];
    expect(payload.result.percentage).toBe("33.33");
    expect(payload.history.length).toBeGreaterThanOrEqual(1);
    expect(payload.history[0].input1).toBe("abc");
  });

  it("respects case-sensitive mode", () => {
    const req = mockReq({ body: { input1: "ABC", input2: "abc", caseType: "sensitive" } });
    const res = mockRes();

    HomeController.analyze(req, res as any);

    const [, payload] = (res.render as jest.Mock).mock.calls[0];
    expect(payload.result.percentage).toBe("0.00");
  });
});

describe("HomeController.editMode", () => {
  it("redirects to / when id not found", () => {
    const req = mockReq({ params: { id: "99999" } });
    const res = mockRes();

    HomeController.editMode(req as any, res as any);

    expect(res.redirect).toHaveBeenCalledWith("/");
  });

  it("renders dashboard with editingTask when id exists", () => {
    const addReq = mockReq({ body: { input1: "hello", input2: "world", caseType: "sensitive" } });
    const addRes = mockRes();
    HomeController.analyze(addReq, addRes as any);

    const [, addPayload] = (addRes.render as jest.Mock).mock.calls[0];
    const createdId = addPayload.history[0].getId();

    const editReq = mockReq({ params: { id: String(createdId) } });
    const editRes = mockRes();
    HomeController.editMode(editReq as any, editRes as any);

    expect(editRes.render).toHaveBeenCalledWith("dashboard", expect.objectContaining({
      editingTask: expect.objectContaining({ input1: "hello" }),
    }));
  });
});

describe("HomeController.update", () => {
  it("redirects to / when id not found", () => {
    const req = mockReq({ params: { id: "99999" }, body: { input1: "a", input2: "b", caseType: "sensitive" } });
    const res = mockRes();

    HomeController.update(req as any, res as any);

    expect(res.redirect).toHaveBeenCalledWith("/");
  });

  it("updates an existing task and redirects", () => {
    const addReq = mockReq({ body: { input1: "old", input2: "data", caseType: "sensitive" } });
    const addRes = mockRes();
    HomeController.analyze(addReq, addRes as any);

    const [, addPayload] = (addRes.render as jest.Mock).mock.calls[0];
    const createdId = addPayload.history[0].getId();

    const updateReq = mockReq({ params: { id: String(createdId) }, body: { input1: "new", input2: "data", caseType: "non-sensitive" } });
    const updateRes = mockRes();
    HomeController.update(updateReq as any, updateRes as any);

    expect(updateRes.redirect).toHaveBeenCalledWith("/");

    const indexRes = mockRes();
    HomeController.index(mockReq(), indexRes as any);
    const [, indexPayload] = (indexRes.render as jest.Mock).mock.calls[0];
    const updated = indexPayload.history.find((t: any) => t.getId() === createdId);
    expect(updated.input1).toBe("new");
  });
});

describe("HomeController.delete", () => {
  it("removes an existing task from history", () => {
    const addReq = mockReq({ body: { input1: "todelete", input2: "x", caseType: "sensitive" } });
    const addRes = mockRes();
    HomeController.analyze(addReq, addRes as any);

    const [, addPayload] = (addRes.render as jest.Mock).mock.calls[0];
    const createdId = addPayload.history[0].getId();

    const delReq = mockReq({ params: { id: String(createdId) } });
    const delRes = mockRes();
    HomeController.delete(delReq as any, delRes as any);

    expect(delRes.redirect).toHaveBeenCalledWith("/");

    const indexRes = mockRes();
    HomeController.index(mockReq(), indexRes as any);
    const [, indexPayload] = (indexRes.render as jest.Mock).mock.calls[0];
    expect(indexPayload.history.find((t: any) => t.getId() === createdId)).toBeUndefined();
  });

  it("redirects to / even when id not found", () => {
    const req = mockReq({ params: { id: "99999" } });
    const res = mockRes();

    HomeController.delete(req as any, res as any);

    expect(res.redirect).toHaveBeenCalledWith("/");
  });
});
