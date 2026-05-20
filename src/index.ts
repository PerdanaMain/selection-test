import express from "express";
import route from "./routes/web";
import path from "path";

process.loadEnvFile?.();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", route);

// Only start the server if not running in Vercel environment
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
  });
}

export default app;
