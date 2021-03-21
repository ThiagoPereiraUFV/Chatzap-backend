//	Importing express, path and socke.io resources
import express from "express";
import http from "http";
import { Socket } from "socket.io";
import cors from "cors";

//	Importing routes
import { routes } from "./routes";

//	Importing user controller
import UserController from "./controllers/UserController";

//	Defining port
const PORT = process.env.PORT || 4000;

//	Setting up server
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

//	Using resources
app.use(cors());
app.use(routes);

io.on("connection", (socket: Socket) => {
	//	User joined room
	socket.on("join", ({ name, room }, callback) => {
		const { error, user } = UserController.create(socket.id, name, room);

		if(error) {
			callback(error);
		} else {
			socket.emit("message", {
				user: "admin",
				text: `Hey ${user?.name}! Bem vindo(a) à sala ${user?.room}`
			});

			socket.broadcast.to(user?.room ?? "").emit("message", {
				user: "admin",
				text: `${user?.name}, entrou na sala!`
			});

			socket.join(user?.room ?? "");

			io.to(user?.room).emit("roomData", {
				room: user?.room,
				users: UserController.allOnRoom(user?.room ?? "")
			});

			callback();
		}
	});

	//	User sends message
	socket.on("sendMessage", (message, callback) => {
		const { error, user } = UserController.get(socket.id);

		if(error) {
			callback(error);
		} else {
			io.to(user?.room).emit("message", {
				user: user.name,
				text: message
			});

			io.to(user?.room).emit("roomData", {
				room: user?.room,
				users: UserController.allOnRoom(user?.room ?? "")
			});

			callback();
		}
	});

	//	User disconnected from room
	socket.on("disconnect", () => {
		const { user } = UserController.delete(socket.id);

		socket.broadcast.to(user?.room).emit("message", {
			user: "admin",
				text: `${user?.name} saiu da sala!`
		});
	});
});

//	Listening on given port
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));