import { v4 as uuidv4} from "uuid"
import  Jwt  from "jsonwebtoken";
import { Credentials } from "../config.js";

export const refreshTokens = {};
export const auth = async function ({Token, req, res}) {
    console.log(Token)
    const { jwt_secret } = Credentials;
    
    const tokenExpireDate = new Date();
    tokenExpireDate.setDate(
        tokenExpireDate.getDate() + 60 * 60 * 60 * 24 * 7
      );
      const refreshTokenUuid = uuidv4()
if (req.body.operationName === "signUser" || req.body.operationName === "refreshQuery" || req.body.operationName === "userQuery"){
            console.log("hhhhhhhhh")
            const token = Jwt.verify(Token, jwt_secret);
            console.log(token)
            refreshTokens[refreshTokenUuid] = token?.payload
            const refreshToken = Jwt.sign({payload: refreshTokenUuid}, jwt_secret,{ expiresIn: "7days"})
           res.cookie(
             `refreshToken` ,`${refreshToken}` ,{ expires : tokenExpireDate, httpOnly: true}
            )
            return refreshToken
           
        
            
}

}