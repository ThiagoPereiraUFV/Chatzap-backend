//  Requiring database
import { Schema, Types, model } from "mongoose";
import { Contact } from "./interfaces/Contact";

//	Defining Contact schema
const ContactSchema = new Schema<Contact>({
	userId: {
		type: Types.ObjectId,
		ref: "Users",
		required: true
	},
	name: {
		type: String,
		trim: true,
		required: true
	},
	phone: {
		type: String,
		trim: true,
		required: false
	}
}, {
	timestamps: true
});

//	Creating collection Contacts on database if does not exist
export default model<Contact>("Contacts", ContactSchema);