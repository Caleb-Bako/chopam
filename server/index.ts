import express, { Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import {Server} from "socket.io";
import connectDB from "./config/db";
import router from "./routes/menuRoutes";
import OrderRoutes from "./routes/orderRoutes";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});


connectDB();
app.use(express.json());

app.use("/api/menu",router);
app.use("/api/order", OrderRoutes);

//Setup for core Web socket event listener
io.on("connection", (socket)=>{
    console.log(`[Socket]: A device connected. Socket ID: ${socket.id}`);

    //When user opens their tracking page, they join a dedicated room for their specific order
    socket.on("joinOrderRoom", (orderId:string)=>{
        socket.join(orderId);
        console.log(
          `[Socket]: Device joined dedicated tracking room: ${orderId}`,
        );
    });

    socket.on("disconnect", () => {
        console.log(`[Socket]: Device disconnected. ID: ${socket.id}`);
  });
})

server.listen(PORT,()=>{
    console.log(`[Server]: Kitchen is open and listening on port ${PORT}`);
});