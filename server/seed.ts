import mongoose from "mongoose";
import dotenv from "dotenv";
import Menu from "./models/MenuItem";

dotenv.config();

const sampleFood = [
  {
    food_name: "Smokey BBQ Burger",
    base_price: 4500,
    category: "Mains",
    is_available: true,
  },
  {
    food_name: "Crispy Yam Fries",
    base_price: 1500,
    category: "Sides",
    is_available: true,
  },
  {
    food_name: "Chilled Chapman",
    base_price: 2000,
    category: "Drinks",
    is_available: true,
  },
];

const seedDataBase = async() => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || "");
      console.log("Connected to database for seeding...");

      await Menu.deleteMany({});

      await Menu.insertMany(sampleFood);
      console.log("🌱 ChopAm Menu successfully seeded with delicious food!");

      process.exit(0);
    } catch (error) {
      console.error("Seeding failed:", error);
      process.exit(1);
    }
}

seedDataBase();