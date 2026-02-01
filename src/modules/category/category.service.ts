import slugify from "slugify";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: { name: string; slug: string }) => {
  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  const result = await prisma.category.create({
    data: {
      name: payload.name,
      slug: slug,
    },
  });
  return result;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

export const categoryService = {
  createCategory,
  getAllCategories,
};
