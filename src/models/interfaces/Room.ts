//  Importing mongoose resources
import { Document, Types } from "mongoose";

//	Defining Room interface
export interface Room extends Document {
	id: Types.ObjectId,
	userId: Types.ObjectId,
	name: string,
	nMembers: number,
	image?: string,
	createdAt: Date,
	updatedAt: Date
};