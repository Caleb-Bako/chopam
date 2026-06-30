import { Request, Response } from "express";
import Order from "../models/Order";
import { io } from "../index"; // Import your live socket instance to broadcast the update

export const HandlePaystackWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const event = req.body;

    // 1. Listen specifically for the successful charge event from Paystack
    if (event.event === "charge.success") {
      const orderId = event.data.reference; // Paystack passes back our OrderId here!
      const paymentReference = event.data.id;

      console.log(
        `[Webhook]: Payment confirmed for Order ${orderId}. Reference: ${paymentReference}`,
      );

      // 2. Update the order status in MongoDB
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        {
          status: "Preparing", // Instantly move it to the chef's queue!
          is_paid: true,
        },
        { new: true },
      );

      if (updatedOrder) {
        // 3. Shouting across the WebSocket pipeline to update the customer's tracking screen instantly!
        io.to(orderId).emit("orderStatusUpdated", { status: "Preparing" });
        console.log(
          `[Socket]: Broadcasted 'Preparing' status to room ${orderId}`,
        );
      }
    }

    // Paystack requires a 200 OK response within 2 seconds to acknowledge receipt
    res.status(200).send("Webhook Received");
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ message: "Internal Webhook Error" });
  }
};
