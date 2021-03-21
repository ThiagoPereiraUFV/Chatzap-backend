//	Importing express, cors, http, websocket and routes resources
import express from "express";
import http from "http";
import cors from "cors";
import { websocket } from "./config/websocket";
import { routes } from "./routes";

class App {
	public express: express.Application;
	public server: http.Server;

	constructor() {
		this.express = express();
		this.server = new http.Server();

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
		this.express.use(routes);
	}

	//	Setting up websocket server
	private websocket(): void {
		this.server = websocket(this.express);
	}
}

//	Exporting app object
export default new App().server;