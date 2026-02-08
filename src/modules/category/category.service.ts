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
const deleteCategory = async (id: string) => {

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Category not found");
  }
  const result = await prisma.category.delete({
    where: { id },
  });

  return result;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  deleteCategory,
};
