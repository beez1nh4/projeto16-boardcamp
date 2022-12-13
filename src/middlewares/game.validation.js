import { connectionDB } from "../database/db.js";
import { gameSchema } from "../models/games.model.js";

export async function gameValidation(req, res, next){
    const game = req.body;
    const { error } = gameSchema.validate(game, { abortEarly: false });

    if (error) {
        console.log(error)
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
      }

    const nameExists = await connectionDB.query(
        "SELECT * FROM games WHERE name=$1;",
        [game.name]
    );
  
    if (nameExists.rows[0]) {
        return res
          .status(409)
          .send({ message: "Esse jogo já existe!" });
      }
    
    next()
}