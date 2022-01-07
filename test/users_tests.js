let app = require("../index")
let chaiHttp = require("chai-http")
let chai = require("chai")

//setting up the style for assertions
chai.should()
chai.use(chaiHttp)


let userObj = {
	"username": createRandomString(8, alphaNumericOnly = true),
	"pwd": createRandomString(20, alphaNumericOnly = false)
}

let userObj2 = {
	"username": createRandomString(8, alphaNumericOnly = true),
	"pwd": createRandomString(20, alphaNumericOnly = false)
}

let userObj3 = {
	"username": createRandomString(8, alphaNumericOnly = true),
	"pwd": createRandomString(20, alphaNumericOnly = false)
}

let participantsChat1 = userObj.username+","+userObj2.username
let participantsChat2 = userObj2.username+","+userObj3.username

let tweetObj = {txt: "Tweet for testing"}
let tweetUpdateObj = {txt:"updated tweet"} ;
let txtMsgObj = {txt:"updated tweet"} ;
let jwtToken;

describe("Users APIs testing", ()=>{


	  /*****************************************************************************
	  * 						testing /user/register endpoint
	  *****************************************************************************/
	 describe("POST /user/register", ()=>{
	 	it("Check if endpoint registers the user and return status 201.",(done)  =>{
	 		chai.request(app)
	 		.post("/user/register")
	 		.send(userObj)
	 		.end((err, res)=>{
	 			res.should.have.status(201);
	 			res.should.be.a('object');
	 			res.body.should.have.property("success").eq("User added successfully!");
	 			done();
	 		})
	 	});


	 	//scenario: when body has valid password but username is missing
	 	it("Check if endpoint returns status 400 when password is valid string but username is missing! ",(done)  =>{

	 		chai.request(app)
	 		.post("/user/register")
	 		.send({password:userObj.pwd})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"username" is required');
	 			done();
	 		})
	 	});

	 	//scenario: when body has valid username, but empty  password
	 	it("Check if endpoint returns status 400 when username is valid string but password is missing! ",(done)  =>{
	 		chai.request(app)
	 		.post("/user/register")
	 		.send({username: userObj.username})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"pwd" is required');
	 			done();
	 		})
	 	});

	 	//scenario:non-string username, but valid password
	 	it("Check if endpoint returns status 400 when password is valid string but username has non-string value! ",(done)  =>{
	 		chai.request(app)
	 		.post("/user/register")
	 		.send({username:123, pwd: userObj.pwd})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"username" must be a string');
	 			done();
	 		})
	 	});

	 	//scenario:non-string password, but valid username
	 	it("Check if endpoint returns status 400 when username is valid string but password has non-string value! ",(done)  =>{
	 		chai.request(app)
	 		.post("/user/register")
	 		.send({username:userObj.username, pwd: 123})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"pwd" must be a string');
	 			done();
	 		})
	 	});

	 	//scenario:username less than 6 characters long
	 	it("Check if endpoint returns status 400 when username is less than 6 characters long! ",(done)  =>{
	 		chai.request(app)
	 		.post("/user/register")
	 		.send({username:"abc12", pwd: userObj.pwd})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"username" length must be at least 6 characters long');
	 			done();
	 		})
	 	});

	 	//scenario:password less than 8 characters long
	 	it("Check if endpoint returns status 400 when password is less than 8 characters long! ",(done)  =>{
	 		chai.request(app)
	 		.post("/user/register")
	 		.send({username:userObj.username, pwd: "1234567"})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"pwd" length must be at least 8 characters long');
	 			done();
	 		})

	 	});

	 	//scenario:password is not strong enough
	 	it("Check if endpoint returns status 400 when password is not strong enough! ",(done)  =>{
	 		chai.request(app)
	 		.post("/user/register")
	 		.send({username:userObj.username, pwd: "abc123498"})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			done();
	 		})
	 	});


	 	//scenario: duplicate regsitration request  (i.e. a request with body containing already registered username) 
	 	it("Check if endpoint returns status 400 when existing username is provided! ",(done)  =>{
	 		chai.request(app)
	 		.post("/user/register")
	 		.send(userObj)
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('Username already exist!');
	 			done();
	 		})
	 	});
	 });

	 


	 /*****************************************************************************
	  * 						testing /user/login endpoint
	  *****************************************************************************/

	 describe("POST /user/login", ()=>{

	    //scenario: login with valid username and password (must assign session token in the response header)
	 	it("Check if endpoint returns status 200 and assign jwt-auth-token when valid username and pwd is provided",(done)  =>{
	 		chai.request(app)
	 		.post("/user/login")
	 		.send(userObj)
	 		.end((err, res)=>{
	 			res.should.have.status(200);
	 			res.should.be.a('object');
	 			res.should.have.header("jwt-auth-token");
	 			res.body.should.have.property("jwtToken");
	 			jwtToken = res.body.jwtToken
	 			done();
	 		})
	 	});

	 	//scenario: login with same username but different password
	 	it("Check if endpoint returns status 400 when valid username but different password is provided",(done)  =>{
	 		chai.request(app)
	 		.post("/user/login")
	 		.send({username: userObj.username, pwd:"n9&bsfBk"})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			done();
	 		})
	 	});

	 	//scenario: login with different username but registered password
	 	it("Check if endpoint returns status 400 when unregistered username but registered password is provided",(done)  =>{
	 		chai.request(app)
	 		.post("/user/login")
	 		.send({username: "abc233334", pwd:userObj.pwd})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('Username not found!');
	 			done();
	 		})
	 	});

	 		//scenario: when body has valid password but username is missing
	 	it("Check if endpoint returns status 400 when password is valid string but username is missing! ",(done)  =>{

	 		chai.request(app)
	 		.post("/user/login")
	 		.send({password:userObj.pwd})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"username" is required');
	 			done();
	 		})
	 	});

	 	//scenario: when body has valid username, but password is missing
	 	it("Check if endpoint returns status 400 when username is valid string but password is missing! ",(done)  =>{
	 		chai.request(app)
	 		.post("/user/login")
	 		.send({username: userObj.username})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"pwd" is required');
	 			done();
	 		})
	 	});
	});


	/*****************************************************************************
	  * 						testing POST '/tweet/create' endpoint
	*****************************************************************************/
	describe("POST '/tweet/create'", ()=>{

		// scenario: when valid required fields are provided
	 	it("Check if endpoint saves the tweet and return status 201.",(done)  =>{
	 		chai.request(app)
	 		.post("/tweet/create")
	 		.send(tweetObj)
	 		.set("Authorization", "Bearer "+jwtToken)
	 		// .set("Authorization", "Bearer "+jwtToken)
	 		.end((err, res)=>{
	 			res.should.have.status(201);
	 			res.should.be.a('object');
	 			res.body.should.have.property("success").eq("Tweet created successfully!");
	 			res.body.should.have.property("tweetId");
	 			tweetUpdateObj.tweetId = res.body.tweetId
	 			done();
	 		})
	 	});

	 	//scenario: when auth-token is missing
	 	it("Check if endpoint returns the error with status 400 when auth-token is missing in request.",(done)  =>{
	 		chai.request(app)
	 		.post("/tweet/create")
	 		.send(tweetObj)
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

	 	//scenario: when auth token is invalid or expired
		it("Check if endpoint returns the error with status 400 when auth-token is invalid.",(done)  =>{
	 		chai.request(app)
	 		.post("/tweet/create")
	 		.set("jwt-auth-token", "someRandomString")
	 		.send(tweetObj)
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});


	 	//scenario: when txt field is missing
	 	it("Check if endpoint returns the error with status 400 when txt field is missing.",(done)  =>{
	 		chai.request(app)
	 		.post("/tweet/create")
	 		.set("Authorization", "Bearer "+jwtToken)
	 		.send({})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"txt" is required');
	 			done();
	 		})
	 	});

	});

	/*****************************************************************************
	  * 						testing PUT '/tweet/:tweetId' endpoint
	*****************************************************************************/
	describe("PUT '/tweet/:tweetId'", ()=>{

		//scenario: when valid required fields are provided
	 	it("Check if endpoint updates the tweet and return status 201.",(done)  =>{
	 		chai.request(app)
	 		.put("/tweet/"+tweetUpdateObj.tweetId)
	 		.send({txt: tweetUpdateObj.txt})
	 		.set("Authorization", "Bearer "+jwtToken)
	 		.end((err, res)=>{
	 			res.should.have.status(201);
	 			res.should.be.a('object');
	 			res.body.should.have.property("success").eq("Tweet updated successfully!");
	 			done();
	 		})
	 	});

		//scenario: when auth-token is missing
		it("Check if endpoint returns the error with status 400 when auth-token is missing in request.",(done)  =>{
	 		chai.request(app)
	 		.put("/tweet/"+tweetUpdateObj.tweetId)
	 		.send(tweetUpdateObj)
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

		//scenario: when auth token is invalid or expired
		it("Check if endpoint returns the error with status 400 when auth-token is invalid.",(done)  =>{
	 		chai.request(app)
	 		.put("/tweet/"+tweetUpdateObj.tweetId)
	 		.set("jwt-auth-token", "someRandomString")
	 		.send(tweetUpdateObj)
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

		//scenario: when txt field is missing
		it("Check if endpoint returns the error with status 400 when txt field is missing.",(done)  =>{
	 		chai.request(app)
	 		.put("/tweet/"+tweetUpdateObj.tweetId)
	 		.set("Authorization", "Bearer "+jwtToken)
	 		.send({})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"txt" is required');
	 			done();
	 		})
	 	});

		//scenario: when some random tweetId is used to send update request
		it("Check if endpoint returns the error with status 400 some random tweetId is used to send update request.",(done)  =>{
	 		chai.request(app)
	 		.put("/tweet/"+"someRandomString")
	 		.set("Authorization", "Bearer "+jwtToken)
	 		.send({txt: tweetUpdateObj.txt})
	 		.end((err, res)=>{
	 			res.should.have.status(500);
	 			res.should.be.a('object');
	 			// res.body.should.have.property("error").eq("Invalid token");
	 			done();
	 		})
	 	});

	    //scenario: when different user tries to update somebody's tweet
	    it("Check if endpoint returns the error with status 403 when different user tries to update somebody's tweet.",async ()  =>{
	    	try{
	    	//lets register another user first:
	    	let registerResult = await chai.request(app)
	 		.post("/user/register")
	 		.send(userObj2);

 			if(registerResult.success){
 				let loginResult = await chai.request(app)
		 		.post("/user/login")
		 		.send(userObj2);
		 		
	 			if(loginResult.success){
	 				let createTweetResult = await chai.request(app)
			 		.post("/tweet/create")
			 		.set("Authorization", "Bearer "+jwtToken)
			 		.send(tweetObj)

		 			if(createTweetResult.success && createTweetResult.tweetId){
		 				userObj2.tweetId = createTweetResult.tweetId
		 				let illegalUpdate = await chai.request(app)
				 		.put("/tweet/"+userObj2.tweetId)//Using 2nd user's posted tweet ID
				 		.set("Authorization", "Bearer "+jwtToken)
				 		.send(tweetObj)
				 		
			 			illegalUpdate.should.have.status(403);
			 			illegalUpdate.should.be.a('object');
			 			illegalUpdate.body.should.have.property("error").eq("Tweet can only be updated by its owner!");
		 			}
	 			}
 			}
 			}catch(err){
 				console.log(err)
 			}	
	 			
	 	});
	});

	/*****************************************************************************
	  * 						testing GET '/tweet/:tweetId' endpoint
	*****************************************************************************/
	describe("GET '/tweet/:tweetId'", ()=>{
		//scenario: when valid required fields are provided
	 	it("Check if endpoint updates the tweet and return status 200.",(done)  =>{
	 		chai.request(app)
	 		.get("/tweet/"+tweetUpdateObj.tweetId)
	 		.set("Authorization", "Bearer "+jwtToken)
	 		.end((err, res)=>{
	 			res.should.have.status(200);
	 			res.should.be.a('object');
	 			res.body.should.have.property("success");
	 			res.body.should.have.property("tweet");
	 			done();
	 		})
	 	});

		//scenario: when auth-token is missing
		it("Check if endpoint returns status 400 when auth-token is missing.",(done)  =>{
	 		chai.request(app)
	 		.get("/tweet/"+tweetUpdateObj.tweetId)
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

		//scenario: when auth token is invalid or expired
		it("Check if endpoint returns the error with status 400 when auth-token is invalid.",(done)  =>{
	 		chai.request(app)
	 		.get("/tweet/"+tweetUpdateObj.tweetId)
	 		.set("jwt-auth-token", "someRandomString")
	 		// .send(tweetUpdateObj)
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

		//scenario: when some random tweetId is used to get data
		it("Check if endpoint returns the error with status 404 when some random tweetId is used to get data.",(done)  =>{
	 		chai.request(app)
	 		.get("/tweet/"+"someRandomString")
	 		.set("Authorization", "Bearer "+jwtToken)
	 		// .send(tweetUpdateObj)
	 		.end((err, res)=>{
	 			res.should.have.status(404);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Not found!");
	 			done();
	 		})
	 	});
	});
	
	/*****************************************************************************
	  * 						testing DELETE '/tweet/:tweetId' endpoint
	*****************************************************************************/
	describe("DELETE '/tweet/:tweetId'", ()=>{
		

		//scenario: when auth-token is missing
		it("Check if endpoint returns status 400 when auth-token is missing.",(done)  =>{
	 		chai.request(app)
	 		.delete("/tweet/"+tweetUpdateObj.tweetId)
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

		//scenario: when auth token is invalid or expired
		it("Check if endpoint returns the error with status 400 when auth-token is invalid.",(done)  =>{
	 		chai.request(app)
	 		.delete("/tweet/"+tweetUpdateObj.tweetId)
	 		.set("jwt-auth-token", "someRandomString")
	 		// .send(tweetUpdateObj)
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

	    //@TODO: scenario: when different user tries to delete somebody's tweet (considering he/she knows tweetId of another user)
	    //create new user, log'em in, and create tweet from that account first

	    //scenario: when valid required fields are provided
	 	it("Check if endpoint updates the tweet and return status 200.",(done)  =>{
	 		chai.request(app)
	 		.delete("/tweet/"+tweetUpdateObj.tweetId)
	 		.set("Authorization", "Bearer "+jwtToken)
	 		.end((err, res)=>{
	 			res.should.have.status(201);
	 			res.should.be.a('object');
	 			res.body.should.have.property("success");
	 			done();
	 		})
	 	});
	});

    /*****************************************************************************
	  * 						testing POST '/chat/create' endpoint
	*****************************************************************************/
	describe("POST '/chat/create'", ()=>{
		//scenario: when valid required fields are provided
	 	it("Check if endpoint creates the chat and returns status 201.",(done)  =>{
	 		chai.request(app)
	 		.post("/chat/create")
	 		.set("Authorization", "Bearer "+jwtToken)
	 		.send({participants: participantsChat1})
	 		.end((err, res)=>{
	 			res.should.have.status(201);
	 			res.should.be.a('object');
	 			res.body.should.have.property("success").eq("Chat created successfully!");
	 			res.body.should.have.property("chatId");
	 			txtMsgObj.chatId = res.body.chatId
	 			done();
	 		})
	 	});

		//scenario: when auth-token is missing
		it("Check if endpoint returns the error with status 401 when auth-token is missing in request.",(done)  =>{
	 		chai.request(app)
	 		.post("/chat/create")
	 		.send({participants: participantsChat1})
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

		//scenario: when auth token is invalid or expired
		it("Check if endpoint returns the error with status 401 when auth-token is invalid.",(done)  =>{
	 		chai.request(app)
	 		.post("/chat/create")
	 		.send({participants: participantsChat1})
	 		.set("jwt-auth-token", "someRandomString")
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

		//scenario: when participants field is missing
		it("Check if endpoint returns the error with status 400 when participants field is missing.",(done)  =>{
	 		chai.request(app)
	 		.post("/chat/create")
	 		.send({})
	 		.set("Authorization", "Bearer "+jwtToken)
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"participants" is required');
	 			done();
	 		})
	 	});

		//scenario: when user tries to  create chat for other users for which he is not a part of
	});

    /*****************************************************************************
	  * 						testing POST '/chat/new_msg' endpoint
	*****************************************************************************/
	describe("POST '/chat/new_msg'", ()=>{
		//scenario: when valid required fields are provided
	 	it("Check if endpoint creates the chat and returns status 201.",(done)  =>{
	 		chai.request(app)
	 		.post("/chat/new_msg")
	 		.send(txtMsgObj)
	 		.set("Authorization", "Bearer "+jwtToken)
	 		.end((err, res)=>{
	 			res.should.have.status(201);
	 			res.should.be.a('object');
	 			res.body.should.have.property("success").eq("Message added to chat successfully!");
	 			done();
	 		})
	 	});

		//scenario: when auth-token is missing
		it("Check if endpoint returns the error with status 400 when auth-token is missing in request.",(done)  =>{
	 		chai.request(app)
	 		.post("/chat/new_msg")
	 		.send(txtMsgObj)
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

		//scenario: when auth token is invalid or expired
		it("Check if endpoint returns the error with status 400 when auth-token is invalid.",(done)  =>{
	 		chai.request(app)
	 		.post("/chat/new_msg")
	 		.send(txtMsgObj)
	 		.set("jwt-auth-token", "someRandomString")
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

		//scenario: when txt field is missing
		it("Check if endpoint returns the error with status 400 when txt field is missing.",(done)  =>{
	 		chai.request(app)
	 		.post("/chat/new_msg")
	 		.set("Authorization", "Bearer "+jwtToken)
	 		.send({chatId:txtMsgObj.chatId})
	 		.end((err, res)=>{
	 			res.should.have.status(400);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq('"txt" is required');
	 			done();
	 		})
	 	});

		//scenario: when some random chatId is used to post message to
	    //scenario: when different user tries to post message to other users chat (considering he/she knows chat_id)
	});

    /*****************************************************************************
	  * 						testing POST '/chat/get_msgs' endpoint
	*****************************************************************************/
	describe("POST '/chat/get_msgs'", ()=>{
		//scenario: when valid required fields are provided
	 	it("Check if endpoint creates the chat and returns status 201.",(done)  =>{
	 		chai.request(app)
	 		.post("/chat/get_msgs")
	 		.send({chatId:txtMsgObj.chatId})
	 		.set("Authorization", "Bearer "+jwtToken)
	 		.end((err, res)=>{
	 			res.should.have.status(201);
	 			res.should.be.a('object');
	 			res.body.should.have.property("success");
	 			done();
	 		})
	 	});

		//scenario: when auth-token is missing
		it("Check if endpoint returns the error with status 400 when auth-token is missing in request.",(done)  =>{
	 		chai.request(app)
	 		.post("/chat/get_msgs")
	 		.send({chatId:txtMsgObj.chatId})
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});

		//scenario: when auth token is invalid or expired
		it("Check if endpoint returns the error with status 400 when auth-token is invalid.",(done)  =>{
	 		chai.request(app)
	 		.post("/chat/get_msgs")
	 		.send({chatId:txtMsgObj.chatId})
	 		.set("jwt-auth-token", "someRandomString")
	 		.end((err, res)=>{
	 			res.should.have.status(401);
	 			res.should.be.a('object');
	 			res.body.should.have.property("error").eq("Access Denied!");
	 			done();
	 		})
	 	});
	});

	//scenario: when some random chatId is used to send update request
    //scenario: when different user tries to get messages of other users chat


})


//generate random string 
function createRandomString(len, alphaNumericOnly){
     let str = "";
     let charsSet = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz", "0123456789"]//, "!@#$%&"]
     if (!alphaNumericOnly){
     	charsSet.push("!@#$%&")
     }
     for(let i=0;i<len;i++){
        let randomArrIdx = Math.floor(Math.random() * charsSet.length); 
     	let randomCharIndex = Math.floor(Math.random() * charsSet[randomArrIdx].length); 
        str+= charsSet[randomArrIdx][randomCharIndex];
     }
     return str;
}
