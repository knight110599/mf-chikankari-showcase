import { Router } from "express";

import * as wholesaleController from "../controllers/wholesale.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createWholesaleApplicationSchema,
  listWholesaleApplicationsSchema,
  reviewWholesaleApplicationSchema,
} from "../schemas/wholesale.schema.js";

const wholesaleRouter = Router();

wholesaleRouter.post(
  "/apply",
  protect,
  authorize("CUSTOMER"),
  validate(createWholesaleApplicationSchema),
  wholesaleController.apply,
);

wholesaleRouter.get(
  "/me",
  protect,
  wholesaleController.getMine,
);

wholesaleRouter.get(
  "/admin/applications",
  protect,
  authorize("ADMIN"),
  validate(listWholesaleApplicationsSchema),
  wholesaleController.list,
);

wholesaleRouter.get(
  "/admin/applications/:applicationId",
  protect,
  authorize("ADMIN"),
  wholesaleController.getById,
);

wholesaleRouter.patch(
  "/admin/applications/:applicationId/review",
  protect,
  authorize("ADMIN"),
  validate(reviewWholesaleApplicationSchema),
  wholesaleController.review,
);

export default wholesaleRouter;