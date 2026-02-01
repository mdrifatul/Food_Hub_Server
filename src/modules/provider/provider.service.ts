import { prisma } from "../../lib/prisma";

const createProviderProfile = async (data: {
  authorId: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  description?: string;
}) => {
  const newProvider = await prisma.providerProfile.create({ data });
  return newProvider;
};

const getProvierById = async (id: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
  });
  return provider;
};

export const providerService = {
  createProviderProfile,
  getProvierById,
};
