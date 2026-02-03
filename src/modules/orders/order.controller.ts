import { NextFunction, Request, Response } from "express";
import { PaymentMethod } from "../../../generated/client/client";
import { OrderService } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login for order" });
    }

    const { deliveryAddress, paymentMethod, items } = req.body;

    const result = await OrderService.createOrder({
      authorId: req.user.id,
      deliveryAddress,
      paymentMethod: paymentMethod || PaymentMethod.COD,
      items,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Please login for get your orders" });
    }

    const result = await OrderService.getUserOrders(req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    const result = await OrderService.getOrderById(id as string, req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const result = await OrderService.updateOrderStatus(id as string, status);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const orderController = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
};
