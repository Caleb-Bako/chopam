import { Router } from "express";
import GetMenu from "../controllers/MenuController";

const router:Router = Router();

router.get("/",GetMenu);

export default router;