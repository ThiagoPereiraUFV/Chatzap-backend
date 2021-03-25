//	Importing multer and path resources
import multer from "multer";
import path from "path";

export const contactUpload = multer({
	storage: multer.diskStorage({
		destination: path.resolve(__dirname, "..", "..", "public", "contacts"),
		filename: (req, file, cb) => {
			const ext = path.extname(file.originalname);

			cb(null, `contact-${Date.now()}${ext}`);
		}
	}),
}).single("image");

export const userUpload = multer({
	storage: multer.diskStorage({
		destination: path.resolve(__dirname, "..", "..", "public", "users"),
		filename: (req, file, cb) => {
			const ext = path.extname(file.originalname);

			cb(null, `user-${Date.now()}${ext}`);
		}
	})
}).single("image");