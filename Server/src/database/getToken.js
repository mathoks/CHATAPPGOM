import jwt from "jsonwebtoken";
import { Credentials } from "../config.js";
import { GraphQLError } from "graphql";

const { jwt_secret } = Credentials;
export class userToken {
  constructor(req) {
    this.req = req;
  }

  async getUser() {
    console.log(this.req);
    if (!this.req) {
      throw new GraphQLError("log in", {
        extensions: {
          code: "logging",
          http: { status: 200 },
        },
      });
    }
      try {
        const token = jwt.verify(this.req, jwt_secret, (err, decoded) => {
          if (err) {
            if (err?.name === "TokenExpiredError") {
              throw new GraphQLError("token expired", {
                extensions: {
                  code: "UNAUTHENTICATED",
                  http: { status: 404 },
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
          } else if (decoded) {
            return decoded.payload;
          }
        });

        return token;
      } catch (error) {
        throw new GraphQLError("not found", {
          extensions: { code: 404, http: { status: 401 } },
        });
      }
    
  }
}
