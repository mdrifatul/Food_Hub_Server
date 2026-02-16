import { Router } from "express";
import { UserRole } from "../../../generated/client/enums";
import { auth } from "../../middleware/auth";
import { userController } from "./user.controller";

const router = Router();

router.get("/", auth(UserRole.ADMIN), userController.getUser);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.USER),
  userController.getUserById,
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.USER),
  userController.updateUser,
);

export const userRouter: Router = router;
