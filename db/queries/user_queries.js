var self = module.exports = {
 
    add_user: (username, hashedPwd) => {
        return new Promise(async (resolve)=>{
            try{
                const success = await redisClient.HSETNX("users", username, hashedPwd)
                if (success){
                    resolve({success:true})
                }else{
                    resolve({error:true, userAlreadyExists : true})
                }
            }catch(err){
                console.log(err)
                resolve({error:true})
            }
            
        })//Promise ends here
    },

    getUserPwd: (username) => {
        return new Promise(async (resolve)=>{
            try{
                const pwd = await redisClient.HGET("users", username)
                if (pwd){
                    resolve({success:true, pwd: pwd})
                }else{
                    resolve({error:true, notFound : true})
                } 
            }catch(err){
                console.log(err)
                resolve({error:true})
            }
        
        })//Promise ends here
    }

}