//  Importing express, mongoose and JWT resources
import { Request, Response } from "express";
import mongoose from "mongoose";

//	Importing Rooms repository
import RoomsRepository from "../repositories/RoomsRepository";

//	Importing helpers
import { deleteFile } from "../helpers/deleteFile";
import { roomUploads } from "../helpers/paths";

//	Room features
class RoomController {
	//	Return user rooms
	async index(req: Request, res: Response) {
		const userId = req.headers.authorization;

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			return res.status(400).send("Invalid id!");
		}

		await RoomsRepository.allFromUser(userId).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("Rooms not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Create a new room
	async create(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const { name } = req.body;

		RoomsRepository.create({
			userId,
			name: name.trim()
		}).then((room) => {
			if(room) {
				return res.status(201).json(room);
			} else {
				return res.status(400).send("We couldn't process your request, try again later!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Update room
	async update(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const roomId = req.params.id;
		const { name } = req.body;

		RoomsRepository.update(roomId, userId, {
			name: name.trim()
		}).then((response) => {
			if(response) {
				return res.status(200).send("Room data has been updated!");
			} else {
				return res.status(404).send("Room not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Update room image
	async updateImage(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const roomId = req.params.id;
		const filename = req.file.filename;

		await RoomsRepository.findById(roomId, userId).then((room) => {
			if(room) {
				const deleteImage = room.image;
				room.image = filename;

				room.save().then((response) => {
					if(response) {
						if(deleteImage && deleteImage.length) {
							deleteFile(roomUploads(deleteImage));
						}

						return res.status(200).json(response);
					} else {
						deleteFile(roomUploads(filename));

						return res.status(400).send("Image could not be updated");
					}
				});
			} else {
				deleteFile(roomUploads(filename));

				return res.status(404).send("Room not found!");
			}
		}).catch((error) => {
			deleteFile(roomUploads(filename));

			return res.status(500).send(error);
		});
	}

	//	Remove room
	async delete(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const roomId = req.params.id;

		await RoomsRepository.delete(roomId, userId).then((room) => {
			if(room) {
				if(room.image && room.image.length) {
					deleteFile(roomUploads(room.image));
				}

				return res.status(200).send("The room has been deleted!");
			} else {
				return res.status(404).send("Room not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Return a list of rooms containing a specific word
	async search(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const query = req.query.q;

		await RoomsRepository.find(userId, <string>query).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("Rooms not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Return all rooms
	async all(req: Request, res: Response) {
		await RoomsRepository.all().then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("Rooms not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}
};

//	Exporting Room controller
export default new RoomController();