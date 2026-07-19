import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  categoryIdSchema,
  categoryQuerySchema,
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema.js";

const categoryRouter = Router();

categoryRouter.get(
  "/",
  validate(categoryQuerySchema),
  categoryController.list,
);

categoryRouter.get(
  "/:id",
  validate(categoryIdSchema),
  categoryController.getById,
);

categoryRouter.post(
  "/",
  protect,
  authorize("ADMIN"),
  validate(createCategorySchema),
  categoryController.create,
);

categoryRouter.patch(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(updateCategorySchema),
  categoryController.update,
);

categoryRouter.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  validate(categoryIdSchema),
  categoryController.remove,
);

export default categoryRouter;