import { Router } from "express";

import * as userController from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  listUsersSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "../schemas/user.schema.js";

const userRouter = Router();

userRouter.use(
  protect,
  authorize("ADMIN"),
);

userRouter.get(
  "/",
  validate(listUsersSchema),
  userController.list,
);

userRouter.get(
  "/:userId",
  userController.getById,
);

userRouter.patch(
  "/:userId/status",
  validate(updateUserStatusSchema),
  userController.updateStatus,
);

userRouter.patch(
  "/:userId/role",
  validate(updateUserRoleSchema),
  userController.updateRole,
);

export default userRouter;