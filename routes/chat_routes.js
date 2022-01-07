const chatRouter = require("express").Router();
const bodyParser = require("body-parser");
chatRouter.use(bodyParser.json());
const config = require("../config");
const middleware = require("../routes/middlewares");
const chatController = require("../controllers/chat_controller");

//@TODO: protect endpoints from DDoS attacks

chatRouter.post('/create', middleware.authenticate(), chatController.createChat)

chatRouter.post('/new_msg', middleware.authenticate(), chatController.new_msg)

chatRouter.post('/get_msgs', middleware.authenticate(), chatController.getChatMessages)


module.exports = chatRouter;