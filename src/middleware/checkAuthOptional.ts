import { NextFunction, Request, Response } from "express";

import { auth as betterAuth } from "./../lib/auth";

export const checkAuthOptional = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });

    if (session) {
      req.user = session.user;
    }
  } catch (error) {
    // Ignore errors for optional auth
  }
  next();
};
