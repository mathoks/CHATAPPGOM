import mysql from "mysql2"
import DataLoader from "dataloader";

export class ReservationsDataSource {
    constructor(options) {
      this.dbConnection = this.initializeDBConnection();
      this.token = options.token;
    }
  
    static async initializeDBConnection() {
      // set up our database details, instantiate our connection,
      // and return that database connection
      var con =  mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "amuche",
        database: "my_schema"
      });
      
      const dbConnection = con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
      
      return dbConnection;
    }
  
    async getUser() {
      if (!this.user) {
        // store the user, lookup by token
        this.user = await this.dbConnection.User.findByToken(this.token);
      }
      return this.user;
    }
  
    async getReservation(reservationId) {
      const user = await this.getUser();
      if (user) {
        return await this.dbConnection.Reservation.findByPk(reservationId);
      } else {
        // handle invalid user
      }
    }
  
    //... more methods for finding and creating reservations
  }