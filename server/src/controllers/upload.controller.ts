import type { Request, Response } from "express";
import { cloudinary } from "../lib/cloudinary.js";

export async function uploadProductImage(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: "Please select an image to upload.",
    });
    return;
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "mf-chikankari/products",
      resource_type: "image",
      transformation: [
        {
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    },
    (error, result) => {
      if (error || !result) {
        res.status(500).json({
          success: false,
          message: "Image upload failed.",
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Image uploaded successfully.",
        image: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        },
      });
    },
  );

  uploadStream.end(req.file.buffer);
}