import { Router } from "express";
import { uploadProductImage } from "../controllers/upload.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/test", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Upload router is working.",
  });
});

router.post("/image", upload.single("image"), uploadProductImage);

export default router;