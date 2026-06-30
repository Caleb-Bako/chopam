import {Router} from "express";
import IntializePayment from "../controllers/PaymentController";
import { HandlePaystackWebhook } from "../controllers/WebhookController";

const router:Router = Router();

router.post("/initialize",IntializePayment);
router.post("/webhook", HandlePaystackWebhook);

const intialize = router;

export default intialize;