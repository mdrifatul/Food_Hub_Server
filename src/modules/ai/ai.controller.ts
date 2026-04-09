import { NextFunction, Request, Response } from "express";
import { AIService } from "./ai.service";

const getSearchSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = req.query.q as string;
    const result = await AIService.getSearchSuggestions(query);

    res.status(200).json({
      success: true,
      message: "AI Search suggestions retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const result = await AIService.getRecommendations(userId);

    res.status(200).json({
      success: true,
      message: "AI Recommendations retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const chatAssistant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res
        .status(400)
        .json({ error: "Message is required to chat with AI" });
    }

    const result = await AIService.chatWithAssistant(message);

    res.status(200).json({
      success: true,
      message: "Chat successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getTrending = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AIService.getTrending();

    res.status(200).json({
      success: true,
      message: "AI Trending meals retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AIController = {
  getSearchSuggestions,
  getRecommendations,
  getTrending,
  chatAssistant,
};
