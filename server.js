import express from "express";
import dotenv from "dotenv";
import redis from "./config/redisConfig.js";

dotenv.config();

const app = express();

redis.connect().then(() => {
    console.log("Redis Connected Successfully");
}).catch((err) => {
    console.error("Redis connection error: ", err);
});

app.get("/health", (req, res) => {
    res.send("Bloom Filter API is running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
