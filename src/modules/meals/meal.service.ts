import { Meal } from "../../../generated/client/client";
import { MealWhereInput } from "../../../generated/client/models";
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

const getAllMeal = async ({
  cuisine,
  dietaryPreferences,
  minPrice,
  maxPrice,
}: {
  cuisine?: string | undefined;
  dietaryPreferences?: string[];
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
}) => {
  const addContition: MealWhereInput[] = [];

  if (cuisine) {
    addContition.push({ cuisine });
  }
  if (dietaryPreferences && dietaryPreferences.length > 0) {
    addContition.push({ dietaryPreferences: { hasSome: dietaryPreferences } });
  }
  if (minPrice !== undefined && maxPrice !== undefined) {
    addContition.push({ price: { gte: minPrice, lte: maxPrice } });
  }

  const result = await prisma.meal.findMany({
    where: {
      AND: addContition,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

// const getMealById = async (id: string) => {
//   const result = await prisma.meal.findUnique({
//     where: { id },
//   });
//   return result;
// };

// const getMyMeal = async (authorId: string) => {
//   await prisma.user.findUniqueOrThrow({
//     where: {
//       id: authorId,
//       status: UserStatus.ACTIVE,
//     },
//     select: {
//       id: true,
//     },
//   });

//   const result = await prisma.meal.findMany({
//     where: {
//       authorId,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
//   return result;
// };

// const updateMeal = async (
//   mealId: string,
//   data: Partial<Meal>,
//   authorId: string,
//   isProvider: boolean,
// ) => {
//   const existingMeal = await prisma.meal.findUniqueOrThrow({
//     where: { id: mealId },
//     select: { id: true, authorId: true },
//   });
//   if (isProvider && existingMeal.authorId !== authorId) {
//     throw new Error("You are not authorized to update this meal");
//   }
//   const result = await prisma.meal.update({
//     where: { id: mealId },
//     data,
//   });
//   return result;
// };

// const deleteMeal = async (
//   mealId: string,
//   authorId: string,
//   isProvider: boolean,
// ) => {
//   const existingMeal = await prisma.meal.findUniqueOrThrow({
//     where: { id: mealId },
//     select: { id: true, authorId: true },
//   });
//   if (isProvider && existingMeal.authorId !== authorId) {
//     throw new Error("You are not authorized to delete this meal");
//   }
//   const result = await prisma.meal.delete({
//     where: { id: mealId },
//   });
//   return result;
// };

export const mealService = {
  createMeal,
  getAllMeal,
  // getMealById,
  // getMyMeal,
  // updateMeal,
  // deleteMeal,
};
