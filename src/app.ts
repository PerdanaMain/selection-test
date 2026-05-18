import express from "express";
import path from "path";

process.loadEnvFile?.();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware parsing form body HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Server  running on: http://localhost:${PORT}`);
});
