var self = module.exports = {
 
    add_tweet: (txt, username) => {
        return new Promise(async (resolve)=>{
            try{
                //get the total count of tweets
                //@NOTE: tweets total count is used as new tweet's Id
                let tweetCount = await redisClient.GET("tweets_count", username)
                if (!tweetCount)
                    tweetCount = "0"

                let tweetDetails = {tweetId: tweetCount, txt:txt, username: username, createdAt:Date.now()}
                
                /**
                 * Using transactional approach to avoid partial writes:
                 * 1. Increment tweetCount
                 * 2. set tweet data with tweetId as :oldTweetCount  
                 * 3. add tweet_id under actual owner of tweet using hash: "<username>_tweets"
                 * */
                const [incrResult,setTweetResult, setUserTweetResult] = await redisClient.multi()
                                                    .INCR('tweets_count')
                                                    .HSETNX("tweets", tweetCount, JSON.stringify(tweetDetails))
                                                    .HSETNX(username+"_tweets", tweetCount, "")
                                                    .exec(); 

                if (incrResult && setTweetResult && setUserTweetResult){
                    resolve({success:true, tweetId: tweetDetails.tweetId})
                }else{
                    resolve({error:true})
                }
            }catch(err){
                console.log(err)
                resolve({error:true})
            }
        })//Promise ends here
    },

    getTweet: (tweetId) => {
        return new Promise(async (resolve)=>{
            try{
                const tweetDetails = await redisClient.HGET("tweets", tweetId+"")
                if (tweetDetails){
                    resolve({success:true, tweetDetails:  JSON.parse(JSON.stringify(JSON.parse(tweetDetails)))})
                }else{
                    resolve({error:true, notFound : true})
                } 
            }catch(err){
                console.log(err)
                resolve({error:true})
            }
        
        })//Promise ends here
    },

    updateTweet: (tweetId, txt, username) => {
        return new Promise(async (resolve)=>{
            try{
                let getTweetResult = await self.getTweet(tweetId)
                if(getTweetResult.error || !getTweetResult.tweetDetails){
                    resolve({error:"tweet doesn't exist", notFound:true})
                }else if(getTweetResult.tweetDetails.username !== username){
                    resolve({error:"Tweet can only be updated by its owner!", unauthorized:true})
                }else{
                    getTweetResult.tweetDetails.txt = txt
                    await redisClient.HSET("tweets", tweetId+"", JSON.stringify(getTweetResult.tweetDetails) )
                    resolve({success:true})
                }
                
            }catch(err){
                console.log(err)
                resolve({error:true})
            }
        })//Promise ends here
    },

    deleteTweet: (tweetId) => {
        return new Promise(async (resolve)=>{
            try{
                const success = await redisClient.HDEL("tweets", tweetId+"" )
                if (success){
                    resolve({success:true})
                }else{
                    resolve({error:true})
                } 
            }catch(err){
                console.log(err)
                resolve({error:true})
            }
        })//Promise ends here
    },

}