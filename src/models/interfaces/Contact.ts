//  Importing mongoose resources
import { Document, Types } from "mongoose";

//	Defining Contact interface
export interface Contact extends Document {
	id: Types.ObjectId,
	userId: Types.ObjectId,
	name: string,
	phone: string,
	createdAt: Date,
	updatedAt: Date
};