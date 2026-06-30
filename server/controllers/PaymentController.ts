import { Response,Request } from "express";
import Order, { IOrder } from "../models/Order";

const IntializePayment = async(req:Request,res:Response) => {
    const {orderId} = req.body;

    if(!orderId){
        res.status(400).json({message:"Order Id must be filled"});
        return;
    }

    try {
        const order = await Order.findOne({ orderId }).lean();
        if (!order) {
            res.status(400).json({ message: "Order not found" });
            return;
        }
        console.log(order);
        const amountInKobo = order.total_price * 100;

        const response = await fetch(
          "https://api.paystack.co/transaction/initialize",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "customer@chopam.com", // In production, use the user's real email
              amount: amountInKobo,
              reference: orderId,
              callback_url: `http://localhost:3000/track/${orderId}`,
            }),
          },
        );

        const paymentData = await response.json();

        if (!response.ok) {
            res
              .status(400)
              .json({
                message: "Paystack initialization failed",
                error: paymentData,
              });
            return;
        }

        res.status(200).json({
            authorization_url:paymentData.data.authorization_url,
            reference:paymentData.reference
        });
        
        
    } catch (error) {
        console.error("Payment initialization error:", error);
        res
          .status(500)
          .json({ message: "Server error during payment configuration." });
    }

}

export default IntializePayment;