import { GraphQLError } from "graphql";
import { mutationsQueries } from "./mutationQueries.js";
import { customAlphabet } from "nanoid";

const { createNew } = mutationsQueries;
const nanoid = customAlphabet("1234567890abcdefjklmnopqstvwxyz", 8);

export class mutaionDb {
  constructor(DB) {
    this.databaseCon = DB;
  }

   pgQuery = (text, param = {}) =>
    this.databaseCon.query(text, Object.values(param));

  async createUser(info) {
    console.log(info);
    try {
        const Result = await this.pgQuery(createNew, {
            $1: info.location.toLowerCase(),
            $2: info.category.toLowerCase(),
            $3: nanoid(),
            $4: info.username.trim().toLowerCase(),
            $5: info.email.trim().toLowerCase(),
            $6: info.firstname.trim().toLowerCase(),
            $7: info.phone,
            $8: info.lastname.trim().toLowerCase(),
            $9: info.password,
          });
      
      if (Result.rows) {
        console.log(Result.rows[0])
        
        return  Result.rows[0];
    
      } 
      else 
      throw new GraphQLError({message :"cant connect"});
    } catch (error) {
      throw new GraphQLError(error)
    }
  }
}
