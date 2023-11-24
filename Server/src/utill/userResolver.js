let newUser;
let Users;
export const userResolver = (Resolver)=>{
    
  
    Resolver()
    {

        const col = this.database.reduce((acc, curr)=>{
            acc.push({node: curr})
            return acc;
            },[])
              Users = col
              console.log(Users)
          
          
          console.log(this.database)
         
          switch (col.node.cat_id) {
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
        // User(){ 
  
        //     //const User = new userResolver(user).__resolveType();
        
        //     let userType;
        //     switch (newUser) {
        //       case "Student":
        //         userType = ;
        //         break;
        //       case "Artisan":
        //         userType = data;
        //         break;
        //       case "Graduate":
        //         userType = data;
        //         break;
        //       case "Professional":
        //         userType = data;
        //         break;
        
        //       default:
        //         userType = {};
        //         break;
        //     }
  
  
  
  