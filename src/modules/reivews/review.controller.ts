import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { rating, comment, mealId } = req.body;
    const userId = req.user.id;

    const result = await reviewService.createReview({
      rating,
      comment,
      mealId,
      authorId: userId as string,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getReviewsByMeal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { mealId } = req.params;
    const result = await reviewService.getReviewsByMeal(mealId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await reviewService.getAllReviews();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const ReviewController = {
  createReview,
  getReviewsByMeal,
  getAllReviews,
};
