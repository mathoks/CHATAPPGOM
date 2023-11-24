import { GraphQLError } from "graphql";
import { Credentials } from "../config.js";
import Jwt from "jsonwebtoken";

var Token;
const { jwt_secret } = Credentials;
export class getRefresh {
  constructor(response) {
    this.req = response;
  }

  async issueRefresh() {
    if (!this.req) {
      Token = null;
      throw new GraphQLError("Please Loggin", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 200 },
        },
      });
    }

    try {
      const cookie = this.req?.split(";").reduce((obj, c) => {
        const [name, value] = c.split("=");
        obj[name.trim()] = value.trim();
        return obj;
      }, {});

      const refreshToken = await cookie.refreshToken;
      Jwt.verify(refreshToken, jwt_secret, (err, decoded) => {
        if (err) {
          throw new GraphQLError("unauthorized", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        } else {
          const accessToken = Jwt.sign(
            {
              payload: decoded.payload,
            },
            jwt_secret,
          );
          return (Token = accessToken);
        }
      });
      return Token;
    } catch (err) {
      throw new GraphQLError(err);
    }
  }
}
