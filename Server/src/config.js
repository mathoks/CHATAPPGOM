import "dotenv/config"

 
export const Credentials = {
  host :process.env.MY_HOST,
  user :process.env.MY_USER,
  password :process.env.MY_PASSWORD,
  database :process.env.MY_DATABASE,
  connectionLimit :process.env.CON_LIMIT,
  waitForConnections :process.env.WAIT_CON,
  queueLimit : process.env.QUE_LIM,
  multipleStatements : process.env.MULT_TRUE,
  jwt_secret: process.env.JWT_SECRET
}

