import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import router from "./routes/menuRoutes";

dotenv.config();

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/menu",router);

app.listen(PORT,()=>{
    console.log(`[Server]: Kitchen is open and listening on port ${PORT}`);
});