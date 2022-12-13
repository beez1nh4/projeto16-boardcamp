import { Router } from "express";
import { deleteRentals, getRentals, postRentals, postRentalsReturn } from "../controllers/rentals.controller.js";
import { idCustomerValidation, idRentalValidation, rentalValidation } from "../middlewares/rental.validation.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", rentalValidation, idCustomerValidation, postRentals);
router.post("/rentals/:id/return", idRentalValidation, postRentalsReturn);
router.delete("/rentals/:id", idRentalValidation, deleteRentals);

export default router;