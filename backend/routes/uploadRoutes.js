import path from "path";
import { Router } from "express";
import multer from "multer";
import sharp from "sharp";

const router = Router();

function checkFileTypes(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

// we want to store the images locally on the server(as opposed to S3)
const upload = multer({
  storage: multer.diskStorage({
    destination(req,file,cb){
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  }),
});

router.route("/").post(upload.single("image"), (req, res) => {

  res.send({
    message: "Image uploaded",
    image: `/${req.file.path}`,
  });
});

export default router;
