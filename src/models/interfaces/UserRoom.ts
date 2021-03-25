//  Importing mongoose resources
import { Document, Types } from "mongoose";

//	Defining UserRoom interface
export interface UserRoom extends Document {
	userId: Types.ObjectId,
	roomId: Types.ObjectId,
	createdAt: Date,
	updatedAt: Date
};