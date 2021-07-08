import { NextFunction, Request, Response } from "express";
//	Importing multer and path resources
import multer from "multer";
import path from "path";

export async function roomUpload(req: Request, res: Response, next: NextFunction) {
	multer({
		storage: multer.diskStorage({
			destination: path.resolve(__dirname, "..", "..", "public", "rooms"),
			filename: (_req, file, callback) => {
				const ext = path.extname(file.originalname);

				const mimeType = (file.mimetype) ? file.mimetype?.split("/")[0] : null;

				if(!mimeType || !mimeType.length || (mimeType !== "image")) {
					return res.status(400).send("Invalid image type!");
				} else {
					return callback(null, `room-${Date.now()}${ext}`);
				}
			}
		})
	}).single("image")(req, res, next);
}

export async function userUpload(req: Request, res: Response, next: NextFunction) {
	multer({
		storage: multer.diskStorage({
			destination: path.resolve(__dirname, "..", "..", "public", "users"),
			filename: (_req, file, callback) => {
				const ext = path.extname(file.originalname);

				const mimeType = (file.mimetype) ? file.mimetype?.split("/")[0] : null;

				if(!mimeType || !mimeType.length || (mimeType !== "image")) {
					return res.status(400).send("Invalid image type!");
				} else {
					return callback(null, `user-${Date.now()}${ext}`);
				}
			}
		})
	}).single("image")(req, res, next);
}
