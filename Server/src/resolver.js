import bcrypt from "bcrypt";
import { resolver } from "./abstractResolver.js";
import Jwt from "jsonwebtoken";
import { Credentials } from "./config.js";
import { GraphQLError } from "graphql";
import { encode2Base64 } from "./utill/converter.js";
import { serilizeString } from "./utill/serilizeSearch.js";
import _ from "lodash";
import { cache } from "./utill/cache.js";
import pgClient from "./database/client.js";
import { PubSub, withFilter } from "graphql-subscriptions";
import { pushToDb } from "./utill/pushToDatabase.js";
import { credentials } from "./server.js";

const { jwt_secret } = Credentials;

console.log(credentials);
const payloads = {
  error: [],
  data: {},
};

var main_chat = new Object();
var buffer = [];

const pubsub = new PubSub();
const subscribers = [];
const onMessageUpdates = (fn) => subscribers.push(fn);
export const resolvers = {
  Query: {
    Users: async (_, args, { dataSources }) => {
      const data = await dataSources?.productsDb?.getUsers(args);

      return data;
    },

    getMainChat: async (_, __, { dataSources }) => {
      const data = await dataSources?.productsDb?.getMainChat();
      return data;
    },

    Search: async (_, args, { dataSources }) => {
      const { searchText } = args;
      const { searchTxt, FilterTxt } = serilizeString(searchText);
      const search = await dataSources?.productsDb?.searchUsers(searchTxt);
      console.log(search);
      if (FilterTxt) {
        const filterdUser = cache(searchTxt, search, FilterTxt);

        return filterdUser.length ? filterdUser : [];
      }
      return search;
    },

    item: async (_, args, { dataSources }) => {
      console.log(args.id);
      const data = await dataSources?.productsDb?.getProductFor(args.id);
      return data;
    },

    me: async (_, __, { dataSources }) => {
      try {
        const data = await dataSources.userCont.getUser();

        if (data) {
          return data;
        } else
          throw new GraphQLError("invalid user", {
            extensions: {
              code: "Logging",
              http: { status: 200 },
            },
          });
      } catch (error) {
        throw new GraphQLError(error);
      }
    },
  },

  UserList: {
    __resolveType(user) {
      if (!user.message) return "List";
      else return "UserError";
    },
  },
  User: {
    __resolveType(user) {
      if (user.cat_id === 1) return "student";
      if (user.cat_id === 2) return "artisan";
      if (user.cat_id === 3) return "graduate";
      if (user.cat_id === 4) return "professional";
    },
  },

  List: {
    edges: async (user) => {
      const col = user.reduce((acc, curr) => {
        acc.push({ cursor: curr.createdat, node: curr });
        return acc;
      }, []);

      return col;
    },
    pageInfo: async (user, userI, { dataSources }, info) => {
      const { lim } = info.variableValues;

      const hasNextPages = user.length ? lim >= user.length : false;
      const endCursor = user.length
        ? encode2Base64(user[user.length - 1].createdat)
        : null;

      return {
        endCursor: endCursor,
        hasNextPage: hasNextPages,
        first: false,
      };
    },
  },
  student: {
    category: async (user, __, { dataSources }) => {
      const data = await dataSources.productsDb.getCat(user.cat_id);
      return data;
    },

    city: async (user, __, { dataSources }) => {
      const data = await dataSources.productsDb.getCity(user.city_id);
      return data;
    },

    studinfo: async (user, __, { dataSources }) => {
      const data = await dataSources.productsDb.getStud(user.user_id);

      return data;
    },
  },
  professional: {
    category: async (user, __, { dataSources }) => {
      const data = await dataSources.productsDb.getCat(user.cat_id);
      return data;
    },

    proInfo: async (user, __, { dataSources }) => {
      const data = await dataSources.productsDb.getPro(user.user_id);
      return data;
    },

    city: async (user, __, { dataSources }) => {
      console.log(user.city_id);
      const data = await dataSources.productsDb.getCity(user.city_id);
      return data;
    },
  },
  artisan: {
    category: async (user, __, { dataSources }) => {
      console.log(user.cat_id);
      const data = await dataSources.productsDb.getCat(user.cat_id);
      return data;
    },

    city: async (user, __, { dataSources }) => {
      const data = await dataSources.productsDb.getCity(user.city_id);
      return data;
    },
  },
  graduate: {
    Gradinfo: async (user, __, { dataSources }) => {
      // console.log(user.user_id);
      const data = await dataSources.productsDb.getGrad(user.user_id);
      return data;
    },

    category: async (user, __, { dataSources }) => {
      console.log(user.cat_id);
      const data = await dataSources.productsDb.getCat(user.cat_id);
      return data;
    },

    city: async (user, __, { dataSources }) => {
      console.log("pip");
      const data = await dataSources.productsDb.getCity(user.city_id);
      return data;
    },
  },

  Grad: {
    WorkHis: async (info, __, { dataSources }) => {
      const data = await dataSources.productsDb.getWrk(info.grad_id);

      return data;
    },
  },

  Mutation: {
    createUser: async (_, userInfo, { dataSources }) => {
      console.log(userInfo.info.password);
      var firstname = userInfo.info.firstname;
      var lastname = userInfo.info.lastname;
      var username = userInfo.info.username;
      var phone = userInfo.info.phone;
      var email = userInfo.info.email;
      var location = userInfo.info.location.replace(/['_']/g, " ");
      var category = userInfo.info.category.toLowerCase();
      var password = userInfo.info.password;

      const salt = await bcrypt.genSalt(10);

      if (!password) {
        payloads.error.push({ message: "please enter a password" });
        throw new GraphQLError({ message: "please enter a password" });
      }

      if (email) {
        email = email.trim().toLowerCase();
      }

      if (payloads.error.length === 0) {
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
          const data = await dataSources.mutationsDb.createUser({
            username,
            email: email,
            password: hashedPassword,
            location,
            category,
            firstname,
            lastname,
            phone,
          });

          if (data) {
            const User = new resolver(data).__resolveType();

            let newUser;
            switch (User) {
              case "Student":
                newUser = data;
                break;
              case "Artisan":
                newUser = data;
                break;
              case "Graduate":
                newUser = data;
                break;
              case "Professional":
                newUser = data;
                break;

              default:
                newUser = {};
                break;
            }

            return {
              data: newUser,
              code: "200",
              success: true,
              message: `successfully added new user ${newUser.firstname}`,
            };
          }
        } catch (error) {
          console.log(error);
          return {
            code: "404",
            success: false,
            message: "hhh",
            data: null,
          };
        }
      }
    },
    authenticate: async (_, userInfo, { dataSources }) => {
      const username = userInfo.credentials?.username?.toLowerCase();
      const password = userInfo.credentials.password;

      try {
        const user = await dataSources.signInDb.authenticate({
          username,
          password,
        });

        if (!user.data) {
          const User = new resolver(user).__resolveType();

          let signedUser;
          switch (User) {
            case "Student":
              signedUser = user;
              break;
            case "Artisan":
              signedUser = user;
              break;
            case "Graduate":
              signedUser = user;
              break;
            case "Professional":
              signedUser = user;
              break;

            default:
              signedUser = {};
              break;
          }

          return {
            data: signedUser.accessToken,
            code: "200",
            success: true,
            message: `successfully logged user ${signedUser.username}`,
          };
        }
        if (user.data)
          return {
            code: "404",
            success: false,
            message: user.data,
            data: null,
          };
      } catch (error) {
        console.log(error);
        return {
          code: "404",
          success: false,
          message: "dfff",
          data: null,
        };
      }
    },

    refresh: async (_, __, { dataSources }) => {
      const accessToken = await dataSources.userRefresh.issueRefresh();
      try {
        const token = Jwt.verify(accessToken, jwt_secret);

        if (token.payload in token) {
          return accessToken;
        }
      } catch (error) {
        return "noop";
      }
      return accessToken;
    },

    rating_like: async (_, args, { dataSources }) => {
      try {
        const user_id = dataSources.token.user_id;
        if (user_id === "token expired") {
          throw new GraphQLError("token expired", { code: 404 });
        }

        if (user_id === "sign In") {
          throw new GraphQLError("sign In", { code: 404 });
        }
        const message = await dataSources.Ratings.likesHandler({
          ...args.ids,
          likee_id: user_id,
        });

        pubsub.publish("LIKE_ENGAGED", {
          rating_like: {
            user: message.newUser,
            code: 200,
            message: message.message,
            error: false,
          },
        });

        // pubsub.notify('LIKE_ENGAGED', {
        //     rating_like: {
        //       user: message.newUser,
        //       code: 200,
        //       message: message.message,
        //       error: false,
        //     }})

        return {
          user: message.newUser,
          code: 200,
          message: message.message,
          error: false,
        };
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
    addChat: async (_, args, { dataSources }) => {
      const user_id = dataSources.token.user_id;
      const username = dataSources.token.username;
      console.log(user_id, username);
      const cache = new Map();
      cache.set([user_id], { user_id: user_id, username: username });
      if (cache.has([user_id])) {
        const neww = cache.get([user_id]);
        console.log(neww);
        return neww;
      }
      try {
        if (user_id === "token expired" || undefined) {
          console.log("yesss");
          throw new GraphQLError("token expired", { code: 404 });
        }

        if (user_id === "sign In" || undefined) {
          throw new GraphQLError("sign In", { code: 404 });
        } else if (args && user_id !== undefined) {
          const argu = { ...args.info, userid: user_id };
          buffer.push(argu);
          const add = async (arg) =>
            await dataSources.ChatRoom.batchInsert(arg);
          pushToDb(buffer, add);
          main_chat.message = args.info.mess;
          main_chat.user_id = user_id;
          (main_chat.timestamp = new Date().getTime()),
            (main_chat.username = username);
          subscribers.forEach((fn) => fn());
          return "error";
        } else throw new GraphQLError("token expired");
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
    userTyping: async (_, arg) => {
     
      if (arg.info.isTyping === true) {
        pubsub.publish("USER_TYPING", { typing: true });
      }
    },
  },

  LikedUser: {
    edges: async (user) => {
      try {
        const col = { cursor: user.user.createdat, node: user.user };
        return col;
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
    TotalCount: async (user) => {
      return { message: user.message, code: user.code, error: user.error };
    },
  },
  Subscription: {
    rating_like: {
      subscribe: () => {
        return pubsub.asyncIterator("LIKE_ENGAGED");
      },
    },
    main_chat: {
      subscribe: (_, args, ctx, info) => {
        console.log(ctx)
        const channel = Math.random().toString(36).slice(2,15)
        onMessageUpdates(() =>{
         return  pubsub.publish(channel, {
            main_chat,
          })
      });

        setTimeout(() => 
          pubsub.publish(channel, {
            main_chat,
          })
        
        , 0);

        return pubsub.asyncIterator(channel);
      },
    },
    typing: {
      subscribe: withFilter(pubsub.asyncIterator("USER_TYPING"), () => true),
    },
  },
};
