const express = require("express");
const userRoutes =  require("./routes/user_routes.js");
const tweetRoutes =  require("./routes/tweet_routes.js");
const chatRoutes =  require("./routes/chat_routes.js");
const app = express();
var config = require("./config.json");
require("./db/db_connection.js");

app.disable("x-powered-by");//to avoid revealing what server we are using in response headers

app.use('/user/', userRoutes);
app.use('/tweet/', tweetRoutes);
app.use('/chat/', chatRoutes);

const server = app.listen(config._APP_PORT, function(){
  console.log("App is running on port "+ config._APP_PORT);
});

module.exports = app;