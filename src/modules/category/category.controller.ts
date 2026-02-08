import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id as string);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const categoryController = {
  createCategory,
  getAllCategories,
  deleteCategory,
};
