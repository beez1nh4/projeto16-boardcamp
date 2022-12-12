import { Router } from "express";
import { getCategories, postCategories } from "../controllers/categories.controller.js";
import { categoryValidation } from "../middlewares/category.validation.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", categoryValidation, postCategories);

export default router;