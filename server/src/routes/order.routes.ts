import { Router } from "express";
import * as orderController from "../controllers/order.controller.js";
import {
  optionalProtect,
  protect,
} from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createOrderSchema,
  orderIdSchema,
  orderQuerySchema,
  updateOrderStatusSchema,
} from "../schemas/order.schema.js";

const orderRouter = Router();

orderRouter.post(
  "/",
  optionalProtect,
  validate(createOrderSchema),
  orderController.create,
);

orderRouter.get(
  "/",
  protect,
  authorize("ADMIN"),
  validate(orderQuerySchema),
  orderController.list,
);

orderRouter.get(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(orderIdSchema),
  orderController.getById,
);

orderRouter.patch(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  validate(updateOrderStatusSchema),
  orderController.updateStatus,
);

export default orderRouter;