//	Importing express resources
import Router, { Request, Response } from "express";

//	Importing route controllers
import SessionController from "./controllers/SessionController";
import UserController from "./controllers/UserController";
import RoomController from "./controllers/RoomController";
import UserRoomController from "./controllers/UserRoomController";

//	Importing helpers and middlewares
import { userUpload, roomUpload } from "./middlewares/upload";
import { authJWT } from "./middlewares/auth";
import { schemas, validateBody } from "./helpers/validate";

//  Setting up router
const routes = Router();

//	Home page
routes.get("/", (req: Request, res: Response) => {
	return res.status(200).send("Chatzap Backend");
});

//	Session
routes.get("/session", authJWT, SessionController.index);
routes.post("/session", validateBody(schemas.createSessionSchema), SessionController.create);

//	User
routes.get("/user", authJWT, UserController.index);
routes.post("/user", validateBody(schemas.createUserSchema), UserController.create);
routes.put("/user", authJWT, validateBody(schemas.updateUserSchema), UserController.update);
routes.put("/userImage", userUpload, authJWT, UserController.updateImage);
routes.delete("/user", authJWT, validateBody(schemas.deleteUserSchema), UserController.delete);
routes.get("/allUsers", UserController.all);

//	Room
routes.get("/room", authJWT, RoomController.index);
routes.post("/room", authJWT, validateBody(schemas.createRoomSchema), RoomController.create);
routes.put("/room/:id", authJWT, validateBody(schemas.updateRoomSchema), RoomController.update);
routes.put("/roomImage/:id", roomUpload, authJWT, RoomController.updateImage);
routes.delete("/room/:id", authJWT, RoomController.delete);
routes.get("/allRooms", RoomController.all);

//	User Room
routes.get("/userRoom", authJWT, UserRoomController.index);
routes.get("/userRoom/:id", authJWT, UserRoomController.room);
routes.post("/userRoom/:id", authJWT, UserRoomController.create);
routes.delete("/userRoom/:id", authJWT, UserRoomController.delete);
routes.get("/allRoomUsers/:id", authJWT, UserRoomController.allRoomUsers);
routes.get("/allUsersRooms", UserRoomController.all);
routes.get("/searchRoom", authJWT, UserRoomController.search);

//	Not found page
routes.get("*", (req: Request, res: Response) => {
	return res.status(404).send("ERROR 404 - Not Found");
});

export { routes };
