import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_CONNECTION_STRING as string;

export const connectDB = async () => {
	try {
		await mongoose.connect(mongoURI);
		console.log("Prodigy DB is Connected!");
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error("An Unknown Error Occurred!");
		}
		console.log("Prodigy DB is Not Connected!");
		// process.exit(1);
	}
};
