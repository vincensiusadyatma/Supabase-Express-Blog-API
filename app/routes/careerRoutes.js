import express from "express";
import multer from "multer";
import { store, index, show, destroy,update, getCareerByUser } from "../controllers/careerController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// CRUD Routes
router.post("/", authenticate, upload.single("image"), store); 
router.get("/", authenticate, index);
router.get("/:id", authenticate, show);
router.delete("/:id", authenticate, destroy);
router.put("/:id", authenticate, upload.single("image"), update);
router.get('/user/:uuid', getCareerByUser);

export default router;
