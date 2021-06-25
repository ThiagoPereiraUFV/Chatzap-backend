//  Importing JWT and express resurces
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

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

				const decoded = <jwtPayload>jwt.verify(token, <string>process.env.SECRET);

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
