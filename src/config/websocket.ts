//	Importing express, http and socket.io resources
import express from "express";
import http from "http";
import { Socket } from "socket.io";

//	Importing repositores
import UsersRoomsRepository from "../repositories/UsersRoomsRepository";
import UsersRepository from "../repositories/UsersRepository";
import MessagesRepository from "../repositories/MessagesRepository";

export function websocket(app: express.Application) {
	//	Setting up server
	const server = http.createServer(app);
	const io = require("socket.io")(server);

	const sockets = new Map();

	//	User connection events
	io.on("connection", (socket: Socket) => {
		//	User gets online
		socket.on("online", async (userId: string) => {
			sockets.set(socket.id, userId);
			const user = await UsersRepository.findById(userId);
			const userRooms = await UsersRoomsRepository.findByUserId(user?._id);

			for(const userRoom of userRooms) {
				socket.join(userRoom?.roomId?._id);
			}

			user?.set("online", true);
			await user?.save();
		});

		//	User set a room
		socket.on("getMessages", async (roomId: string) => {
			const roomMessages = await MessagesRepository.findByRoomId(roomId);

			io.emit("messages", roomMessages);
		});
		/*
		//	User joining group
		socket.on("joinGroup", ({ name, number, group }, callback) => {
			const { error, errors, user } = UserController.create(socket.id, name, number, group);

			if(error) {
				callback(error);
			} else if(errors) {
				callback(errors);
			} else {
				//	Set user room
				socket.join(user?.room ?? "");

				//	Send user joining message to all room users
				io.to(user?.room).emit("message", {
					user: "group",
					number: "",
					text: `${user?.name} entrou no grupo`
				});

				//	Send room data to user room
				io.to(user?.room).emit("groupData", {
					room: user?.room,
					users: UserController.allOnRoom(user?.room ?? "")
				});

				callback();
			}
		});

		//	User joining direct
		socket.on("joinDirect", ({ name, number, numberDirect }, callback) => {
			const room = (number > numberDirect) ? number + numberDirect : numberDirect + number;
			const { error, errors, user } = UserController.create(socket.id, name, number, room);

			if(error) {
				callback(error);
			} else if(errors) {
				callback(errors);
			} else {
				//	Set user room
				socket.join(user?.room ?? "");

				//	Send room data to user room
				io.to(user?.room).emit("groupData", {
					room: user?.room,
					users: UserController.allOnRoom(user?.room ?? "")
				});

				callback();
			}
		});*/

		//	User sending message
		socket.on("sendMessage", async ({ message, userId, roomId }) => {
			const msg = {
				userId,
				roomId,
				text: message
			};
			const createdMsg = await MessagesRepository.create(msg);
			const sentMsg = await MessagesRepository.findById(createdMsg?.id);

			if(sentMsg) {
				io.emit("message", sentMsg);
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