import { NextFunction, Request, Response } from "express";
import { providerService } from "./provider.service";

const createProviderProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await providerService.createProviderProfile(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getProviderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await providerService.getProvierById(id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const providerController = {
  createProviderProfile,
  getProviderById,
};
