const jwt = require("jsonwebtoken")
var config =  require("../config");

module.exports = {

  /** 
       Middleware to Verify whether the requester is logged-in and session is valid, before proceeding
   **/
  authenticate(){
    return (req,res, next) => {
      // const jwtToken = req.header('jwt-auth-token')


      try{
        const authorization = req.header('Authorization')
        let jwtToken;
        if (authorization){//(!authorization && authorization==null) {
          console.log("Authorization",authorization)
          jwtToken = authorization.split(" ")[1]

          if(!jwtToken){
            return res.status(401).send({error:"Access Denied!"});
          }

          // console.log("JWTTOKEN",jwtToken)
          const verified = jwt.verify(jwtToken, config._JWT_TOKEN_SECRET)
          req.user = verified
          //continue processing the endpoint requested
          return next()
        }else{
          res.status(401).send({error:"Access Denied!"});

        }
          
        
      }catch(err){
        console.log(err)
        res.status(400).send({error:"Invalid token"});
      }
        
    }
  },

}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfdW5hbWUiOiI3czVmRmxCMyIsImlhdCI6MTY0MTU3NzMzMiwiZXhwIjoxNjQxNTgwOTMyfQ.D1-JxMt8Qrg-zlh54HWOuom_YuRtKGDd_ZcRggp66jM
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfdW5hbWUiOiJhYmMxMjM0NSIsImlhdCI6MTY0MTU1MTAxMywiZXhwIjoxNjQxNTU0NjEzfQ.-fNcee3MAt4_WxTNo61C-7oeazDmXqITeXnNv5w4Wp0