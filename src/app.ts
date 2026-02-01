import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import { categoryRouter } from "./modules/category/category.router";
import { mealRouter } from "./modules/meals/meal.router";
import { providerRouter } from "./modules/provider/provider.router";

const app: Application = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/meals", mealRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/providers", providerRouter);

app.get("/", (req, res) => {
  res.send("Food Hub API is running");
});

export default app;
