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

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const { status,role } = req.body;
    const result = await UserService.updateUser(id as string, status,role);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getUser,
  updateUser,
};
