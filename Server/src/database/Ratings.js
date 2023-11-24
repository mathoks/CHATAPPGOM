import { GraphQLError } from "graphql";
import { mutationsQueries } from "./mutationQueries.js";

const { ratings_likes_main } = mutationsQueries;

export class Ratings {
  constructor(DB) {
    this.databaseCon = DB;
  }

  pgQuery = (text, param = {}) =>
    this.databaseCon.query(text, Object.values(param));
  pubQuery = (text)=> this.databaseCon.query(text)
  

  async likesHandler(info) {
    console.log(info);
    const { liked_id, likee_id } = info;

    try {
      const Result = await this.pgQuery(ratings_likes_main, {
        $1: liked_id,
        $2: likee_id,
      });

      if (Result.rows) {
        const {
          like_or_unliked: { message, user },
        } = Result.rows[0];
        
        if (user.cat_id === 1) {
          const newUser = Object.assign(user, {
            __typename: "Student",
            name: `${user.firstname} ${user.lastname}`,
          });
         
          return { message, newUser };
        } else if (user.cat_id === 2) {
          const newUser = Object.assign(user, {
            __typename: "Artisan",
            name: `${user.firstname} ${user.lastname}`,
          });
          
          return { message, newUser };
        } else if (user.cat_id === 3) {
          const newUser = Object.assign(user, {
            __typename: "Graduate",
            name: `${user.firstname} ${user.lastname}`,
          });
         
          return { message, newUser };
        } else if (user.cat_id === 4) {
          const newUser = Object.assign(user, {
            __typename: "Professional",
            name: `${user.firstname} ${user.lastname}`,
          });
          
          return { message, newUser };
        }
        
        else return { message, user };
      } else throw new Error("cant connect");
    } catch (error) {
      return { data: error };
    }
  }
}
