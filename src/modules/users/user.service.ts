import { prisma } from "../../lib/prisma";

const getUser = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const updateUser = async (userId: string, status?: string,role?:string) => {
  await prisma.user.findUnique({
    where: { id: userId },
  });

  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(status !== undefined && { status }),
      ...(role !== undefined && { role }),
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });
  return result;
};

export const UserService = {
  getUser,
  updateUser,
};
