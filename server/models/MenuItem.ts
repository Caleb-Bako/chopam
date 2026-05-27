import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  food_name: string;
  base_price: number;
  category: string;
  is_available: boolean;
}

const MenuItemSchema = new Schema(
  {
    food_name: {
      type: String,
      required: [true, "Please provide the name of the food"],
      trim: true,
    },
    base_price: {
      type: Number,
      required: [true, "Base price is required"],
    },
    category: {
      type: String,
      required: true,
    },
    is_available: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Menu =
  mongoose.models.Menu || mongoose.model<IMenuItem>("Menu", MenuItemSchema);

export default Menu;
