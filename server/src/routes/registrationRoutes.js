import express from "express";
import { createRegistration } from "../controllers/registrationController.js";

const router = express.Router();

// Route to store registration data
router.post("/", createRegistration);

export default router;
