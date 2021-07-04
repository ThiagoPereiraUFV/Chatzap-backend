//  Importing express, mongoose, JWT resources and env
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { SECRET } from "../config/env";

//	Importing Users repository
import UsersRepository from "../repositories/UsersRepository";

//	Session features
class SessionController {
	//	Return user info from current session
	async index(req: Request, res: Response) {
		return res.status(200).json(req.user);
	}

	//	Create a new session from user data
	async create(req: Request, res: Response) {
		const { phone, password } = req.body;

		await UsersRepository.findByPhone(phone).then((user) => {
			if(user) {
				if(user.comparePassword(password)) {
					const token = sign({ userId: user._id }, SECRET, {
						expiresIn: 86400
					});

					return res.status(201).json({ user, token });
				} else {
					return res.status(400).send("Wrong password, try again!");
				}
			} else {
				return res.status(404).send("User not found using this phone, try again!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}
}

//	Exporting Session controller
export default new SessionController();
