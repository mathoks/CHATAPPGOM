import { GraphQLError } from "graphql";
import { mutationsQueries } from "./mutationQueries.js";

const { main_chat } = mutationsQueries;

export class MessageHandler {
  constructor({DB, res}) {
    this.databaseCon = DB;
  }

  pgQuery = (text, param = {}) =>
    this.databaseCon.query(text, Object.values(param));
  
  

  async batchInsert(info) {
    const {mess, room_id, userid } = info;
    

    

    try {

        if(userid === undefined){
            console.log(`userid is ${userid}`)
            throw new GraphQLError("token expired", { code: 404 })
        }

       await this.pgQuery(main_chat, {
        $1: mess,
        $2: room_id || 123,
        $3: userid,  
      });    
          return "sent" 
    } catch (error) {
      throw new GraphQLError(error)
    }
  }
}
