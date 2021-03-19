//	Importing express, path and socke.io reesources
import express, { Request, Response } from "express";
import path from "path";
import http from "http";
import { Socket } from "socket.io";

//	Defining port
const PORT = process.env.PORT || 4000;

//	Setting up server
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

//	Using resources
app.use(express.static(path.join(__dirname, "views")));
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req: Request, res: Response) => {
	res.render("index.html");
});

const messages: string[] = [];

io.on("connection", (socket: Socket) => {
	//	Send previous messages to listener
	socket.emit("previousMessages", messages);

	//	Store received message to array and send to all listeners
	socket.on("sendMessage", (data) => {
		messages.push(data);
		socket.broadcast.emit("receivedMessage", data);
	});
});

//	Listening on given port
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});