export class resolver {
  constructor(data) {
    this.database = data;
  }

  __resolveType() {
    let newUser;
    console.log(this.database)
   
    switch (this.database.cat_id) {
      case 1:
        newUser = "Student";
        break;
      case 2:
        newUser = "Graduate";
        break;
      case 3:
        newUser = "Artisan";
        break;
      case 4:
        newUser = "Professional";
        break;

      default:
        newUser = "null";
        break;
    }

    return newUser;
  }
  


}
