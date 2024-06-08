import path from "path";
import { Router } from "express";
import multer from "multer";
import sizeOf from "image-size";
import fs, { existsSync, mkdirSync } from "fs";

const router = Router();

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
}

// we want to store the images locally on the server(as opposed to S3)
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      // Synchronously create the directory 'api/uploads', if it doesn't exist
      "api/uploads".split("/").reduce((directories, directory) => {
        directories += `${directory}/`;
        if (!fs.existsSync(directories)) {
          fs.mkdirSync(directories);
        }
        return directories;
      }, "");

      cb(null, "api/uploads/");
    },
    filename(req, file, cb) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  }),
  fileFilter,
});

const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, function (err) {
    // dont accept uploaded images if not certain dimensions
    // this way we keep consistent view of our products
    if (req.file) {
      const dimensions = sizeOf(req.file.path);
      if (dimensions.width !== 1200 || dimensions.height !== 600)
        return fs.unlink(req.file.path, function () {
          res.status(400).send({ message: "Image should be 1200 X 600" });
        });
    }

    if (err) {
      return res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: "Image uploaded successfully",
      image: `/${req.file.path}`,
    });
  });
});

export default router;
