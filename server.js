import express from "express";
import dotenv from "dotenv";
import {connectRedis} from "./config/redisConfig.js";

import bloomFilter from "./routes/usernameRoute.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

await connectRedis();

app.get("/health", (req, res) => {
    res.send("Bloom Filter API is running");
});

// API's
app.use("/api/bloom-filter",bloomFilter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
