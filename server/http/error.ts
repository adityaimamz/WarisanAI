import type { Response } from "express";

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const handleError = (res: Response, error: unknown, message: string) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  const safeError = error instanceof Error
    ? { name: error.name, message: error.message, ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}) }
    : { message: String(error) };
  console.error(message, safeError);
  res.status(500).json({ error: message });
};
