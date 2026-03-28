import { Router } from "express";
import { UserRole } from "../../../generated/client/enums";
import { auth } from "../../middleware/auth";
import { PaymentController } from "./payment.controller";

const router = Router();

// Create Stripe Checkout Session for an order
router.post(
  "/checkout",
  auth(UserRole.USER),
  PaymentController.createCheckoutSession,
);

export const paymentRouter: Router = router;
