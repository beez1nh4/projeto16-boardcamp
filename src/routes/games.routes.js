import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controller.js";
const router = Router();


router.get("/games", getGames);
//router.post("/games", gamesValidation, postGames);

export default router;