import express, { Request, Response } from "express";
import ProductModel from "../models/product";

const router = express.Router();

interface ProductReqBody {
	title: string;
	image: string;
	description: string;
	price: number;
	category: string;
	ratings: number;
}

router.post(
	"/",
	async (req: Request<{}, {}, ProductReqBody>, res: Response) => {
		try {
			const newProduct = new ProductModel(req.body);
			const product = await newProduct.save();
			if (product?._id) {
				return res
					.status(201)
					.send({
						success: true,
						message: `${product.title} is Saved Successfully!`,
					});
			}
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
	}
);

// dummy get route for products
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
