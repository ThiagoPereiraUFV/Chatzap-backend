//	Importing express resources
import Router, { Request, Response } from "express";

//	Importing route controllers
import SessionController from "./controllers/SessionController";
import UserController from "./controllers/UserController";
import RoomController from "./controllers/RoomController";
import UserRoomController from "./controllers/UserRoomController";

//	Importing helpers and settings
import valid from "./helpers/validation";
import auth from "./helpers/authentication";
import { userUpload, roomUpload } from "./config/uploads";

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

//	Room
routes.get("/room", auth.verify, RoomController.index);
routes.post("/room", auth.verify, valid.createRoom, RoomController.create);
routes.put("/room/:id", auth.verify, valid.updateRoom, RoomController.update);
routes.put("/roomImage/:id", roomUpload, auth.verify, valid.updateRoomImage, RoomController.updateImage);
routes.delete("/room/:id", auth.verify, valid.deleteRoom, RoomController.delete);
routes.get("/allRooms", RoomController.all);
routes.get("/searchRoom", auth.verify, valid.searchRoom, RoomController.search);

//	User Room
routes.get("/userRoom", auth.verify, UserRoomController.index);
routes.post("/userRoom", auth.verify, valid.createUserRoom, UserRoomController.create);
routes.delete("/userRoom/:id", auth.verify, valid.deleteUserRoom, UserRoomController.delete);
routes.get("/allRoomUsers/:id", auth.verify, UserRoomController.allRoomUsers);
routes.get("/allUsersRooms", UserRoomController.all);

//	Not found page
routes.get("*", (req: Request, res: Response) => {
	return res.status(404).send("ERROR 404 - Not Found");
});

export { routes };