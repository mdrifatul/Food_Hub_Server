import { Router } from "express";
import { UserRole } from "../../../generated/client/enums";
import { auth } from "../../middleware/auth";
import { userController } from "./user.controller";

const router = Router();

router.get("/", auth(UserRole.ADMIN), userController.getUser);
// router.patch("/:id", auth(UserRole.ADMIN), userController.updateUser);
export const userRouter: Router = router;
