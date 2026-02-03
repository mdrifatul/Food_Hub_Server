import { OrderStatus, PaymentMethod } from "../../../generated/client/enums";
import { prisma } from "../../lib/prisma";

const createOrder = async ({
  authorId,
  deliveryAddress,
  paymentMethod,
  items,
}: {
  authorId: string;
  deliveryAddress: string;
  paymentMethod?: PaymentMethod;
  items: {
    mealId: string;
    quantity: number;
  }[];
}) => {
  const mealIds = items.map((item) => item.mealId);

  const meals = await prisma.meal.findMany({
    where: {
      id: { in: mealIds },
      isAvailable: true,
    },
  });

  let totalPrice = 0;
  const orderItemsData = items.map((item) => {
    const meal = meals.find((m) => m.id === item.mealId);
    if (!meal) {
      throw new Error(`Meal ID ${item.mealId} is not available`);
    }
    const itemTotal = meal.price * item.quantity;
    totalPrice += itemTotal;

    return {
      mealId: item.mealId,
      quantity: item.quantity,
      price: meal.price,
    };
  });

  const order = await prisma.order.create({
    data: {
      authorId,
      deliveryAddress,
      ...(paymentMethod && { paymentMethod }),
      totalPrice,
      status: OrderStatus.PENDING,
      items: {
        create: orderItemsData,
      },
    },
    include: {
      items: {
        include: {
          meal: {
            select: {
              authorId: true,
              title: true,
              imageUrl: true,
              cuisine: true,
            },
          },
        },
      },
    },
  });

  return order;
};

const getUserOrders = async (authorId: string) => {
  const orders = await prisma.order.findMany({
    where: { authorId },
    include: {
      items: {
        include: {
          meal: {
            select: {
              title: true,
              imageUrl: true,
              cuisine: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};

const getOrderById = async (orderId: string, authorId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      authorId,
    },
    include: {
      items: {
        include: {
          meal: {
            select: {
              authorId: true,
              title: true,
              imageUrl: true,
              cuisine: true,
            },
          },
        },
      },
    },
  });

  return order;
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: {
      items: {
        include: {
          meal: {
            select: {
              authorId: true,
            },
          },
        },
      },
    },
  });
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  return order;
};

export const OrderService = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
};
