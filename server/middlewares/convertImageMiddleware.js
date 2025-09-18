import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function convertImagesToWebP(req, res, next) {
  if (!req.files) return next();

  try {
    for (let file of req.files) {
      const outputPath = file.path.replace(/\.[^/.]+$/, ".webp");
      await sharp(file.path)
        .resize(1080)
        .webp({ quality: 70 })
        .toFile(outputPath);

      fs.unlinkSync(file.path); 
      file.filename = path.basename(outputPath); 
      file.path = outputPath;
    }
    next();
  } catch (error) {
    console.error("Error converting image", error);
    res.status(500).json({ error: "Error converting photo" });
  }
}
