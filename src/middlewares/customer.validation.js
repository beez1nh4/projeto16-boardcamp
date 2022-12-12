import { connectionDB } from "../database/db.js";
import { customerSchema } from "../models/customers.model.js";

export async function customerValidation(req, res, next){
    const customer = req.body;
    const { error } = customerSchema.validate(customer, { abortEarly: false });

    if (error) {
        console.log(error)
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
      }

    const customerExists = await connectionDB.query(
        'SELECT * FROM customers WHERE cpf=$1',
        [customer.cpf]
    );

    if (customerExists.rows[0]) {
        return res
          .status(409)
          .send({ message: "Esse cliente já existe!" });
      }
    
    next()
}