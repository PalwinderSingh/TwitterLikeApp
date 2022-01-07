var self = module.exports = {
 
    createChat: (participants) => {
        return new Promise(async (resolve)=>{
            try{
                participants.sort()
                chatId = "chat_"+participants.join(":")
                const success = await redisClient.HSETNX(chatId, "", "")
                if (success){
                    resolve({success:true, chatId: chatId})
                }else{
                    resolve({error:true, alreadyExists : true})
                }
            
            }catch(err){
                console.log(err)
                resolve({error:true})
            }
        })//Promise ends here
    },

    add_msg_to_chat: (chatId, txt, username) => {
        return new Promise(async (resolve)=>{
            try{
                //get the total count of chat messages
                //@NOTE: chat messages total count is used as new message's Id
                let chatMsgsCount = await redisClient.GET(chatId+"_msgsCount")
                if (!chatMsgsCount)
                    chatMsgsCount = "0"

                let msgDetails = {tweetId: chatMsgsCount, txt:txt, sender: username, sentAt:Date.now()}
                
                /**
                 * Using transactional approach to avoid partial writes:
                 * 1. Increment "chat_<username1:username2..>_msgsCount" 
                 * 2. set message data with msgId as msgsCount above  
                 * */
                const [incrResult,setChatResult] = await redisClient.multi()
                                                    .INCR(chatId+"_msgsCount")
                                                    .HSETNX(chatId, chatMsgsCount, JSON.stringify(msgDetails))
                                                    //.HSETNX(username+"_chats", tweetCount, "")
                                                    .exec();

                //@TODO: also  add chat_ids under participants of chat as well (under hash "<username>_chats")

                if (incrResult && setChatResult){
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

    
    getChatMessages: (chatId) => {
        return new Promise(async (resolve)=>{
            try{
                //let messages = []
                let  messages= await redisClient.HGETALL(chatId)
                if (!messages){
                   resolve({error:true, notFound:true}) 
                }else{
                    messages = JSON.parse(JSON.stringify(messages))
                    resolve({success:true, messages: messages})
                }
                 
            }catch(err){
                console.log(err)
                resolve({error:true})
            }
        
        })//Promise ends here
    },

}
