import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

interface UserPayload {
	email: string;
}

router.post("/", (req: Request<{}, {}, UserPayload>, res: Response) => {
	try {
		const user = req.body;
		const tokenSecret = process.env.TOKEN_SECRET;
		if (!tokenSecret) {
			return res
				.status(500)
				.send({ message: "Token Secret Not Configured!" });
		}
		const token = jwt.sign(user, tokenSecret);
		res.send({ token });
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error Creating Token: ", error.message);
			res.status(400).send({
				success: false,
				message: error.message,
			});
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
