//	Importing express resources
import Router, { Request, Response } from "express";

//	Importing route controllers
import SessionController from "./controllers/SessionController";
import UserController from "./controllers/UserController";
import RoomController from "./controllers/RoomController";
import UserRoomController from "./controllers/UserRoomController";

//	Importing helpers and settings
import valid from "./helpers/validation";
import { userUpload, roomUpload } from "./config/uploads";
import { authJWT } from "./config/auth";

//  Setting up routes
const routes = Router();

//	Home page
routes.get("/", (req: Request, res: Response) => {
	return res.status(200).send("Chatzap Backend");
});

//	Session
routes.get("/session", authJWT, SessionController.index);
routes.post("/session", valid.createSession, SessionController.create);

//	User
routes.get("/user", authJWT, UserController.index);
routes.post("/user", valid.createUser, UserController.create);
routes.put("/user", authJWT, valid.updateUser, UserController.update);
routes.put("/userImage", userUpload, authJWT, valid.updateUserImage, UserController.updateImage);
routes.delete("/user", authJWT, valid.deleteUser, UserController.delete);
routes.get("/allUsers", UserController.all);

//	Room
routes.get("/room", authJWT, RoomController.index);
routes.post("/room", authJWT, valid.createRoom, RoomController.create);
routes.put("/room/:id", authJWT, valid.updateRoom, RoomController.update);
routes.put("/roomImage/:id", roomUpload, authJWT, valid.updateRoomImage, RoomController.updateImage);
routes.delete("/room/:id", authJWT, valid.deleteRoom, RoomController.delete);
routes.get("/allRooms", RoomController.all);

//	User Room
routes.get("/userRoom", authJWT, UserRoomController.index);
routes.get("/userRoom/:id", authJWT, UserRoomController.room);
routes.post("/userRoom/:id", authJWT, valid.createUserRoom, UserRoomController.create);
routes.delete("/userRoom/:id", authJWT, valid.deleteUserRoom, UserRoomController.delete);
routes.get("/allRoomUsers/:id", authJWT, UserRoomController.allRoomUsers);
routes.get("/allUsersRooms", UserRoomController.all);
routes.get("/searchRoom", authJWT, valid.searchRoom, UserRoomController.search);

//	Not found page
routes.get("*", (req: Request, res: Response) => {
	return res.status(404).send("ERROR 404 - Not Found");
});

export { routes };
