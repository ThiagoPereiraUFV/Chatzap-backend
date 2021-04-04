//  Importing mongoose resources
import { Document, Types } from "mongoose";

//	Defining Message interface
export interface Message extends Document {
	userId: Types.ObjectId,
	roomId: Types.ObjectId,
	text: String | RegExp,
	createdAt: Date,
	updatedAt: Date
};