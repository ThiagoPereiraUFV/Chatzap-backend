//  Importing JWT and express resurces
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default {
	//	Verify if current token is valid
	async verify(req: Request, res: Response, next: NextFunction) {
		const token = req.headers["x-access-token"];

		if(!token) {
			return res.status(403).send("No token provided!");
		} else {
			try {
				const decoded = <any>jwt.verify(<string>token, <string>process.env.SECRET);

				if(decoded && decoded.userId) {
					req.headers.authorization = decoded.userId;
					return next();
				} else {
					return res.status(401).send("Invalid token!");
				}
			} catch (error) {
				return res.status(401).send("Invalid token!");
			}
		}
	}
}