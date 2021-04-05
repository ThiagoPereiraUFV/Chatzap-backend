//  Importing mongoose, intefaces and bcrypt resources
import { Schema, model } from "mongoose";
import { User } from "./interfaces/User";
import bcrypt from "bcrypt";

//	Defining User schema
const UserSchema = new Schema<User>({
	name: {
		type: String,
		trim: true,
		required: true
	},
	phone: {
		type: String,
		trim: true,
		required: true
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		required: false
	},
	password: {
		type: String,
		set: (p: String) => bcrypt.hashSync(p, bcrypt.genSaltSync(10)),
		required: true
	},
	online: {
		type: Boolean,
		default: false,
		required: false
	},
	image: {
		type: String,
		required: false
	}
}, {
	timestamps: true
});

UserSchema.methods.comparePassword = function(password: string) {
	if(password && password.length) {
			return bcrypt.compareSync(password, this.password);
	} else {
		return false;
	}
}

//	Creating collection Users on database if does not exist
export default model<User>("Users", UserSchema);