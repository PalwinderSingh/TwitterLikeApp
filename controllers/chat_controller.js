const chat_queries = require("../db/queries/chat_queries.js");
const config = require("../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const joi = require("joi")

//Schemas for fields validation
const createChatSchema = joi.object({
    //participants list must be in array wrapped in stringified JSON object with key : "list"
    participants: joi.string().min(14).required()
}) 


const addMsgSchema = joi.object({
    txt: joi.string().min(1).max(500).required(),
    chatId: joi.string().min(13).required(),
}) 



module.exports = {

      async createChat(req, res, next){
        try{
            const {error} =  createChatSchema.validate(req.body)

            if (error){
                res.status(400).send({error:error.details[0].message});
            }else{
                let participants = req.body.participants.split(",");

                //@TODO: limit number of participants in a chat?
                if(participants.length<=1){
                    res.status(400).send({error:"chat must have more than users!"});
                }else{
                    let result =  await chat_queries.createChat(participants) 
                    if (result.success) { 
                          res.status(201).send({success:"Chat created successfully!",chatId: result.chatId});
                    }else{
                      res.status(500).send({error:"Sorry, Something went wrong while creating chat!"});
                    }  
                }

                
            }
        }catch(err){
            console.log("Error in createChat call: ",err)
            res.send(500).send({error:"Sorry, Something went wrong creating chat!"});
        }
     
    },


    async new_msg(req, res, next){
        try{
            const {error} =  addMsgSchema.validate(req.body)

            if (error){
                res.status(400).send({error:error.details[0].message});
            }else{
                const txt = req.body.txt;
                const chatId = req.body.chatId;

                //only participants of chat should be able to access chat data
                if (!chatId.includes(req.user._uname)){
                    res.status(400).send({error:"Access Denied!"});
                }else{
                   let result =  await chat_queries.add_msg_to_chat(chatId, txt, req.user._uname) 
                    if (result.success) { 
                          res.status(201).send({success:"Message added to chat successfully!"});
                    }else{
                      res.status(500).send({error:"Sorry, Something went wrong while adding message to chat!"});
                    }  
                }
            }
        }catch(err){
            console.log("Error in new_msg call: ",err)
            res.send(500).send({error:"Sorry, Something went wrong while adding message to chat!"});
        }
     
    },

    async getChatMessages(req, res, next){
        try{
            let chatId = req.body.chatId
            if(!chatId){
                res.status(400).send({error:"Invalid chat id!"});
            }else{
                //only participants of chat should be able to access chat data
                if (!chatId.includes(req.user._uname)){
                    res.status(403).send({error:"Not authorized!"});
                }else{
                    let result =  await chat_queries.getChatMessages(chatId) 
                    if (result.success && result.messages) { 
                          res.status(201).send({success:true, messages:result.messages});
                    }else if(result.notFound){
                      res.status(400).send({error:"Chat not found!"});
                    }else{
                      res.status(500).send({error:"Sorry, Something went wrong fetching chat messages!"});
                    }  
                }
            }
        }catch(err){
            console.log("Error in getChatMessages call: ",err)
            res.status(500).send({error:"Sorry, Something went wrong fetching chat messages!"});
        }
    },

}