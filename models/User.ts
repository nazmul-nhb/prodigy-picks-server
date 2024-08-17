import { Document, Schema, model } from "mongoose";

// interface for user
export interface User extends Document {
	name: string;
	email: string;
	role: string;
	createdAt: Date;
}

// define the schema for user
export const userSchema = new Schema<User>({
	name: {
		type: String,
		required: [true, "You Must Provide Your Name!"],
	},
	email: {
		type: String,
		required: [true, "You Must Provide Your Email!"],
		unique: true,
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const UserModel = model("User", userSchema);

export default UserModel;
