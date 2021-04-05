//  Importing mongoose resources
import { Document } from "mongoose";

//	Defining User interface
export interface User extends Document {
	name: string,
	phone: string,
	email?: string,
	password: string,
	online: boolean,
	image?: string,
	createdAt: Date,
	updatedAt: Date,
	comparePassword(password: string): boolean
};