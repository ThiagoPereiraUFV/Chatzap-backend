//  Importing express, mongoose and JWT resources
import { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

//	Importing Users repository
import UsersRepository from "../repositories/UsersRepository";

//	Session features
class SessionController {
	//	Return user info from current session
	async index(req: Request, res: Response) {
		const userId = req.headers.authorization;

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			return res.status(400).send("Invalid id!");
		}

		await UsersRepository.findById(userId).then((user) => {
			if(user) {
				return res.status(200).json(user);
			} else {
				return res.status(404).send("User not found, try again!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Create a new session from user data
	async create(req: Request, res: Response) {
		const { phone, password } = req.body;

		await UsersRepository.findByPhone(phone).then((user) => {
			if(user) {
				if(user.comparePassword(password)) {
					const token = jwt.sign({ userId: user._id }, <string>process.env.SECRET, {
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
