import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { categoryRouter } from "./modules/category/category.router";
import { mealRouter } from "./modules/meals/meal.router";
import { orderRouter } from "./modules/orders/order.router";
import { PaymentController } from "./modules/payment/payment.controller";
import { paymentRouter } from "./modules/payment/payment.router";
import { providerRouter } from "./modules/provider/provider.router";
import { ReviewRouter } from "./modules/reivews/review.router";
import { userRouter } from "./modules/users/user.router";

const app: Application = express();

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent,
);

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/meals", mealRouter);
app.use("/api/providers", providerRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/payments", paymentRouter);

app.get("/", (req, res) => {
  res.send("Food Hub API is running");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
