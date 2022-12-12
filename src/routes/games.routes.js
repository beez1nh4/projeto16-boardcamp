import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controller.js";
import { gameValidation } from "../middlewares/game.validation.js";
const router = Router();


router.get("/games", getGames);
router.post("/games", gameValidation, postGames);

export default router;