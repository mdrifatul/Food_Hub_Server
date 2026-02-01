import { NextFunction, Request, Response } from "express";

import { UserRole } from "../../generated/client/enums";
import { auth as betterAuth } from "./../lib/auth";

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorize!",
      });
    }
    // if (!session.user.emailVerified) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Email verification required. Please verify you email!",
    //   });
    // }
    req.user = session.user;
    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorize to access this resource!",
      });
    }
    next();
  };
};
export { auth };
