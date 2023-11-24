import bcrypt from "bcrypt";
import { resolver } from "./abstractResolver.js";
import Jwt  from "jsonwebtoken";
import { Credentials } from "./config.js";
import { GraphQLError } from "graphql";

const { jwt_secret } = Credentials;
const payloads = {
  error: [],
  data: {},
};

export const resolvers = {
  Query: {
    Users: async (_, args, { dataSources }) => {
      const data = await dataSources?.productsDb?.getUsers(args.lim);
      Object.assign(data, data);

      return data;
    },

    item: async (_, args, { dataSources }) => {
      console.log(args.id);
      const data = await dataSources?.productsDb?.getProductFor(args.id);
      return data;
    },

    me: async(_, __, {dataSources})=>{
     try {
      const data = await dataSources.userCont.getUser()
      console.log(data)
      if (data){
      console.log(data)
        return data
      }
    else
    throw new GraphQLError("invalid user", {
  extensions: {
    code: "Logging",
    http: {status: 200}
  }})
      
     } catch (error) {
      throw new GraphQLError(error)
     } 

    } 
  },

  User: {
    __resolveType(user) {
      if (user.cat_id === 1) return "Student";
      if (user.cat_id === 2) return "Artisan";
      if (user.cat_id === 3) return "Graduate";
      if (user.cat_id === 4) return "Professional";
    },
  },
  Student: {
    category: async (user, __, { dataSources }) => {
      console.log(user.cat_id);
      const data = await dataSources.productsDb.getCat(user.cat_id);
      return data;
    },
    CreatedAt: async(user, __, ___)=>user.createdat.btoa(),

    city: async (user, __, { dataSources }) => {
      console.log(user.city_id);
      const data = await dataSources.productsDb.getCity(user.city_id);
      return data;
    },

    studinfo: async (user, __, { dataSources }) => {
      const data = await dataSources.productsDb.getStud(user.user_id);
      console.log(data);
      return data;
    },
  },
  Professional: {
    category: async (user, __, { dataSources }) => {
      console.log(user.cat_id);
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
  Artisan: {
    category: async (user, __, { dataSources }) => {
      console.log(user.cat_id);
      const data = await dataSources.productsDb.getCat(user.cat_id);
      return data;
    },

    city: async (user, __, { dataSources }) => {
      console.log(user.city_id);
      const data = await dataSources.productsDb.getCity(user.city_id);
      return data;
    },
  },
  Graduate: {
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

  // City: {
  //   state: async (stat, __, { dataSources }) => {
  //     // console.log(stat)
  //     const data = await dataSources.productsDb.getState(stat.stateid);
  //     return data;
  //   },
  // },

  Grad: {
    WorkHis: async (info, __, { dataSources }) => {
      const data = await dataSources.productsDb.getWrk(info.grad_id);
      console.log(data);
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

      if (!password)
        payloads.error.push({ message: "please enter a password" });

      if (email) {
        email = email.trim().toLowerCase();
      }

      if (payloads.error.length === 0) {
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(email);

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

          if (!data.data){
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
            message: data.data,
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
        console.log(user)
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

    refresh: async(_, __, {dataSources})=>{
      const accessToken = await dataSources.userRefresh.issueRefresh()
      try {
      
      const token = Jwt.verify(accessToken, jwt_secret)
      console.log(token)
      if(token.payload in token){
        return accessToken
      }
      } catch (error) {
        return "noop"
      }
      return accessToken
    }
  },
};
