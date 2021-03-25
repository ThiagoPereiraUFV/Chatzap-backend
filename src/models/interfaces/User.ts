//  Importing mongoose resources
import { Document } from "mongoose";

//	Defining User interface
export interface User extends Document {
	name: string,
	phone: string,
	password: string,
	image?: string,
	createdAt: Date,
	updatedAt: Date,
	comparePassword(password: string): boolean
};