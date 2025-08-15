import express from "express";
import cors from "cors";
import flagRoutes from "./routes/flagRoutes.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/flags/upload", flagRoutes);
console.log("Flag routes mounted at /api/flags/upload");


app.listen(5000, () => console.log("Server running on port 5000"));

