//	Importing express resources
import { NextFunction, Request, Response } from "express";

import { authenticate } from "passport";
import { User } from "../models/interfaces/User";
import { passportJwt } from "../config/passport";

export async function authJWT(req: Request, res: Response, next: NextFunction) {
	authenticate(passportJwt, (error, user: User, info) => {
		if(info) {
			return res.status(401).send("Invalid token!");
		} else {
			req.body.user = user;

			return next();
		}
	})(req, res, next);
}
