import { NextFunction, Request, Response } from "express";
import { mealService } from "./meal.service";

const createMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorize!",
      });
    }
    const result = await mealService.createMeal(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await mealService.getAllMeal();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMealById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await mealService.getMealById(id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const mealController = {
  createMeal,
  getAllMeal,
  getMealById,
};
