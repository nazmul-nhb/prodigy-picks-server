import { Document, Schema, model } from "mongoose";

// Interface for cart item
export interface CartItem extends Document {
	userEmail: string;
	products: Schema.Types.ObjectId;
	quantity: number;
}

// Define the schema for cart item
export const cartItemSchema = new Schema<CartItem>({
	userEmail: {
		type: String,
		required: [true, "User email is required"],
		ref: "User",
	},
	products: {
		type: Schema.Types.ObjectId,
		required: [true, "Product ID is required"],
		ref: "Product",
	},
	quantity: {
		type: Number,
		default: 1,
	},
});

// Create the Cart model
const CartModel = model<CartItem>("Cart", cartItemSchema);

export default CartModel;
