import express, { Request, Response } from "express";
import ProductModel from "../models/Product";

const router = express.Router();

interface ProductDetails {
	title: string;
	image: string;
	description: string;
	price: number;
	category: string;
	ratings: number;
}

// create a product
router.post(
	"/",
	async (req: Request<{}, {}, ProductDetails>, res: Response) => {
		try {
			const newProduct = new ProductModel(req.body);
			const savedProduct = await newProduct.save();
			if (savedProduct?._id) {
				return res.status(201).send({
					success: true,
					insertedId: savedProduct._id,
					message: `${savedProduct.title} is Saved Successfully!`,
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error Creating Product: ", error.message);
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

// get route for all products
router.get("/", async (req: Request, res: Response) => {
	try {
		// Pagination parameters
		const page = parseInt(req.query.page as string) || 1;
		const size = parseInt(req.query.size as string) || 12;
		const skip = (page - 1) * size;

		// Sorting
		let sortBy: any = {};
		switch (req.query.sort) {
			case "price_asc":
				sortBy = { price: 1 };
				break;
			case "price_desc":
				sortBy = { price: -1 };
				break;
			case "date_desc":
				sortBy = { createdAt: -1 };
				break;
			case "date_asc":
				sortBy = { createdAt: 1 };
				break;
			default:
				sortBy = {};
		}

		// Filter criteria
		let filter: any = {};

		// Search by product name
		if (req.query.search) {
			filter.title = { $regex: req.query.search, $options: "i" };
		}

		// Filter by brand
		if (req.query.brand) {
			filter.brand = req.query.brand;
		}

		// Filter by category
		if (req.query.category) {
			filter.category = req.query.category;
		}

		// Filter by price range
		if (req.query.minPrice || req.query.maxPrice) {
			filter.price = {};
			if (req.query.minPrice) {
				filter.price.$gte = parseInt(req.query.minPrice as string);
			}
			if (req.query.maxPrice) {
				filter.price.$lte = parseInt(req.query.maxPrice as string);
			}
		}

		// Get filtered and sorted products with pagination
		const products = await ProductModel.find(filter)
			.sort(sortBy)
			.skip(skip)
			.limit(size)
			.exec();

		// Get total product count for pagination
		const productCount = await ProductModel.countDocuments(filter);

		return res
			.status(200)
			.send({
				success: true,
				productCount,
				totalPages: Math.ceil(productCount / size),
				products,
			});
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error Getting Products: ", error.message);
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
