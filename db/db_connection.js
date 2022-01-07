var {createClient} = require('redis');
var config =  require("../config");

const redisClient =  createClient()
redisClient.connect()

redisClient.on('error', (err) => console.log("Sorry, An error occured in redis client",err));

redisClient.on('connect',()=>{
    console.log("Redis connected!")
    global.redisClient = redisClient
});

