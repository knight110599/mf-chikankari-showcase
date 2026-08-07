import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  adjustStockSchema,
  createVariantSchema,
  productIdSchema,
  restockSchema,
  updateVariantSchema,
} from "../schemas/inventory.schema.js";

const inventoryRouter = Router();

inventoryRouter.use(
  protect,
  authorize("ADMIN"),
);

inventoryRouter.get(
  "/",
  inventoryController.list,
);

inventoryRouter.get(
  "/products/:productId",
  validate(productIdSchema),
  inventoryController.getByProductId,
);

inventoryRouter.get(
  "/products/:productId/history",
  validate(productIdSchema),
  inventoryController.getHistory,
);

inventoryRouter.post(
  "/products/:productId/variants",
  validate(createVariantSchema),
  inventoryController.createVariant,
);

inventoryRouter.patch(
  "/variants/:variantId",
  validate(updateVariantSchema),
  inventoryController.updateVariant,
);

inventoryRouter.post(
  "/variants/:variantId/restock",
  validate(restockSchema),
  inventoryController.restockVariant,
);

inventoryRouter.post(
  "/variants/:variantId/adjust",
  validate(adjustStockSchema),
  inventoryController.adjustVariantStock,
);

export default inventoryRouter;