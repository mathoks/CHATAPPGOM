import { ApolloServer } from "@apollo/server";
import { loader } from "./schema.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import responseCachePlugin from "@apollo/server-plugin-response-cache";
import http from "http";
import { resolvers } from "./resolver.js";
import app from "./app.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ProductsDataSource } from "./database/Datasource.js";
import { mutaionDb } from "./database/MutationSource.js";
import { SigninDb } from "./database/logUserMutation.js";
import { userToken } from "./database/getToken.js";
import { getRefresh } from "./database/getRefresh.js";
import pgClient from "./database/client.js";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { Ratings } from "./database/Ratings.js";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import jwt from "jsonwebtoken";
import { Credentials } from "./config.js";
import { MessageHandler } from "./database/messageHandler.js";
import * as fs from "fs";
import { GraphQLError } from "graphql";


const { jwt_secret } = Credentials;
export var credentials = {}

const url = "https://chat-app-go-apc4.onrender.com";
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 4000
const { pgPool } = await pgClient();
const schema = makeExecutableSchema({ typeDefs: loader, resolvers: resolvers });
// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
  
//   verifyClient: function (info, cb) {
//     console.log(info)
//     var token = info.req.headers["x-access-token"]
//     if (!token)
//         cb(false, 401, 'Unauthorized')
//     else {
//         jwt.verify(token, jwt_secret , function (err, decoded) {
//             if (err) {
//                 cb(false, 401, 'Unauthorized')
//             } else {
//                 info.req.user = decoded.payload.user_id 
//                 cb(true)
//             }
//         })

//     }
// }
});

// function heartbeat() {
//   this.isAlive = true;
// }

// wsServer.on("connection", (socket, request) => {
//   socket.isAlive = true;
//   socket.emit('new_user', "i just joined")
//   socket.on("pong", heartbeat);
//   console.log(request.socket.remoteAddress)
//   socket.on("error", (err) => {
//     console.log(err);
//   })
//   socket.on("open", (err) => {
//     console.log("connected")
//     socket.send(Date.now())
//   })

//   socket.on("message", (message) => {
//     const token = JSON.parse(message.toString()).payload?.token
//     jwt.verify(token, jwt_secret, (err, decoded) => {
//       if (err) {
//         if (err?.name === "TokenExpiredError") {
//           socket.close(1011, "token expired")
//         } else if (err?.name === "JsonWebTokenError") {
//           socket.close(1011, "sign In")
//         }
//       } else if (decoded) {
//         socket.emit("userjoined", ()=>{
//           console.log(decoded.payload.username)
//         })
//       }
//     })

//     console.log("jjjj")
//     // wsServer.clients.forEach((client) => {
//     //   if (client.readyState === socket.OPEN) {
//     //     client.send(message);
//     //   }
//     // });
// })
//});

// const interval = setInterval(function ping() {
//   wsServer.clients.forEach(function each(socket) {
//     if (socket.isAlive === false) return socket.terminate();
//     socket.isAlive = false;
//     socket.ping();
//   });
// }, 30000);

// wsServer.on("close", function close() {
//   clearInterval(interval);
// })

const getDynamicContext =  (ctx)=>{
  var token
  jwt.verify(ctx, jwt_secret, (err, decoded) => {
    if (err) {
      if (err?.name === "TokenExpiredError") {
        console.log("n000")
        throw new GraphQLError("token")
        
        //return token = false
      } else if (err?.name === "JsonWebTokenError") {
        return token = false
      }
    } else if (decoded) {
      console.log("yessss")
      return token = true
    }
  })
  return token
}

const serverCleanup = useServer({ schema , 
  context: async(ctx, args, message)=>{
    if(ctx.connectionParams.token !== ""){
    const user_name = jwt.verify(ctx.connectionParams.token, jwt_secret, (err, decoded)=>{
      if (err){
       
        return {auth:null}
      }
      else if(decoded){
        return {auth: decoded.payload.username}
      }
    })
    return user_name
  }
   
  },
  // onConnect: async (ctx)=>{
  //   console.log(ctx)
  //  if(ctx.connectionParams.token === ""){
  //   return false
  //  } 
  //  else {
  //  getDynamicContext(ctx.connectionParams.token)
   
  //  }
  // },

  onError: (err)=>{
    console.log(err)
  },
}, wsServer);

export const server = new ApolloServer({
  schema: schema,
  introspection: true,
  cache: new InMemoryLRUCache({
    // ~100MiB
    maxSize: Math.pow(2, 20) * 100,
    // 5 minutes (in seconds)
    ttl: 300,
  }),
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    responseCachePlugin({
      sessionId: (requestContext) => {
        requestContext.request.http.headers.get("x-access-token") || null;
      },
    }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },

      async didEncounterErrors(requestContext) {
        console.log(requestContext);
      },
    },
  ],
});

await server.start();
app.use(
  "/",
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const { cache } = server;
      const authorization = req.get("x-access-token");
      const token = jwt.verify(authorization, jwt_secret, (err, decoded) => {
        if (err) {
          if (err?.name === "TokenExpiredError") {
            return "token expired";
          } else if (err?.name === "JsonWebTokenError") {
            return "sign In";
          }
        } else if (decoded) {
         fs.writeFile('./cred.txt', decoded.payload.toString(), (ell, data )=>{
          if(ell) console.log(ell)
          else if (data){
        console.log(data)
      }
         })
          
          return decoded.payload;
        }
      });

      return {
        dataSources: {
          token,
          pubsub,
          userCont: new userToken(req.get("x-access-token") ?? null),
          userRefresh: new getRefresh(req.get("cookie") ?? null),
          productsDb: new ProductsDataSource({ DB: pgPool, cache }),
          mutationsDb: new mutaionDb(pgPool),
          signInDb: new SigninDb({ DB: pgPool, res }),
          Ratings: new Ratings(pgPool),
          ChatRoom: new MessageHandler({DB:pgPool, res})
        },
      };
    },
  })
);

await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`
    🚀  Server is running!
    📭  Query at ${url}
  `);
