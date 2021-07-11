//  Importing express, mongoose, JWT and env resources
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import { SECRET } from "../config/env";

//	Importing repositories
import UsersRepository from "../repositories/UsersRepository";
import UsersRoomsRepository from "../repositories/UsersRoomsRepository";

//	Importing helpers
import { deleteFile } from "../helpers/deleteFile";
import { userUploads } from "../helpers/paths";

//	User features
class UserController {
	//	Return an user on database given id
	async index(req: Request, res: Response) {
		return res.status(200).json(req.body.user);
	}

	//	Create a new user
	async create(req: Request, res: Response) {
		const { name, phone, email, password } = req.body;

		await UsersRepository.findByPhone(phone).then((response) => {
			if(response) {
				return res.status(400).json({ error: "This phone isn't available, try another!" });
			} else {
				UsersRepository.create({
					name: name.trim(),
					phone: phone.trim(),
					email: email ? email.trim().toLowerCase() : null,
					password
				}).then((user) => {
					if(user) {
						const token = sign({ userId: user._id }, SECRET, {
							expiresIn: "1d"
						});

						return res.status(201).json({ user, token });
					} else {
						return res.status(400).json({ error: "We couldn't process your request, try again later!" });
					}
				}).catch((error) => {
					return res.status(500).json({ error });
				});
			}
		}).catch((error) => {
			return res.status(500).json({ error });
		});
	}

	//	Update user
	async update(req: Request, res: Response) {
		const userId = req.body?.user?.id;
		const { name, phone, email, passwordO, passwordN } = req.body;

		await UsersRepository.findByPhone(phone).then((response) => {
			if(response && (response._id.toString() !== userId)) {
				return res.status(400).json({ error: "This phone isn't available, try another!" });
			} else {
				UsersRepository.findById(userId).then((user) => {
					if(user) {
						user.name = name.trim();
						user.phone = phone.trim();
						user.email = email ? email.trim().toLowerCase() : null;

						if(passwordN && passwordN.length && passwordO && passwordO.length) {
							if(!user.comparePassword(passwordO)) {
								return res.status(400).json({ error: "Old password don't match, try again!" });
							} else {
								user.password = passwordN;
							}
						}

						user.save().then((updatedUser) => {
							if(updatedUser) {
								return res.status(200).json(updatedUser);
							} else {
								return res.status(400).json({ error: "We couldn't save your changes, try again later!" });
							}
						}).catch((error) => {
							return res.status(500).json({ error });
						});
					} else {
						return res.status(404).json({ error: "User not found!" });
					}
				}).catch((error) => {
					return res.status(500).json({ error });
				});
			}
		}).catch((error) => {
			return res.status(500).json({ error });
		});
	}

	//	Update user image
	async updateImage(req: Request, res: Response) {
		const userId = req.body?.user?.id;
		const filename = (req.file) ? req.file.filename : "";

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).json({ error: "Invalid id!" });
		}

		await UsersRepository.findById(userId).then((user) => {
			if(user) {
				const deleteImage = user.image;
				user.image = filename;

				user.save().then((response) => {
					if(response) {
						if(deleteImage && deleteImage.length) {
							deleteFile(userUploads(deleteImage));
						}

						return res.status(200).json(response);
					} else {
						deleteFile(userUploads(filename));

						return res.status(400).json({ error: "Image could not be updated" });
					}
				}).catch((error) => {
					deleteFile(userUploads(filename));

					return res.status(500).json({ error });
				});
			} else {
				deleteFile(userUploads(filename));

				return res.status(404).json({ error: "User not found!" });
			}
		}).catch((error) => {
			deleteFile(userUploads(filename));

			return res.status(500).json({ error });
		});
	}

	//	Remove user
	async delete(req: Request, res: Response) {
		const password = req.body.password?.toString();
		const userId = req.body?.user?.id;

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).json({ error: "Invalid id!" });
		}

		await UsersRepository.findById(userId).then((user) => {
			if(user) {
				if(user.comparePassword(password)) {
					user.remove().then(() => {
						if(user.image && user.image.length) {
							deleteFile(userUploads(user.image));
						}

						UsersRoomsRepository.deleteAllFromUser(userId).then((response) => {
							if(response?.ok) {
								return res.status(200).json({ message: "The user has been deleted!" });
							} else {
								return res.status(400).json({ error: "We couldn't process your request, try again later!" });
							}
						}).catch((error) => {
							return res.status(500).json({ error });
						});
					}).catch((error) => {
						return res.status(500).json({ error });
					});
				} else {
					return res.status(400).json({ error: "Wrong password!" });
				}
			} else {
				return res.status(404).json({ error: "User not found!" });
			}
		}).catch((error) => {
			return res.status(500).json({ error });
		});
	}

	//	Return all users
	async all(req: Request, res: Response) {
		await UsersRepository.all().then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).json({ error: "Users not found!" });
			}
		}).catch((error) => {
			return res.status(500).json({ error });
		});
	}
}

//	Exporting User controller
export default new UserController();
