import { Request,Response } from "express"
import Menu from "../models/MenuItem"

const GetMenu = async (req:Request,res:Response): Promise<void> => {
    try {
        const menuItems = await Menu.find({is_available: true});
    
        res.status(200).json(menuItems);
    } catch (error) {
        console.error("Error fetching menu items:", error);
        res
          .status(500)
          .json({ message: "Server error. Could not retrieve menu." });
    }

}

export default GetMenu;