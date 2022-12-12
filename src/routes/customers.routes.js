import { Router } from "express";
import { getCustomers, getCustomersById, postCustomers, putCustomers } from "../controllers/customers.controller.js";
import { customerValidation } from "../middlewares/customer.validation.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomersById);
router.post("/customers", customerValidation, postCustomers);
router.put("/customers/:id", customerValidation, putCustomers);

export default router;