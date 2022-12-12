import { Router } from "express";
import { deleteRentals, getRentals, postRentals, postRentalsReturn } from "../controllers/rentals.controller.js";
import { idCustomerValidation, rentalValidation } from "../middlewares/rental.validation.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", rentalValidation, idCustomerValidation, postRentals);
router.post("/rentals/:id/return", postRentalsReturn);
router.delete("/rentals/:id", deleteRentals);

export default router;