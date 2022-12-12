import { connectionDB } from "../database/db.js";
import { rentalSchema } from "../models/rentals.model.js";

export async function rentalValidation(req, res, next){
    const rental = req.body;
    const { error } = rentalSchema.validate(rental, { abortEarly: false });

    if (error) {
        console.log(error)
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
      }
    const gameExists = await connectionDB.query(
        "SELECT * FROM games WHERE id=$1;",
        [rental.gameId]
    );
  
    if (!gameExists.rows[0]) {
        return res
          .status(400)
          .send({ message: "Esse jogo não existe!" });
      }
    
    next()
}

export async function idCustomerValidation(req, res, next){
  const rental = req.body;
  
  const idExists = await connectionDB.query(
      "SELECT * FROM customers WHERE id=$1;",
      [rental.customerId]
  );

  if (!idExists.rows[0]) {
      return res
        .status(400)
        .send({ message: "Esse cliente não existe!" });
    }
  
  next()
}