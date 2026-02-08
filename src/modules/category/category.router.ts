import { Router } from "express";
import { categoryController } from "./category.controller";


import { UserRole } from "../../../generated/client/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/",auth(UserRole.ADMIN), categoryController.createCategory);
router.get("/",auth(UserRole.ADMIN,UserRole.PROVIDER,UserRole.USER), categoryController.getAllCategories);
router.delete("/:id",auth(UserRole.ADMIN), categoryController.deleteCategory);

export const categoryRouter: Router = router;
