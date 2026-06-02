import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("AeroNexus Backend Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});