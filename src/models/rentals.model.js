import joi from "joi";

export const rentalSchema = joi.object({
    customerId: joi.string().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().greater(0).required(),
  });