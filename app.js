const express = require('express');
const app = express();
const mongoose = require("mongoose");
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');
const port = process.env.PORT || 3000;
const postRouter = require("./routes/postRoutes"); 
const userRouter = require('./routes/userRoutes');
const session = require('express-session');
const redis = require('redis');
let RedisStore = require('connect-redis').default
let redisClient = redis.createClient({
    socket: {
        host: REDIS_URL,
        port: REDIS_PORT
    }
})

app.use(express.json());

mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
.then(()=> console.log("Connected to DB"))
.catch((err)=> console.log(err));

app.get("/",(req,res)=>{
    res.send("<h2>Hi There!!</h2>");
});

//connect redis
redisClient.connect().catch(console.error);

app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 3000000
    }
}))

app.use("/api/v1/posts",postRouter);
app.use("/api/v1/users",userRouter);

app.listen(port, ()=> console.log(`Listening on port ${port}`));