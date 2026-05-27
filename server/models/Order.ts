import mongoose, { Schema, Document } from "mongoose";

interface ICartItem {
  food_name: string;
  price_at_purchase: number;
  quantity: number;
}

// 2. Define the main Order document interface
export interface IOrder extends Document {
  orderId: string;
  customer_name: string;
  delivery_address: string;
  items: ICartItem[]; // An array of our sub-items
  total_price: number;
  status: "Pending" | "Preparing" | "Ready" | "Completed";
}

// 3. Create the Sub-Schema for the items
const CartItemSchema = new Schema(
  {
    food_name: { type: String, required: true },
    price_at_purchase: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

// 4. Create the Main Order Schema
const OrderSchema: Schema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customer_name: {
      type: String,
      required: [true, "Customer name is required"],
    },
    delivery_address: {
      type: String,
      required: [true, "Delivery address is required"],
    },
    items: [CartItemSchema],
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
