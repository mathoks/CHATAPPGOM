import pgClient from "./database/client.js";
import { ApolloServer } from "@apollo/server";
import { loader } from "./schema.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { resolvers } from "./resolver.js";
import { ProductsDataSource } from "./database/Datasource.js";
import { mutaionDb } from "./database/MutationSource.js";
import { SigninDb } from "./database/logUserMutation.js";
import { userToken } from "./database/getToken.js";
import { getRefresh } from "./database/getRefresh.js";
import expressSanitizer from "express-sanitizer";
import app from "./app.js";


const app = express();
const url = "http://localhost:4000";
const httpServer = http.createServer(app);
const { pgPool } = await pgClient();

const server = new ApolloServer({
  typeDefs: loader,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/",
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true,
  }),

  expressSanitizer(),

  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
       const { cache } = server;
      return {
        dataSources: {
          userCont: new userToken(req.get('x-access-token')?? null),
          userRefresh: new getRefresh(req.get("cookie")?? null),
          productsDb: new ProductsDataSource({DB:pgPool, cache}),
          mutationsDb: new mutaionDb(pgPool),
          signInDb: new SigninDb({DB:pgPool, res}),
        },
      };
    },
  })
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`
    🚀  Server is running!
    📭  Query at ${url}
  `);

//const pro = new ProductsDataSource(DB);
//console.log(pro.getCat());
