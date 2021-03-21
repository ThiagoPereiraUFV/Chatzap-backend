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
					user: "admin",
					text: `Hey ${user?.name}! Bem vindo(a) à sala ${user?.room}`
				});

				//	Send user joining message to all room users
				socket.broadcast.to(user?.room ?? "").emit("message", {
					user: "admin",
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
					user: user.name,
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
		socket.on("leaveGroup", (callback) => {
			const { error, user } = UserController.delete(socket.id);

			if(error) {
				callback(error);
			} else {
				//	Send user disconnecting message to all room users
				socket.broadcast.to(user?.room).emit("message", {
					user: "admin",
					text: `${user?.name} saiu da sala!`
				});

				callback();
			}
		});

		//	User disconnecting from direct
		socket.on("leaveDirect", (callback) => {
			const { error, user } = UserController.delete(socket.id);

			if(error) {
				callback(error);
			} else {
				callback();
			}
		});
	});

	return server;
}