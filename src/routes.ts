//	Importing express resources
import Router, { Request, Response } from "express";

//	Importing route controllers
import UsersRepository from "./repositories/UsersRepository";

//  Setting up routes
const routes = Router();

//	Home page
routes.get("/", (req: Request, res: Response) => {
	return res.status(200).send("Chatzap Backend");
});

//	Return if user exists
routes.get("/user/:number", (req: Request, res: Response) => {
	const { number } = req.params;

	const user = UsersRepository.findByNumber(number);

	return res.status(200).json({ exists: (user) ? true : false });
});

//	Not found page
routes.get("*", (req: Request, res: Response) => {
	return res.status(404).send("ERROR 404 - Not Found");
});

export { routes };