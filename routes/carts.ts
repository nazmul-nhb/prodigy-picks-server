import { Router, Request, Response } from "express";
import CartModel from "../models/Cart";

const router = Router();

interface AddToCartRequest {
	products: string;
	userEmail: string;
	quantity: number;
}

// Add item to cart
router.post(
	"/",
	async (req: Request<{}, {}, AddToCartRequest>, res: Response) => {
		try {
			const { products, userEmail, quantity } = req.body;

			// Check if the cart item already exists
			const existingItem = await CartModel.findOne({
				products,
				userEmail,
			});

			if (existingItem) {
				// If the item exists, update the quantity
				existingItem.quantity += quantity;
				const savedItem = await existingItem.save();
				if (savedItem?._id) {
					return res.status(200).send({
						success: true,
						insertedId: savedItem._id,
						message: "Item Appended in Your Existing Cart!",
					});
				}
			} else {
				// If the item does not exist, create a new cart item
				const newCartItem = new CartModel({
					products,
					userEmail,
					quantity,
				});
				const savedItem = await newCartItem.save();
				if (savedItem?._id) {
					return res.status(201).send({
						success: true,
						insertedId: savedItem._id,
						message: "Item Added to Your Cart Successfully!",
					});
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error Adding Cart Item: ", error.message);
				return res.status(400).send({
					success: false,
					message: error.message,
				});
			} else {
				console.error("An Unknown Error Occurred!");
				return res.status(500).send({
					success: false,
					message: "Internal Server Error!",
				});
			}
		}
	}
);

// Get cart items for a user
router.get(
	"/:email",
	async (req: Request<{ email: string }, {}, {}>, res: Response) => {
		try {
			const { email } = req.params;

			// Find cart items for the user and populate the product details
			const cartItems = await CartModel.find({
				userEmail: email,
			}).populate("products");

			// Calculate total price using reduce
			const totalPrice = cartItems.reduce((acc, item) => {
				const productPrice = (item.products as any).price;
				return acc + productPrice * item.quantity;
			}, 0);

			return res
				.status(200)
				.send({ success: true, totalPrice, cartItems });
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error Fetching Cart Items: ", error.message);
				return res.status(400).send({
					success: false,
					message: error.message,
				});
			} else {
				console.error("An Unknown Error Occurred!");
				return res.status(500).send({
					success: false,
					message: "Internal Server Error!",
				});
			}
		}
	}
);

export default router;
