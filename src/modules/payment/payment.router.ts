import { Router } from "express";
import { UserRole } from "../../../generated/client/enums";
import { auth } from "../../middleware/auth";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create-checkout-session",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.PROVIDER),
  PaymentController.createCheckoutSession,
);

export const paymentRouter: Router = router;
