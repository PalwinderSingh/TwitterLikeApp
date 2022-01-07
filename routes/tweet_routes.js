const tweetRouter = require("express").Router();
const bodyParser = require("body-parser");
tweetRouter.use(bodyParser.json());
const config = require("../config");
const middleware = require("../routes/middlewares");
const tweetController = require("../controllers/tweet_controller");

//@TODO: protect endpoints from DDoS attacks

tweetRouter.post('/create', middleware.authenticate(), tweetController.createTweet)

tweetRouter.get('/:tweetId', middleware.authenticate(), tweetController.getTweet)

tweetRouter.put('/:tweetId', middleware.authenticate(), tweetController.updateTweet);

tweetRouter.delete('/:tweetId',middleware.authenticate(), tweetController.deleteTweet);

module.exports = tweetRouter;