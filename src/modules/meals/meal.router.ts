import { Router } from "express";
import { auth, userRole } from "../../middleware/auth";
import { mealController } from "./meal.controller";

const router = Router();

router.post("/", auth(userRole.USER), mealController.createMeal);
router.get("/", mealController.getAllMeal);
router.get("/:id", mealController.getMealById);

export const mealRouter: Router = router;
