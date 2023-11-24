import jwt from "jsonwebtoken";
import { Credentials } from "../config.js";
import { GraphQLError } from "graphql";

const { jwt_secret } = Credentials;

export class userContext {
  constructor({req, cache}) {
    this.header = req.headers["x-access-token"];
    this.cookies = req.headers?.cookie ?? "";
  }

  async getDe() {
    try {
      if (this.cookies) {
        this.cookies?.split(";").reduce((obj, c) => {
          const [name, value] = c.split("=");
          obj[name.trim()] = value.trim();
          return obj;
        }, {});
        return this.cookies?.refreshToken;
      }
      // else
      // throw new GraphQLError(" please loggin")

      if (this.header) {
        jwt.verify(this.header, jwt_secret, (err, decoded) => {
          console.log(err);
          if (err) {
            if (err?.name === "TokenExpiredError") {
              throw new GraphQLError("token expired", {
                extensions: {
                  code: "UNAUTHENTICATED",
                  http: { status: 401 },
                },
              });
            }

            if (err?.name === "JsonWebTokenError") {
              throw new GraphQLError("token required", {
                extensions: {
                  code: "UNAUTHENTICATED",
                  http: { status: 401 },
                },
              });
            }
          } else return decoded.payload;
        });
      } else {
        throw new GraphQLError("please login", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
    } catch (error) {
      console.log(error);
      throw new GraphQLError("try again", {
        extensions: { code: "Cant", http: { status: 403 } },
      });
    }
  }
}
