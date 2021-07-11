//  Importing express and mongoose resources
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

//	Importing repositories
import UsersRoomsRepository from "../repositories/UsersRoomsRepository";
import RoomsRepository from "../repositories/RoomsRepository";

//	User room features
class UserRoomController {
	//	Return user room relationships from user
	async index(req: Request, res: Response) {
		const userId = req.body?.user?.id;

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).json({ error: "Invalid id!" });
		}

		await UsersRoomsRepository.findByUserId(userId).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).json({ error: "User rooms not found!" });
			}
		}).catch((error) => {
			return res.status(500).json({ error });
		});
	}

	//	Return only one user room relationships from user
	async room(req: Request, res: Response) {
		const userId = req.body?.user?.id;
		const roomId = req.params.id;

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).json({ error: "Invalid id!" });
		}

		if(!roomId || !roomId.length || !isValidObjectId(roomId)) {
			return res.status(400).json({ error: "Invalid id!" });
		}

		await UsersRoomsRepository.findByIds(userId, roomId).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).json({ error: "User room not found!" });
			}
		}).catch((error) => {
			return res.status(500).json({ error });
		});
	}

	//	Create a new user room relationship
	async create(req: Request, res: Response) {
		const userId = req.body?.user?.id;
		const roomId = req.params.id;

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).json({ error: "Invalid id!" });
		}

		if(!roomId || !roomId.length || !isValidObjectId(roomId)) {
			return res.status(400).json({ error: "Invalid id!" });
		}

		if(await UsersRoomsRepository.findByIds(userId, roomId)) {
			return res.status(400).json({ error: "Invalid operation!" });
		}

		await UsersRoomsRepository.create({
			userId,
			roomId
		}).then((userRoom) => {
			if(userRoom) {
				RoomsRepository.findById(roomId).then((room) => {
					if(room) {
						room.nMembers += 1;

						room.save().then((response) => {
							if(response) {
								return res.status(201).json(userRoom);
							} else {
								return res.status(400).json({ error: "We couldn't process your request, try again later!" });
							}
						}).catch((error) => {
							return res.status(500).json({ error });
						});
					} else {
						return res.status(404).json({ error: "Room not found!" });
					}
				}).catch((error) => {
					return res.status(500).json({ error });
				});
			} else {
				return res.status(400).json({ error: "We couldn't process your request, try again later!" });
			}
		}).catch((error) => {
			return res.status(500).json({ error });
		});
	}

	//	Remove user room relationship
	async delete(req: Request, res: Response) {
		const userId = req.body?.user?.id;
		const roomId = req.params.id;

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).json({ error: "Invalid id!" });
		}

		if(!roomId || !roomId.length || !isValidObjectId(roomId)) {
			return res.status(400).json({ error: "Invalid id!" });
		}

		await UsersRoomsRepository.delete(userId, roomId).then((userRoom) => {
			if(userRoom) {
				RoomsRepository.findById(roomId).then((room) => {
					if(room) {
						room.nMembers -= 1;

						room.save().then((response) => {
							if(response) {
								return res.status(200).json({ message: "The user room has been deleted!" });
							} else {
								return res.status(400).json({ error: "We couldn't process your request, try again later!" });
							}
						}).catch((error) => {
							return res.status(500).json({ error });
						});
					} else {
						return res.status(404).json({ error: "Room not found!" });
					}
				}).catch((error) => {
					return res.status(500).json({ error });
				});
			} else {
				return res.status(404).json({ error: "Room not found!" });
			}
		}).catch((error) => {
			return res.status(500).json({ error });
		});
	}

	//	Return all room users
	async allRoomUsers(req: Request, res: Response) {
		const roomId = req.params.id;

		if(!roomId || !roomId.length || !isValidObjectId(roomId)) {
			return res.status(400).json({ error: "Invalid id!" });
		}

		await UsersRoomsRepository.findByRoomId(roomId).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).json({ error: "User rooms not found!" });
			}
		}).catch((error) => {
			return res.status(500).json({ error });
		});
	}

	//	Return a list of rooms containing a specific word
	async search(req: Request, res: Response) {
		const userId = req.body?.user?.id;
		const query = req.query.q?.toString();

		if(!userId || !userId.length || !isValidObjectId(userId)) {
			return res.status(400).json({ error: "Invalid id!" });
		}

		if(!query || !query.length) {
			return res.status(400).json({ error: "Invalid query!" });
		}

		await UsersRoomsRepository.find(userId, query).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).json({ error: "Rooms not found!" });
			}
		}).catch((error) => {
			return res.status(500).json({ error });
		});
	}

	//	Return all user room relationships
	async all(req: Request, res: Response) {
		await UsersRoomsRepository.all().then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).json({ error: "User rooms not found!" });
			}
		}).catch((error) => {
			return res.status(500).json({ error });
		});
	}
}

//	Exporting User Room controller
export default new UserRoomController();
