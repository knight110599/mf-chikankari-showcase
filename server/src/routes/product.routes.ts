import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createProductSchema,
  productIdSchema,
  productQuerySchema,
  productSlugSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";

const productRouter = Router();

productRouter.get(
  "/",
  validate(productQuerySchema),
  productController.list,
);

productRouter.get(
  "/featured",
  productController.featured,
);

productRouter.get(
  "/new-arrivals",
  productController.newArrivals,
);

productRouter.get(
  "/slug/:slug",
  validate(productSlugSchema),
  productController.getBySlug,
);

productRouter.get(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(productIdSchema),
  productController.getById,
);

productRouter.post(
  "/",
  protect,
  authorize("ADMIN"),
  validate(createProductSchema),
  productController.create,
);

productRouter.patch(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(updateProductSchema),
  productController.update,
);

productRouter.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(productIdSchema),
  productController.remove,
);

export default productRouter;