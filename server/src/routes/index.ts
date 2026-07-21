import { Router } from "express";
import authRouter from "./auth.routes";
import categoryRouter from "./category.routes";
import productRouter from "./product.routes";
import uploadRouter from "./upload.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/upload", uploadRouter);

export default apiRouter;