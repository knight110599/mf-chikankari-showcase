import { Router } from "express";
import cookieParser from "cookie-parser";

import * as authController from "../controllers/auth.controller.js";
import { doubleCsrfProtection } from "../lib/csrf.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireTrustedOrigin } from "../middlewares/csrf.middleware.js";
import { authLimiter } from "../middlewares/rate-limit.middleware.js";

const authRouter = Router();

const parseCookies = cookieParser();

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

authRouter.get(
  "/csrf-token",
  parseCookies,
  authController.csrfToken,
);

authRouter.post(
  "/refresh",
  authLimiter,
  parseCookies,
  requireTrustedOrigin,
  doubleCsrfProtection,
  authController.refresh,
);

authRouter.post(
  "/logout",
  parseCookies,
  requireTrustedOrigin,
  doubleCsrfProtection,
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