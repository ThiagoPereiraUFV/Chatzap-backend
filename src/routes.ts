//	Importing express resources
import Router, { Request, Response } from "express";

//	Importing route controllers
import SessionController from "./controllers/SessionController";
import UserController from "./controllers/UserController";

//	Importing helpers and settings
import valid from "./helpers/validation";
import auth from "./helpers/authentication";
import { userUpload } from "./config/uploads";

//  Setting up routes
const routes = Router();

//	Home page
routes.get("/", (req: Request, res: Response) => {
	return res.status(200).send("Chatzap Backend");
});

//	Session
routes.get("/session", auth.verify, SessionController.index);
routes.post("/session", valid.createSession, SessionController.create);

//	User
routes.get("/user", auth.verify, UserController.index);
routes.post("/user", valid.createUser, UserController.create);
routes.put("/user", auth.verify, valid.updateUser, UserController.update);
routes.put("/userImage", userUpload, auth.verify, valid.updateUserImage, UserController.updateImage);
routes.delete("/user", auth.verify, valid.deleteUser, UserController.delete);
routes.get("/allUsers", UserController.all);

//	Not found page
routes.get("*", (req: Request, res: Response) => {
	return res.status(404).send("ERROR 404 - Not Found");
});

export { routes };