import DataLoader from "dataloader";
import { queries } from "./sqlQueries.js";
import {
  converter2,
  decode2Base64,
} from "../utill/converter.js";
import { GraphQLError } from "graphql";

const {
  searchQuery,
  usersQuery,
  catQuery,
  userQuery,
  getcityQuery,
  getStateQuery,
  getStudQuery,
  getGradQuery,
  getWorkQuery,
  getChatMain
} = queries;

export class ProductsDataSource {
  constructor({DB, cache}) {
    this.dbConnection = DB;
    this.cache = cache
  }

  pgQuery = (text, param = {}) =>
    this.dbConnection.query(text, Object.values(param));

    async getMainChat(){
      console.log("lljj")
      try {
        const  {rows}  = await this.pgQuery(getChatMain);
        console.log(rows)
        return rows
      } catch (error) {
        throw new GraphQLError(error)
      }
       
    }  

  async getUsers(args) {
    const { lim, after} = args;

    const afters = after ? decode2Base64(after) : null;

    
    const { rows } = await this.pgQuery(usersQuery, {
      $1: lim,
      $2: afters ? false: true,
      $3: afters,
    });
    try {
      return rows;
    } catch (error) {
     return {
        message: "database error",
        code: 500
      }
    }
  }

  async searchUsers(args){
    
    const { rows } = await this.pgQuery(searchQuery, {
      $1: args
    });
    try {
      console.log(args)
      return rows
    } catch (error) {
      return {
        message: "database error",
        code: 500
      }
    }
    
  }

  batchUser = new DataLoader(async (ids) => {
    const Result = await this.pgQuery(userQuery, { $1: ids });
    const productToMap = Result.rows.reduce((mapping, product) => {
      mapping[product.user_id] = product;

      return mapping;
    }, {});
    return ids.map((id) => productToMap[id]);
  });

  batchCategory = new DataLoader(async (ids) => {
    const Result = await this.pgQuery(catQuery, { $1: ids });
    
    const productToMap = Result.rows.reduce((mapping, product) => {
      mapping[product.idx] = product;
      return mapping;
    }, {});
    return ids.map((id) => productToMap[id]);
  });

  batchStudent = new DataLoader(async (ids) => {
    const bin = ids.map((id) => converter2(id));
    const row = await this.dbConnection.query(getStudQuery, [bin]);

    const productToMap = row.reduce((mapping, product) => {
      mapping[product.student_id] = product;
      return mapping;
    }, {});

    return ids.map((id) => productToMap[id]);
  });

  batchCity = new DataLoader(async (ids) => {
    const Result = await this.pgQuery(getcityQuery, { $1: ids });
    
    const productToMap = Result.rows.reduce((mapping, product) => {
      mapping[product.city_ids] = product;
      return mapping;
    }, {});
    return ids.map((id) => productToMap[id]);
  });

  batchState = new DataLoader(async (ids) => {
    const [row] = await this.dbConnection.query(getStateQuery, [ids]);
    
    const productToMap = row.reduce((mapping, product) => {
      mapping[product.stateid] = product;
      return mapping;
    }, {});
    return ids.map((id) => productToMap[id]);
  });

  batchGrad = new DataLoader(async (ids) => {
    const bin = ids.map((id) => converter2(id));
    const row = await this.dbConnection.query(getGradQuery, [bin]);

    const productToMap = row.reduce((mapping, product) => {
      mapping[product.grad_id] = product;
      return mapping;
    }, {});
    return ids.map((id) => productToMap[id]);
  });

  batchWork = new DataLoader(async (ids) => {
    const bin = ids.map((id) => converter2(id));
    console.log(bin);
    const row = await this.dbConnection.query(getWorkQuery, [bin]);
    return ids.map((id) => row.filter((row) => id === row.grads_id));
  });

  batchPro = new DataLoader(async (ids) => {
    // const bin = ids.map((id)=>converter2(id))
    // console.log(bin)
    const row = await this.dbConnection.query(getGradQuery, { $1: ids });

    const productToMap = row.reduce((mapping, product) => {
      mapping[product.user_id] = product;
      return mapping;
    }, {});
    return ids.map((id) => productToMap[id]);
  });

  bathCert = new DataLoader(async (ids) => {
    const row = await this.dbConnection.query(getWorkQuery, { $1: ids });
    return ids.map((id) => row.filter((row) => id === row.user_id));
  });

  async getProductFor(id) {
    return this.batchUser.load(id);
  }

  async getCat(id) {
    return this.batchCategory.load(id);
  }

  async getCity(id) {
    return this.batchCity.load(id);
  }

  async getState(id) {
    return this.batchState.load(id);
  }

  async getStud(id) {
    return this.batchStudent.load(id);
  }
  async getGrad(id) {
    return this.batchGrad.load(id);
  }

  async getWrk(id) {
    return this.batchWork.load(id);
  }

  async getPro(id) {
    return this.batchPro.load(id);
  }
  async getCert(id) {
    return this.batchCert.load(id);
  }
}
