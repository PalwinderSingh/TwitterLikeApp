const tweet_queries = require("../db/queries/tweet_queries.js");
const config = require("../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const joi = require("joi")

//Schemas for fields validation
const tweetSchema = joi.object({
    txt: joi.string().min(1).max(500).required(),
}) 

module.exports = {

    async createTweet(req, res, next){
        try{
            const {error} =  tweetSchema.validate(req.body)

            if (error){
                res.status(400).send({error:error.details[0].message});
            }else{
                const txt = req.body.txt;
                let result =  await tweet_queries.add_tweet(txt, req.user._uname) 
                if (result.success && result.tweetId) { 
                      res.status(201).send({success:"Tweet created successfully!", tweetId: result.tweetId});
                }else{
                  res.status(500).send({error:"Sorry, Something went wrong while creating tweet!"});
                }  
            }
        }catch(err){
            console.log("Error in createTweet call: ",err)
            res.send(500).send({error:"Sorry, Something went wrong creating tweet!"});
        }
     
    },

    async getTweet(req, res, next){
        try{
            let tweetId = req.params.tweetId
            if(!tweetId){
                res.status(400).send({error:"Invalid tweet id!"});
            }else{

                let result =  await tweet_queries.getTweet(tweetId) 
                if (result.success && result.tweetDetails) { 
                      res.status(200).send({success:true, tweet:result.tweetDetails});
                }else if(result.notFound){
                  res.status(404).send({error:"Not found!"});
                }else{
                  res.status(500).send({error:"Sorry, Something went wrong fetching a tweet!"});
                }  
            }
                
        }catch(err){
            console.log("Error in getTweet call: ",err)
            res.status(500).send({error:"Sorry, Something went wrong fetching a tweet!"});
        }
    },

    async updateTweet(req, res, next){
         try{
            let tweetId = req.params.tweetId
            if(!tweetId){
                res.status(400).send({error:"Invalid tweet id!"});
            }else{
                const {error} =  tweetSchema.validate(req.body)

                if (error){
                    res.status(400).send({error:error.details[0].message});
                }else{
                    const txt = req.body.txt;
                    let result =  await tweet_queries.updateTweet(tweetId, txt, req.user._uname) 
                    if (result.success) { 
                          res.status(201).send({success:"Tweet updated successfully!"});
                    }else if(result.error && result.unauthorized){
                        //@TODO: consider using 404 instead?   
                        res.status(403).send({error:result.error});
                    }else{
                      res.status(500).send({error:"Sorry, Something went wrong while updating tweet!"});
                    }  
                }
            }
        }catch(err){
            console.log("Error in createTweet call: ",err)
            res.send(500).send({error:"Sorry, Something went wrong updating a tweet!"});
        }
    },

    async deleteTweet(req, res, next){
        try{
            let tweetId = req.params.tweetId
            if(!tweetId){
                res.status(400).send({error:"Invalid tweet id!"});
            }else{
                    let result =  await tweet_queries.deleteTweet(tweetId) 
                    if (result.success) { 
                          res.status(201).send({success:"Tweet deleted successfully!"});
                    }else{
                      res.status(500).send({error:"Sorry, Something went wrong while deleting a tweet!"});
                    }  
            }
        }catch(err){
            console.log("Error in deleteTweet call: ",err)
            res.send(500).send({error:"Sorry, Something went wrong deleting a tweet!"});
        }
    },
}