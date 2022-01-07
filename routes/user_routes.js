const userRouter = require("express").Router();
const bodyParser = require("body-parser");
userRouter.use(bodyParser.json());
const config = require("../config");
const middleware = require("../routes/middlewares");
const userController = require("../controllers/user_controller");

//@TODO: protect endpoints from DDoS attacks

userRouter.post('/register', userController.register)
userRouter.post('/login',userController.login);





module.exports = userRouter;