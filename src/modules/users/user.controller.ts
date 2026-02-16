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

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await UserService.getUserById(id as string);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isUser = req?.user;
    if (!isUser) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const { status, role, phone, image, name } = req.body;
    const result = await UserService.updateUser(id as string, {
      status,
      role,
      phone,
      image,
      name,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getUser,
  getUserById,
  updateUser,
};
