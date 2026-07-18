import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rate-limit.middleware.js";
const authRouter = Router();

authRouter.post(
  "/register",
  authLimiter,
  authController.register,
);

authRouter.post(
  "/login",
  authLimiter,
  authController.login,
);

authRouter.post(
  "/refresh",
  authLimiter,
  authController.refresh,
);
authRouter.get("/me", protect, authController.me);
authRouter.post("/logout", authController.logout);

authRouter.post(
  "/logout-all",
  protect,
  authController.logoutAll,
);

export default authRouter;