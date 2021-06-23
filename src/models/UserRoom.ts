//  Requiring database
import { Schema, Types, model } from "mongoose";
import { UserRoom } from "./interfaces/UserRoom";

//	Defining UserRoom schema
const UserRoomSchema = new Schema<UserRoom>({
	userId: {
		type: Types.ObjectId,
		ref: "Users",
		required: true
	},
	roomId: {
		type: Types.ObjectId,
		ref: "Rooms",
		required: true
	}
}, {
	timestamps: true
});

//	Creating collection UsersRooms on database if does not exist
export default model<UserRoom>("UsersRooms", UserRoomSchema);
