//	Importing express, http and socket.io resources
import express from "express";
import http from "http";
import { Socket } from "socket.io";

//	Importing User controller
import UserController from "../controllers/UserController";

export function websocket(app: express.Application) {
	//	Setting up server
	const server = http.createServer(app);
	const io = require("socket.io")(server);

	//	User connection events
	io.on("connection", (socket: Socket) => {
		//	User joining group
		socket.on("joinGroup", ({ name, number, group }, callback) => {
			const { error, errors, user } = UserController.create(socket.id, name, number, group);

			if(error) {
				callback(error);
			} else if(errors) {
				callback(errors);
			} else {
				//	Send welcome message to user
				socket.emit("message", {
					user: "group",
					text: `Olá ${user?.name}! Este é o grupo o ${user?.room}`
				});

				//	Send user joining message to all room users
				socket.broadcast.to(user?.room ?? "").emit("message", {
					user: "group",
					text: `${user?.name}, entrou na sala!`
				});

				//	Set user room
				socket.join(user?.room ?? "");

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
		});

		//	User sending message
		socket.on("sendMessage", (message, callback) => {
			const { error, user } = UserController.get(socket.id);

			if(error) {
				callback(error);
			} else {
				//	Send user message to user room
				io.to(user?.room).emit("message", {
					user: user?.name,
					text: message
				});

				//	Send room data to user room
				io.to(user?.room).emit("groupData", {
					room: user?.room,
					users: UserController.allOnRoom(user?.room ?? "")
				});

				callback();
			}
		});

		//	User disconnecting from group
		socket.on("disconnect", () => {
			const { error, user } = UserController.delete(socket.id);

			//	Send user disconnecting message to all room users
			if(!user?.room.includes(user?.number)) {
				socket.broadcast.to(user?.room ?? "").emit("message", {
					user: "group",
					text: `${user?.name} saiu da sala!`
				});
			}
		});
	});

	return server;
}