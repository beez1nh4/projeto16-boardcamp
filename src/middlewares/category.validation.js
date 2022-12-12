import { connectionDB } from "../database/db.js";
import { categorySchema } from "../models/categories.model.js";

export async function categoryValidation(req, res, next){
    const category = req.body;
    const { error } = categorySchema.validate(category, { abortEarly: false });

    if (error) {
        console.log(error)
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
      }

    const categoryExists = await connectionDB.query(
        "SELECT * FROM categories WHERE name=$1",
        [category.name]
    );

    if (categoryExists.rows[0]) {
        return res
          .status(409)
          .send({ message: "Essa categoria já existe!" });
      }
    
    next()
}