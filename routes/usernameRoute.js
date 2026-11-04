import express from "express";
import { addUsername,checkUsername } from "../controllers/bloomFilterController.js";


const router = express.Router();

router.post("/",addUsername);
router.get("/:username",checkUsername);

export default router