import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async(): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || '');

        console.log(`============= CHOPAM DATABASE CONNECTED =============`);
        console.log(`Host: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
        console.log(`======================================================`);
    } catch (error) {
        console.error(`Database Connection Error: ${(error as Error).message} `);
        process.exit(1);
    }
}

export default connectDB;