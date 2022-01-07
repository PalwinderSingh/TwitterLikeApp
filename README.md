# TwitterLikeApp

A Twitter like dummy app


## Dependencies
> 1. Node.js<br>
> 2. Redis


## Installation:
1. cd to root directory of the project and run `npm install`<br>
2. run `npm install` to install all the required packages<br>
3. For testing, run: `npm test` 


## Stored data structure(Redis):
```
 		1. "users":
				<username1> : hashed_pwd
				<username2> : hashed_pwd
				...

		

		2. "tweets":
				<tweetId> :  '{tweetId: <tweetCount>, txt:<txt>, username: <username>, createdAt:<Date.now()>}'
				...


		3. "tweets_count": <count>


		4. <username>"_tweets" : 
						<tweetId1> : ""
						<tweetId2> : ""
						...


		5. <chat_username1:username2>":
					<msgId> :  {msgId: <chatMsgsCount>, txt:<txt>, sender: <username>, sentAt:<Date.now()>}
					...


		6. <chatId>"_msgsCount": <msgsCount>

		7. (Currently not implemented)

			"<username>_chats":  
							<chatId3>
							<chatId7>
							...

```
