import express from "express";
import multer from "multer";
import { store, index, show, destroy,update } from "../controllers/pressReleaseController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// CRUD Routes
router.post("/", authenticate, upload.array("contents[]", 10), store);
router.get("/", authenticate, index);
router.get("/:id", authenticate, show);
router.delete("/:id", authenticate, destroy);
router.put("/:id", authenticate, upload.array("contents[]", 10), update);


export default router;
