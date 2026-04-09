import { prisma } from "../../lib/prisma";

const createReview = async ({
  rating,
  comment,
  mealId,
  authorId,
}: {
  rating: number;
  comment?: string;
  mealId: string;
  authorId: string;
}) => {
  const review = await prisma.review.create({
    data: {
      rating,
      comment: comment || null,
      mealId,
      authorId,
    },
    include: {
      meal: {
        select: {
          title: true,
        },
      },
    },
  });

  return review;
};

const getReviewsByMeal = async (mealId: string) => {
  const reviews = await prisma.review.findMany({
    where: { mealId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      meal: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

export const reviewService = {
  createReview,
  getReviewsByMeal,
  getAllReviews,
};
