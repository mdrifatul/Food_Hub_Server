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
    const { cuisine, dietaryPreferences, minPrice, maxPrice } = req.query;
    const cuisineType = cuisine as string | undefined;
    const parsedDietaryPreferences = dietaryPreferences
      ? (dietaryPreferences as string).split(",")
      : [];

    const minPriceNumber = minPrice ? Number(minPrice) : undefined;
    const maxPriceNumber = maxPrice ? Number(maxPrice) : undefined;

    const result = await mealService.getAllMeal({
      cuisine: cuisineType,
      dietaryPreferences: parsedDietaryPreferences,
      minPrice: minPriceNumber,
      maxPrice: maxPriceNumber,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// const getMealById = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params;
//     const result = await mealService.getMealById(id as string);
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// const getMyMeal = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     if (!req.user) {
//       return res.status(400).json({
//         error: "Unauthorize!",
//       });
//     }
//     const result = await mealService.getMyMeal(req.user.id);
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateMeal = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     if (!req.user) {
//       return res.status(400).json({
//         error: "You are Unauthorize!",
//       });
//     }
//     const { id } = req.params;
//     const isProvider = UserRole.PROVIDER === req.user.role;
//     const result = await mealService.updateMeal(
//       id as string,
//       req.body,
//       req.user.id,
//       isProvider,
//     );
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteMeal = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     if (!req.user) {
//       return res.status(400).json({
//         error: "You are Unauthorize!",
//       });
//     }
//     const { id } = req.params;
//     const isProvider = UserRole.PROVIDER === req.user.role;
//     const result = await mealService.deleteMeal(
//       id as string,
//       req.user.id,
//       isProvider,
//     );
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

export const mealController = {
  createMeal,
  getAllMeal,
  // getMealById,
  // getMyMeal,
  // updateMeal,
  // deleteMeal,
};
