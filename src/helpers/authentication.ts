//  Importing JWT, express resources and env
import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { SECRET } from "../config/env";

interface jwtPayload extends JwtPayload {
	userId: string
}

export default {
	//	Verify if current token is valid
	async verify(req: Request, res: Response, next: NextFunction): Promise<unknown> {
		const bearerToken = req.headers.authorization;

		if(!bearerToken) {
			return res.status(403).send("No token provided!");
		} else {
			try {
				const [ bearer, token ] = bearerToken.split(" ");

				if(!bearer || bearer !== "Bearer" || !token) {
					return res.status(401).send("Invalid token!");
				}

				const decoded = <jwtPayload>verify(token, SECRET);

				if(decoded && decoded.userId) {
					req.headers.authorization = decoded.userId;

					return next();
				} else {
					return res.status(401).send("Invalid token!");
				}
			} catch(error) {
				return res.status(401).send("Invalid token!");
			}
		}
	}
};
