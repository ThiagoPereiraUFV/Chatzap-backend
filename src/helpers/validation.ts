//  Importing express and mongoose resources
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

//	Importing Users repository
import UsersRepository from "../repositories/UsersRepository";

//	Importing helpers
import { deleteFile } from "../helpers/deleteFile";
import { userUploads, roomUploads } from "../helpers/paths";

export default {
	async createSession(req: Request, res: Response, next: NextFunction) {
		const { phone, password } = req.body;
		const errors: string[] = [];

		if(!phone || !phone.length) {
			errors.push("Invalid phone!");
		}

		if(!password || !password.length) {
			errors.push("Invalid password!");
		}

		if(errors.length) {
			return res.status(400).json({ errors: errors });
		} else {
			return next();
		}
	},
	async createUser(req: Request, res: Response, next: NextFunction) {
		const { name, phone, password, passwordC } = req.body;
		const errors: string[] = [];

		if(!name || !name.length) {
			errors.push("Invalid name!");
		}

		if(!phone || !phone.length) {
			errors.push("Invalid phone!");
		}

		if(!password || !password.length) {
			errors.push("Invalid password!");
		}

		if(!passwordC || !passwordC.length) {
			errors.push("Invalid password confirmation!");
		}

		if(password !== passwordC) {
			errors.push("The passwords don't match, try again!");
		}

		if(errors.length) {
			return res.status(400).json({ errors: errors });
		} else {
			return next();
		}
	},
	async updateUser(req: Request, res: Response, next: NextFunction) {
		const userId = req.headers.authorization;
		const { name, phone } = req.body;
		const errors: string[] = [];

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			errors.push("Invalid id!");
		}

		if(!name || !name.length) {
			errors.push("Invalid name!");
		}

		if(!phone || !phone.length) {
			errors.push("Invalid phone!");
		}

		if(errors.length) {
			return res.status(400).json({ errors: errors });
		} else {
			return next();
		}
	},
	async updateUserImage(req: Request, res: Response, next: NextFunction) {
		const userId = req.headers.authorization;
		const filename = (req.file) ? req.file.filename : null;
    const errors = [];

    //	Checking if the upload is really an image
    if(filename) {
      const mimeType = (req.file.mimetype) ? req.file.mimetype.split("/")[0] : null;

      if(!mimeType || !mimeType.length || (mimeType != "image")) {
        errors.push("Invalid image type!");
      }
    } else {
			errors.push("Invalid image!");
		}

		if(!userId || !userId.length || !mongoose.Types.ObjectId.isValid(userId)) {
			errors.push("Invalid id!");
		}

		if(errors.length) {
			if(filename) {
				deleteFile(userUploads(filename));
			}

			return res.status(400).send({ errors: errors });
		} else {
			return next();
		}
	},
	async deleteUser(req: Request, res: Response, next: NextFunction) {
		const { password } = req.headers;
		const userId = req.headers.authorization;
		const errors: string[] = [];

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			errors.push("Invalid id!");
		}

		if(!password || !password.length) {
			errors.push("Invalid password!");
		}

		if(errors.length) {
			return res.status(400).json({ errors: errors });
		} else {
			return next();
		}
	},
	async createRoom(req: Request, res: Response, next: NextFunction) {
		const userId = req.headers.authorization;
		const { name } = req.body;
		const errors: string[] = [];

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			errors.push("Invalid id!");
		} else if(!(await UsersRepository.findById(userId))) {
			errors.push("User not found!");
		}

		if(!name || !name.length) {
			errors.push("Invalid name!");
		}

		if(errors.length) {
			return res.status(400).json({ errors: errors });
		} else {
			return next();
		}
	},
	async updateRoom(req: Request, res: Response, next: NextFunction) {
		const userId = req.headers.authorization;
		const roomId = req.params.id;
		const { name } = req.body;
		const errors: string[] = [];

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			errors.push("Invalid id!");
		}

		if(!roomId || !roomId.length || !mongoose.isValidObjectId(roomId)) {
			errors.push("Invalid id!");
		}

		if(!name || !name.length ) {
			errors.push("Invalid name!");
		}

		if(errors.length) {
			return res.status(400).json({ errors: errors });
		} else {
			return next();
		}
	},
	async updateRoomImage(req: Request, res: Response, next: NextFunction) {
		const userId = req.headers.authorization;
		const roomId = req.params.id;
		const filename = (req.file) ? req.file.filename : null;
    const errors = [];

    //	Checking if the upload is really an image
    if(filename) {
      const mimeType = (req.file.mimetype) ? req.file.mimetype.split("/")[0] : null;

      if(!mimeType || !mimeType.length || (mimeType != "image")) {
        errors.push("Invalid image type!");
      }
    } else {
			errors.push("Invalid image!");
		}

		if(!userId || !userId.length || !mongoose.Types.ObjectId.isValid(userId)) {
			errors.push("Invalid id!");
		}

		if(!roomId || !roomId.length || !mongoose.Types.ObjectId.isValid(roomId)) {
			errors.push("Invalid id!");
		}

		if(errors.length) {
			if(filename) {
				deleteFile(roomUploads(filename));
			}

			return res.status(400).send({ errors: errors });
		} else {
			return next();
		}
	},
	async deleteRoom(req: Request, res: Response, next: NextFunction) {
		const userId = req.headers.authorization;
		const roomId = req.params.id;
		const errors: string[] = [];

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			errors.push("Invalid id!");
		}

		if(!roomId || !roomId.length || !mongoose.isValidObjectId(roomId)) {
			errors.push("Invalid id!");
		}

		if(errors.length) {
			return res.status(400).json({ errors: errors });
		} else {
			return next();
		}
	},
	async searchRoom(req: Request, res: Response, next: NextFunction) {
		const userId = req.headers.authorization;
		const query = req.query.q;
		const errors: string[] = [];

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			errors.push("Invalid id!");
		}

		if(!query || !query.length) {
			errors.push("Invalid search!");
		}

		if(errors.length) {
			return res.status(400).json({ errors: errors });
		} else {
			return next();
		}
	},
	async createUserRoom(req: Request, res: Response, next: NextFunction) {
		const userId = req.headers.authorization;
		const roomId = req.params.id;
		const errors: string[] = [];

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			errors.push("Invalid id!");
		}

		if(!roomId || !roomId.length || !mongoose.isValidObjectId(roomId)) {
			errors.push("Invalid id!");
		}

		if(errors.length) {
			return res.status(400).json({ errors: errors });
		} else {
			return next();
		}
	},
	async deleteUserRoom(req: Request, res: Response, next: NextFunction) {
		const userId = req.headers.authorization;
		const roomId = req.params.id;
		const errors: string[] = [];

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			errors.push("Invalid id!");
		}

		if(!roomId || !roomId.length || !mongoose.isValidObjectId(roomId)) {
			errors.push("Invalid id!");
		}

		if(errors.length) {
			return res.status(400).json({ errors: errors });
		} else {
			return next();
		}
	}
};