//  Importing express, mongoose and JWT resources
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

//	Importing Rooms repository
import RoomsRepository from "../repositories/RoomsRepository";
import UsersRoomsRepository from "../repositories/UsersRoomsRepository";

//	Importing helpers
import { deleteFile } from "../helpers/deleteFile";
import { roomUploads } from "../helpers/paths";

//	Room features
class RoomController {
	//	Return user rooms
	async index(req: Request, res: Response) {
		const userId = req.body.user.id;

		if(!userId || !userId.length || !isValidObjectId(userId)) {
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
		const userId = req.body.user.id;
		const { name } = req.body;

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).send("Invalid id!");
		}

		await RoomsRepository.create({
			userId,
			name: name.trim(),
			nMembers: 1
		}).then((room) => {
			if(room) {
				UsersRoomsRepository.create({
					userId,
					roomId: room?.id
				}).then((userRoom) => {
					if(userRoom) {
						return res.status(201).json(room);
					} else {
						return res.status(400).send("We couldn't process your request, try again later!");
					}
				}).catch((error) => {
					return res.status(500).send(error);
				});
			} else {
				return res.status(400).send("We couldn't process your request, try again later!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Update room
	async update(req: Request, res: Response) {
		const userId = req.body.user.id;
		const roomId = req.params.id;
		const { name } = req.body;

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!roomId || !roomId.length || !isValidObjectId(roomId)) {
			return res.status(400).send("Invalid id!");
		}

		await RoomsRepository.update(roomId, userId, {
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
		const userId = req.body.user.id;
		const roomId = req.params.id;
		const filename = (req.file) ? req.file.filename : "";

		if(filename) {
			const mimeType = (req?.file?.mimetype) ? req?.file?.mimetype.split("/")[0] : null;

			if(!mimeType || !mimeType.length || (mimeType !== "image")) {
				return res.status(400).send("Invalid image type!");
			}
		} else {
			return res.status(400).send("Invalid image!");
		}

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!roomId || !roomId.length || !isValidObjectId(roomId)) {
			return res.status(400).send("Invalid id!");
		}

		await RoomsRepository.findByIds(roomId, userId).then((room) => {
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
				}).catch((error) => {
					deleteFile(roomUploads(filename));

					return res.status(500).send(error);
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
		const userId = req.body.user.id;
		const roomId = req.params.id;

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!roomId || !roomId.length || !isValidObjectId(roomId)) {
			return res.status(400).send("Invalid id!");
		}

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
		const userId = req.body.user.id;
		const query = req.query.q?.toString();

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!query || !query.length) {
			return res.status(400).send("Invalid query!");
		}

		await RoomsRepository.find(userId, query).then((response) => {
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
}

//	Exporting Room controller
export default new RoomController();
