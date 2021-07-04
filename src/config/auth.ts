//	Importing express resources
import { NextFunction, Request, Response } from "express";

import { authenticate } from "passport";
import { User } from "../models/interfaces/User";
import { passportJwt } from "./passport";

export async function authJWT(req: Request, res: Response, next: NextFunction) {
	authenticate(passportJwt, (error, user: User) => {
		if(error) {
			return res.status(500).send(error);
		} else {
			req.body.user = user;

			return next();
		}
	})(req, res);
}
