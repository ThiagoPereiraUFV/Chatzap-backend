//  Requiring database
import { Schema, model } from "mongoose";
import { Room } from "./interfaces/Room";

//	Defining Room schema
const RoomSchema = new Schema<Room>({
	name: {
		type: String,
		trim: true,
		required: true
	},
	nMembers: {
		type: Number,
		default: 0
	},
	image: {
		type: String,
		required: false
	}
}, {
	timestamps: true
});

//	Creating collection Rooms on database if does not exist
export default model<Room>("Rooms", RoomSchema);