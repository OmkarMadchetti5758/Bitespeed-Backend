import { Request, Response, NextFunction } from "express";

export const validateIdentifyRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    res.status(400).json({
      error: "At least one of email or phoneNumber is required",
    });
    return;
  }

  next();
};
