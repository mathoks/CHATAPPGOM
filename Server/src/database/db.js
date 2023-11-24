/**import { Sequelize } from "sequelize";
const sequelize = new Sequelize('my_schema', 'root', 'amuche', {host: 'localhost', dialect: 'mysql'});
//Test connection
try {
    await sequelize.authenticate();
    console.log('connected ok!')
} catch (error) {
    console.error('unable to connect:', error)
} **/
import { typeDefs } from "../schema";
import { graphqlHTTP } from "express-graphql";
import mysql from "mysql2"
import express from "express"
var con =  mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "amuche",
  database: "my_schema"
});

export const connect = con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var app = express()
app.use("/", graphqlHTTP({
    schema: typeDefs,
    context: {connect},
    graphiql: true
}))