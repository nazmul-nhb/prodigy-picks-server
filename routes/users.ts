import express, { Request, Response } from "express";
import { UserModel } from "../models/User";

const router = express.Router();

interface UserDetails {
	name: string;
	email: string;
}

// POST: Create or update user during register, login, or profile update
router.post("/", async (req: Request<{}, {}, UserDetails>, res: Response) => {
	try {
		const user = req.body;

        // not using mongoose unique error msg because I don't want to send error as response
        // it will destroy the user experience
		// check if the user already exists in the database with the same email
		const userExists = await UserModel.findOne({ email: user.email });

		// if user doesn't exist, create and save the new user
		if (!userExists) {
			const newUser = new UserModel(user);
			const savedUser = await newUser.save();

			// check if the user was successfully saved
			if (savedUser._id) {
				return res
					.status(201)
					.send({ success: true, message: "User Saved in DB!" });
			}
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error Saving User: ", error.message);
			res.status(400).send({
				success: false,
				message: error.message,
			});
			console.error(error.message);
		} else {
			console.error("An Unknown Error Occurred!");
			res.status(500).send({
				success: false,
				message: "Internal Server Error!",
			});
		}
	}
});

export default router;
