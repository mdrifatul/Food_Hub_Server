import { Meal } from "../../../generated/client/client";
import { prisma } from "../../lib/prisma";

const createMeal = async (
  data: Omit<Meal, "id" | "createdAt" | "updatedAt">,
  userId: string,
) => {
  const result = await prisma.meal.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllMeal = async () => {
  const result = await prisma.meal.findMany();
  return result;
};

const getMealById = async (id: string) => {
  const result = await prisma.meal.findUnique({
    where: { id },
  });
  return result;
};

export const mealService = {
  createMeal,
  getAllMeal,
  getMealById,
};
