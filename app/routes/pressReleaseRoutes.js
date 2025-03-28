import express from "express";
import multer from "multer";
import { store, index, show, destroy, update, getPressByUser } from "../controllers/pressReleaseController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Setup multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });



// CRUD Routes
router.post("/", authenticate, upload.any(), store);
router.get("/", authenticate, index);
router.get("/:id", authenticate, show);
router.delete("/:id", authenticate, destroy);
router.put("/:id", authenticate, upload.any(), update);
router.get("/user/:uuid", authenticate, getPressByUser);

export default router;
