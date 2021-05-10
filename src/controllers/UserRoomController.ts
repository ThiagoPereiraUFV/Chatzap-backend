//  Importing express, mongoose and JWT resources
import { Request, Response } from "express";
import mongoose from "mongoose";

//	Importing UsersRooms repository
import UsersRoomsRepository from "../repositories/UsersRoomsRepository";
import RoomsRepository from "../repositories/RoomsRepository";

//	User user room features
class UserRoomController {
	//	Return user room relationships from user
	async index(req: Request, res: Response) {
		const userId = req.headers.authorization;

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			return res.status(400).send("Invalid id!");
		}

		await UsersRoomsRepository.findByUserId(userId).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("User rooms not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Return only one user room relationships from user
	async room(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const roomId = req.params.id;

		if(!userId || !userId.length || !mongoose.isValidObjectId(userId)) {
			return res.status(400).send("Invalid id!");
		}

		if(!roomId || !roomId.length || !mongoose.isValidObjectId(roomId)) {
			return res.status(400).send("Invalid id!");
		}

		await UsersRoomsRepository.findByIds(userId, roomId).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("User room not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Create a new user room relationship
	async create(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const roomId = req.params.id;

		UsersRoomsRepository.create({
			userId,
			roomId
		}).then((userRoom) => {
			if(userRoom) {
				RoomsRepository.findById(roomId).then((room) => {
					if(room) {
						room.nMembers = room.nMembers+1;

						room.save().then((response) => {
							if(response) {
								return res.status(201).json(userRoom);
							} else {
								return res.status(400).send("We couldn't process your request, try again later!");
							}
						}).catch((error) => {
							return res.status(500).send(error);
						});
					} else {
						return res.status(404).send("Room not found!");
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

	//	Remove user room relationship
	async delete(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const roomId = req.params.id;

		await UsersRoomsRepository.delete(userId, roomId).then((userRoom) => {
			if(userRoom) {
				RoomsRepository.findById(roomId).then((room) => {
					if(room) {
						room.nMembers = room.nMembers-1;

						room.save().then((response) => {
							if(response) {
								return res.status(200).send("The user room has been deleted!");
							} else {
								return res.status(400).send("We couldn't process your request, try again later!");
							}
						}).catch((error) => {
							return res.status(500).send(error);
						});
					} else {
						return res.status(404).send("Room not found!");
					}
				}).catch((error) => {
					return res.status(500).send(error);
				});
			} else {
				return res.status(404).send("Room not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Return all room users
	async allRoomUsers(req: Request, res: Response) {
		const roomId = req.params.id;

		if(!roomId || !roomId.length || !mongoose.isValidObjectId(roomId)) {
			return res.status(400).send("Invalid id!");
		}

		await UsersRoomsRepository.findByRoomId(roomId).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("User rooms not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Return a list of rooms containing a specific word
	async search(req: Request, res: Response) {
		const userId = req.headers.authorization;
		const query = req.query.q;

		await UsersRoomsRepository.find(userId, <string>query).then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("Rooms not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}

	//	Return all user room relationships
	async all(req: Request, res: Response) {
		await UsersRoomsRepository.all().then((response) => {
			if(response) {
				return res.status(200).json(response);
			} else {
				return res.status(404).send("User rooms not found!");
			}
		}).catch((error) => {
			return res.status(500).send(error);
		});
	}
};

//	Exporting User Room controller
export default new UserRoomController();