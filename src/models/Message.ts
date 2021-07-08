//  Importing mongoose resources
import { Schema, Types, model } from "mongoose";
import { Message } from "./interfaces/Message";

//	Defining Message schema
const MessageSchema = new Schema<Message>({
	userId: {
		type: Types.ObjectId,
		ref: "Users",
		required: true
	},
	roomId: {
		type: Types.ObjectId,
		ref: "Rooms",
		required: true
	},
	text: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

//	Creating collection Messages on database if does not exist
export default model<Message>("Messages", MessageSchema);
