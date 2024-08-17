import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/prodigyDB";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/carts";
// import crypto from "node:crypto";

// const secret = crypto.randomBytes(64).toString("hex");
// console.log(secret);

dotenv.config();

const app = express();
const port = process.env.PORT || 4242;

interface ErrorObject extends Error {
	status?: number;
}

(async () => {
	try {
		// connect to db
		await connectDB();

		// middlewares
		// TODO: Add CORS Options when project is done!
		app.use(cors());
		app.use(express.json());

		// routes
		app.use("/auth", authRoutes);
		app.use("/users", userRoutes);
		app.use("/products", productRoutes);
		app.use("/carts", cartRoutes);

		// root route
		app.get("/", async (req: Request, res: Response) => {
			res.send("Prodigy Server is Running!");
		});

		// error handler for 404
		app.use((req: Request, res: Response, next: NextFunction) => {
			const error: ErrorObject = new Error("Requested URL Not Found!");
			error.status = 404;
			next(error);
		});

		// final error handler
		app.use(
			(
				error: ErrorObject,
				req: Request,
				res: Response,
				next: NextFunction
			) => {
				console.error(error);
				res.status(error.status || 500).send({
					message: error.message || "Internal Server Error!",
				});
			}
		);

		// run the server
		app.listen(port, () => {
			console.log(`Prodigy Server is Running on Port: ${port}`);
		});
	} catch (error) {
		console.error("Failed to Start Prodigy Server: ", error);
		// process.exit(1);
	}
})();
