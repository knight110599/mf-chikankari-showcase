import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import orderRoutes from "./order.routes.js";
import productRoutes from "./product.routes.js";
import uploadRoutes from "./upload.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/categories", categoryRoutes);
apiRouter.use("/products", productRoutes);
apiRouter.use("/orders", orderRoutes);
apiRouter.use("/upload", uploadRoutes);

export default apiRouter;