const user_queries = require("../db/queries/user_queries.js");
const config = require("../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const joi = require("joi")


const loginNRegistrationSchema = joi.object({
    username: joi.string().alphanum().min(6).required(),
    pwd: joi.string().min(8).required()
                .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
}) 

module.exports = {

    async login(req, res, next){
        try{
            
            const {error} =  loginNRegistrationSchema.validate(req.body)

            if (error){
                res.status(400).send({error:error.details[0].message});
            }else{
                const username = req.body.username;
                const password = req.body.pwd;

                const retrievedResult = await user_queries.getUserPwd(username)
                if(retrievedResult.notFound || !retrievedResult.pwd){//if user not found
                    res.status(400).send({error:"Username not found!"});
                }else{
                    const matched = await bcrypt.compareSync(password, retrievedResult.pwd)
                    if(!matched){
                        res.status(400).send({error:"Invalid password!"});
                    }else{
                        //Generate new JWT token and assign to session
                        //@TODO: instead of using username to attach to session, use unique userid 
                        const jwtToken = jwt.sign({_uname: username}, config._JWT_TOKEN_SECRET, {expiresIn: "1h"})
                        res.header('jwt-auth-token',jwtToken)
                        res.status(200).send({jwtToken});   
                    }
                }
            }
        }catch(err){
            console.log("Error in login call: ",err)
            res.send(500).send({error:"Sorry, Something went wrong logging-in!"});
        }
     
    },


    async register(req, res, next){
        try{

            const {error} = loginNRegistrationSchema.validate(req.body)
            if (error){
                res.status(400).send({error:error.details[0].message});
            }else{
                const username = req.body.username
                const password = req.body.pwd

                //create Hash for password
                const hashedPwd = await bcrypt.hash(password, 10)
                let result =  await user_queries.add_user(username, hashedPwd) 
                if (result.success) { 
                      res.status(201).send({success:"User added successfully!"});
                }else if(result.userAlreadyExists){
                  res.status(400).send({error:"Username already exist!"});
                }else{
                  res.status(500).send({error:"Sorry, Something went wrong during registeration!"});
                }  
            }
                
        }catch(err){
            console.log("Error in register call: ",err)
            res.status(500).send({error:"Sorry, Something went wrong during registeration!"});
        }
  },
}