import pg from "pg";
import { PostgresPubSub } from "graphql-postgres-subscriptions"
import { PgPubSub } from "@imqueue/pg-pubsub";



const NOTIFY_DELAY = 2000;
const CHANNEL = 'new_like'


const pgClient = async () => {
  const pgPool = new pg.Pool({
    host: process.env.MY_HOST ||  "localhost",
    port: process.env.MY_PORT || 5000,
    password: process.env.MY_PASSWORD||"root",
    database: process.env.MY_DATABASE || "myDB",
    user: process.env.MY_PASSWORD || "root",
  });
  
//   const pubsubs = new PostgresPubSub({connectionString: 'postgres://root:root@localhost:5000/myDB'})
//   pubsubs.subscribe("MESSAGE_ADDED", payload => console.log(payload)
//   ).then(()=>pubsubs.publish("LIKE_ENGAGED", {hello: {from: process.pid}}))
  
//   const pubsub = new PgPubSub({
//     connectionString: 'postgres://root:root@localhost:5000/myDB',
//     singleListener: true
//   })

//   pubsub.on('listen', channel => console.info(`listening on ${channel}...`))
//   pubsub.on("connect", async()=>{
//     console.info('DATABASE CONNECTED')
//     await pubsub.listen('MESSAGE_ADDED')
//     await pubsub.listen(CHANNEL);
//   //   setInterval(async ()=>{
//   //   await Promise.all([CHANNEL, "MESSAGE_ADDED"].map((channel)=> pubsub.listen('MESSAGE_ADDED', {hello: {from: process.pid}})
//   // )) , NOTIFY_DELAY
//   //   })
// })

    
    
//     pubsub.on('end', ()=>console.warn('Connection closed'))
//     pubsub.channels.on("MESSAGE_ADDED", ()=>{console.log("hhh")});
//     pubsub.connect().catch(err => console.error('Connection:', err))
  
  // Test the connection
  const client = await pgPool.connect();
  const tableCountResp = await client.query(
    "select count(*) from information_schema.tables where table_schema = $1;",
    ["public"]
  );
  client.release();

  console.info(
    "Connected to PostgreSQL | Tables count:",
    tableCountResp.rows[0].count
  );

  pgPool.on("error", (err) => {
    console.error("Unexpected PG client error", err);
    process.exit(-1);
  });

  return {
    pgPool,
    //pubsub,
    //pubsubs,
    pgClose: async () => await pgPool.end(),
  };
};
export default pgClient;
