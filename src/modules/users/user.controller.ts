import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.getUser();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// const updateUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const isAdmin = req.user?.role === UserRole.ADMIN;
//     if (!isAdmin) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     const { id } = req.params;
//     const { status } = req.body;
//     const result = await UserService.updateUser(id as string, status);
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

export const userController = {
  getUser,
  // updateUser,
};
