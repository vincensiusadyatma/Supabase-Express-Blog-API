import express from "express";
import multer from "multer";
import { store, index, show, destroy,update } from "../controllers/pressReleaseController.js";

const router = express.Router();

// Konfigurasi multer (gunakan memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// CRUD Routes
router.post("/", upload.array("contents[]", 10), store);
router.get("/", index);
router.get("/:id", show);
router.delete("/:id", destroy);
router.put("/:id", upload.array("contents[]", 10), update);


export default router;
