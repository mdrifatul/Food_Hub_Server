import { Router } from "express";
import { UserRole } from "../../../generated/client/enums";
import { auth } from "../../middleware/auth";
import { orderController } from "./order.controller";

const router = Router();

router.post("/", auth(UserRole.USER), orderController.createOrder);
router.get("/", auth(UserRole.USER), orderController.getUserOrders);
router.get("/:id", auth(UserRole.USER), orderController.getOrderById);
router.patch(
  "/:id",
  auth(UserRole.PROVIDER),
  orderController.updateOrderStatus,
);

export const orderRouter: Router = router;
