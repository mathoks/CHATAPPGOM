import { mutationsQueries } from "./mutationQueries.js";
import { customAlphabet } from "nanoid";
import bcript from "bcrypt";
import Jwt from "jsonwebtoken";
import { Credentials } from "../config.js";

const { logIn } = mutationsQueries;
const nanoid = customAlphabet("1234567890abcdefjklmnopqstvwxyz", 8);
const { jwt_secret } = Credentials;

const tokenExpireDate = new Date();
    tokenExpireDate.setDate(
        tokenExpireDate.getDate() + 60 * 60 * 60 * 24 * 7
      );
export class SigninDb {
  constructor({DB, res}) {
    this.databaseCon = DB;
    this.res = res;
  }

  pgQuery = (text, param = {}) =>
    this.databaseCon.query(text, Object.values(param));

  async authenticate(info) {
    console.log(info);
    try {
      const Result = await this.pgQuery(logIn, {
        $1: info.username.trim().toLowerCase(),
      });
      console.log(Result);
      if (Result.rows.length > 0) {
        console.log(Result.rows[0].passwords);
        const userpass = await bcript.compare(
          info.password,
          Result.rows[0].passwords
        );
        console.log(userpass);
        if (userpass) {
          console.log("seen");
          const accessToken = Jwt.sign({ payload: Result.rows[0] }, jwt_secret);
          const  refreshToken =  Jwt.sign({payload: Result.rows[0]}, jwt_secret, {expiresIn: "30days"})
          
          this.res.cookie(
            `refreshToken` ,refreshToken ,{ expires : tokenExpireDate, httpOnly: true}
           )

          return { 
           accessToken, 
           cat_id: Result.rows[0].cat_id,
 
        }; 
        } else {
          console.log("hjj");
          return {
            data: "wrong password",
          };
        }

        //Object.assign(Result.rows[0],{uniform : "Student"})
      } else {
        return { data: "user not found invalid email/username" };
      }
    } catch (error) {
      console.log(error);
      return { data: `${error}` };
    }
  }
}
