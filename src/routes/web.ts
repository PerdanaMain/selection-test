import express from "express";
import { HomeController } from "../controllers/home.controller";

const route = express.Router();

route.get("/", HomeController.index);
// route.post("/analyze", HomeController.analyze);
// route.get("/edit/:id", HomeController.editMode);
// route.post("/update/:id", HomeController.update);
// route.get("/delete/:id", HomeController.delete);

export default route;
