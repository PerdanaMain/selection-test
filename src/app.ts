import express from "express";
import route from "./routes/web";
import path from "path";

process.loadEnvFile?.();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware parsing form body HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
console.log('path views: ', path.join(__dirname, "views"));

app.use("/", route);

app.listen(PORT, () => {
  console.log(`Server  running on: http://localhost:${PORT}`);
});
