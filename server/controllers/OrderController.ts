import { Request, Response } from "express";
import Order, { ICartItem } from "../models/Order";
import { io } from "..";

const CreateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_name, delivery_address, items } = req.body;
    // 1. TODO: Validate that name, address, and items exist.
    if (
      !customer_name ||
      !delivery_address ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      res
        .status(400)
        .json({
          message:
            "All parameters must be filled, and cart items cannot be empty.",
        });
      return; // Stops execution immediately if validation fails
    }

    // 2. TODO: Generate a random string for the orderId (e.g., "CHOP-" + Math.floor(1000 + Math.random() * 9000))
    const orderId = "CHOP-" + Math.floor(1000 + Math.random() * 9000);

    // 3. TODO: Calculate the total price.
    // Loop through the 'items' array, multiply each item's 'price_at_purchase' by its 'quantity', and sum them up.
    let total = 0;
    items.forEach((item:ICartItem) => {
      let price = item.price_at_purchase * item.quantity;
      total += price;
    });

    console.log("Total:",total)
    // 4. TODO: Use Order.create() to save the document to Atlas.
    const newOrder = await Order.create({
      orderId,
      customer_name,
      delivery_address,
      items,
      total_price: total,
    });
    // 5. TODO: Respond with a 201 status and send back the created order object.
    res.status(201).json({ newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error. Could not process order." });
  }
};

const UpdateOrderStatus = async (req:Request, res:Response): Promise<void> => {
  const { orderId,status } = req.body;

  if(!orderId || !status){
    res.status(400).json({
      message: "All parameters must be filled",
    });
    return;
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { returnDocument: "after" },
    );

    // 3. Safety Check: What if the kitchen passed a fake or broken orderId?
    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found with that ID" });
      return;
    }

    io.to(orderId).emit("orderStatusUpdated", { status });
    console.log(`[Socket] Broadcasted status update for ${orderId}: ${status}`);

    res.status(200).json({updatedOrder});
  } catch (error) {
    console.error("Error in updating status:", error);
    res.status(500).json({ message: "Server error. Could not update status." });
  }

};

const GetKitchenOrders = async (req:Request,res:Response):Promise<void> => {
  try {
    const activeOrders = await Order.find({
      status: { $ne: "Completed" }
    }).sort({createdAt: -1});

    res.status(200).json(activeOrders);
  } catch (error) {
    console.error("Error fetching kitchen orders:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not retrieve kitchen dashboard." });
  }
}

export {CreateOrder,UpdateOrderStatus,GetKitchenOrders};
