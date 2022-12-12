import joi from "joi";

export const gameSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().email().required().min(10).max(11).regex(/^\d+$/),
    cpf: joi.string().required().length(11).regex(/^\d+$/),
    birthday: joi.string().required().date(),
  });