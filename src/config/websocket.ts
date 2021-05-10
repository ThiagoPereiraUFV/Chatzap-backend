//	Importing express, http and socket.io resources
import express from "express";
import http from "http";
import { Socket, Server } from "socket.io";

//	Importing repositores
import UsersRoomsRepository from "../repositories/UsersRoomsRepository";
import UsersRepository from "../repositories/UsersRepository";
import MessagesRepository from "../repositories/MessagesRepository";

//	Connected sockets
const sockets = new Map();

export function websocket(app: express.Application) {
	//	Setting up server
	const server = http.createServer(app);
	const io = new Server(server);

	//	User connection events
	io.on("connection", (socket: Socket) => {
		//	User gets online
		socket.on("online", async (userId: string) => {
			sockets.set(socket.id, userId);
			const user = await UsersRepository.findById(userId);
			const userRooms = await UsersRoomsRepository.findByUserId(user?._id);

			for(const userRoom of userRooms) {
				socket.join(String(userRoom?.roomId?._id));
			}

			user?.set("online", true);
			await user?.save();
		});

		//	User joins a room
		socket.on("joinRoom", async (roomId: string) => {
			const userId = sockets?.get(socket.id);
			const user = await UsersRepository.findById(userId);
			const msg = {
				userId,
				roomId,
				text: `${user?.name} entrou na sala`
			};
			const createdMsg = await MessagesRepository.create(msg);
			const sentMsg = await MessagesRepository.findById(createdMsg?.id);

			if(sentMsg) {
				socket.join(roomId);
				socket.to(roomId).emit("message", sentMsg);
			}
		});

		//	User set a room
		socket.on("getMessages", async (roomId: string) => {
			const roomMessages = await MessagesRepository.findByRoomId(roomId);

			socket.emit("messages", roomMessages);
		});

		//	User sending message
		socket.on("sendMessage", async (message: string, roomId: string) => {
			const msg = {
				userId: sockets?.get(socket.id),
				roomId,
				text: message
			};
			const createdMsg = await MessagesRepository.create(msg);
			const sentMsg = await MessagesRepository.findById(createdMsg?.id);

			if(sentMsg) {
				io.to(roomId).emit("message", sentMsg);
			}
		});

		//	User gets offline
		socket.on("disconnect", async () => {
			const userId = sockets.get(socket.id);
			const user = await UsersRepository.findById(userId);

			sockets.delete(socket.id);
			user?.set("online", false);
			await user?.save();
		});
	});

	return server;
}