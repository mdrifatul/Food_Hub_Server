import express from "express";
import { checkAuthOptional } from "../../middleware/checkAuthOptional";
import { AIController } from "./ai.controller";

const router = express.Router();

router.get(
  "/recommendations",
  checkAuthOptional,
  AIController.getRecommendations,
);

router.get("/search-suggestions", AIController.getSearchSuggestions);

router.get("/trending", AIController.getTrending);

router.post("/chat", AIController.chatAssistant);

export const aiRouter: express.Router = router;
