import { Router } from "express";
import { UserRole } from "../../../generated/client/enums";
import { auth } from "../../middleware/auth";
import { mealController } from "./meal.controller";

const router = Router();

router.get("/", mealController.getAllMeal);
router.get("/:id", mealController.getMealById);
router.get(
  "/provider/my-posts",
  auth(UserRole.PROVIDER),
  mealController.getMyMeal,
);
router.post("/", auth(UserRole.PROVIDER), mealController.createMeal);
router.patch("/:id", auth(UserRole.PROVIDER), mealController.updateMeal);
// router.delete("/:id", auth(UserRole.PROVIDER), mealController.deleteMeal);

export const mealRouter: Router = router;
