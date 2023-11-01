import type { Response } from "express";

export abstract class Controller {
  protected async sendSuccess<T>(
    res: Response,
    data: T,
    message?: string,
    status?: number
  ) {
    return res.status(status || 200).json({
      message: message || "success",
      data: data,
    });
  }

  protected async sendError(res: Response, message?: string, status?: number) {
    return res.status(status || 500).json({
      message: message || "Internal Server Error.",
    });
  }
}
