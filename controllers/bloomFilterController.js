import redis from '../config/redisConfig.js';

const BLOOM_FILTER_KEY = "users:bloomfilter";

export const addUsername = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || typeof username !== "string") {
            return res.status(400).json({
                sucess: false,
                message: "Username is required",
            });
        }

        const normalizedUsername = username.trim().toLowerCase();

        if (!normalizedUsername) {
            return res.status(400).json({
                sucess: false,
                message: "Username cannot be empty",
            });
        }

        const exists = await redis.exists(BLOOM_FILTER_KEY);

        if (!exists) {
            await redis.sendCommand([
                "BF.RESERVE",
                BLOOM_FILTER_KEY,
                "0.01",
                "100000",
            ]);
        }

        // add username to Bloom Filter
        const result = await redis.sendCommand([
            "BF.ADD",
            BLOOM_FILTER_KEY,
            normalizedUsername,
        ]);

        const added = Number(result) === 1;

        return res.status(200).json({
            sucess: true,
            username: normalizedUsername,
            added,
            message:
                    added
                    ? "Username added to Bloom Filter"
                    : "Username might already exist",
        });
    } catch (err) {
        console.error("Bloom Filter add error:", err);
        return res.status(500).json({
            sucess: false,
            message: "Failed to add username",
        });
    }
};


// Check username in Bloom Filter 

export const checkUsername = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username || !username.trim()) {
            return res.status(400).json({
                sucess: false,
                message: "Username is required",
            });
        }

        const normalizedUsername = username.trim().toLowerCase();

        const exists = await redis.sendCommand([
            "BF.EXISTS",
            BLOOM_FILTER_KEY,
            normalizedUsername,
        ]);

        const mightExist = Number(exists) === 1;

        return res.status(200).json({
            success: true,
            username: normalizedUsername,
            mightExist,
            message: mightExist
                ? "Username might exists"
                : "Username does not exists",
        });

    } catch (err) {
        console.error("Bloom Filter Check Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to check username",
        });
    }
}

