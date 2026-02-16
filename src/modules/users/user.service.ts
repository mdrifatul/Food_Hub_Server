import { prisma } from "../../lib/prisma";

const getUser = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const getUserById = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const updateUser = async (
  userId: string,
  data: {
    status?: string;
    role?: string;
    phone?: string;
    image?: string;
    name?: string;
  },
) => {
  await prisma.user.findUnique({
    where: { id: userId },
  });

  const updateData = {
    ...(data.status !== undefined && { status: data.status }),
    ...(data.role !== undefined && { role: data.role }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.image !== undefined && { image: data.image }),
    ...(data.name !== undefined && { name: data.name }),
  };

  const result = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      updatedAt: true,
    },
  });
  return result;
};

export const UserService = {
  getUser,
  getUserById,
  updateUser,
};
