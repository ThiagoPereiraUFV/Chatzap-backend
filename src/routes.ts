//	Importing express and multer resources
import Router, { Request, Response } from "express";

//  Setting up routes
const routes = Router();

//	Home page
routes.get("/", (req: Request, res: Response) => {
	return res.status(200).send("Chatzap Backend");
});

//	Not found page
routes.get("*", (req: Request, res: Response) => {
	return res.status(404).send("ERROR 404 - Not Found");
});

export { routes };