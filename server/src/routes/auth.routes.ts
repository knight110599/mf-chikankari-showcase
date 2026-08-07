import { Router } from "express";
import cookieParser from "cookie-parser";
import * as authController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rate-limit.middleware.js";
import { requireTrustedOrigin } from "../middlewares/csrf.middleware.js";
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
  cookieParser(),
  requireTrustedOrigin,
  authController.refresh,
);

authRouter.post(
  "/logout",
  cookieParser(),
  requireTrustedOrigin,
  authController.logout,
);

authRouter.get(
  "/me",
  protect,
  authController.me,
);

authRouter.post(
  "/logout-all",
  protect,
  authController.logoutAll,
);

export default authRouter;