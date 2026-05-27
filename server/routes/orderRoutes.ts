import { Router } from "express";
import { CreateOrder, GetKitchenOrders, UpdateOrderStatus } from "../controllers/OrderController";

const router: Router = Router();

// ROUTE: POST /api/orders
// DESC:  Submit a new customer order
router.post("/", CreateOrder);
router.patch("/update-status", UpdateOrderStatus);
router.get("/kitchen", GetKitchenOrders);


const OrderRoutes = router;
export default OrderRoutes;
