//	Importing express, http, cors, path, websocket, routes and database resources
import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { websocket } from "./config/websocket";
import { routes } from "./routes";
import db from "./config/database";

class App {
	public express: express.Application;
	public server: http.Server;

	constructor() {
		this.express = express();
		this.server = new http.Server();

		this.database();
		this.middlewares();
		this.routes();
		this.websocket();
	}

	//	Using resources as middlewares
	private middlewares(): void {
		this.express.use(cors());
	}

	//	Implementing routes
	private routes(): void {
		this.express.use("/files", express.static(path.resolve(__dirname, "..", "public", "users")));
		this.express.use(routes);
	}

	//	Connect to database
	private database(): void {
		db.connect();
	}

	//	Setting up websocket server
	private websocket(): void {
		this.server = websocket(this.express);
	}
}

//	Exporting app object
export default new App().server;