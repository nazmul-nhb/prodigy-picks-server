import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
	try {
		return res.status(200).send({
			success: true,
			message: "Hello from Products!",
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
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
