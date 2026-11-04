import {createClient} from 'redis';

const redis  = createClient({
    url: process.env.REDIS_URL,
});

redis.on("error",(err)=>{
    console.error("Redis connection error: ", err);
});

export const connectRedis = async () =>{
    if(!redis.isOpen){
        await redis.connect();
    }

    console.log("Redis Connected Successfully");
}

export default redis;