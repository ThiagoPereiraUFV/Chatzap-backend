//	Importing express and passport resources
import { NextFunction, Request, Response } from "express";

import { authenticate } from "passport";
import { passportJwt } from "../config/passport";

//	Importing User type
import { User } from "../models/interfaces/User";

export async function authJWT(req: Request, res: Response, next: NextFunction) {
	return await authenticate(passportJwt, (error, user: User, info) => {
		if(info) {
			return res.status(401).json({ error: "Invalid token!" });
		} else if(!user) {
			return res.status(404).json({ error: "User not found!" });
		} else {
			req.body.user = user;

			return next();
		}
	})(req, res, next);
}
