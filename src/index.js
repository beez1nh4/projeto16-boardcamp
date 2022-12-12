import express from "express";
import categoriesRoutes from "./routes/categories.routes.js"
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(categoriesRoutes);

const port = process.env.PORT;
app.listen(5000, () => console.log(`Server running in port: 5000`));