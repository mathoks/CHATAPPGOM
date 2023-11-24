import { GraphQLError } from "graphql";

export const pushToDb = (buff = [], insert)=>{
    console.log(insert)
    let i;
    const mapBuff = ()=>{
        for (i = 0; i < buff.length; i++){
            if(buff[i].userid !== undefined || null)
            insert(buff[i])
            else
            throw new GraphQLError("token expired")
        }
        return buff.length = 0;
    }
    if(buff.length > 0){
   setInterval(() => mapBuff(), 20000)
    }

}

