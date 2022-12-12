import joi from "joi";

export const rentalSchema = joi.object({
    customerId: joi.string().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().integer().greater(0).required(),
  });