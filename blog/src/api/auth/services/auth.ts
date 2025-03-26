import { factories } from "@strapi/strapi";

export default factories.createCoreService("plugin::users-permissions.user", ({ strapi }) => ({
    async generateJwt(user) {
        if (!user || !user.id) {
          throw new Error("User ID is required to generate a token.");
        }
      
        try {
          // Use Strapi's JWT issue function correctly
          return strapi.plugin("users-permissions").service("jwt").issue({
            id: user.id,
          });
        } catch (error) {
          console.error("JWT generation error:", error.message);
          throw new Error("Failed to generate token.");
        }
      },
      
    async registration(userData) {
        try{
            const { username , email , password} = userData;
            // check already exist or not 
            const userExist =  await strapi.query("plugin::users-permissions.user"). findOne({
                where:{email}
            })
            if(userExist){
                throw new Error('email already exist');
            }
             // create user 

             const newUser =  await strapi.plugins["users-permissions"].services.user.add({
                username,
                email,
                password,
                confirmed:true
             });
             const token = await this.generateJwt(newUser);
            //  return { user:newUser, token};
            return 'user registed successfully';

        }catch(error)
        {
            throw new Error(error.message ||  "error to create nnew user")
        }
        
    },
    async  login(identifier ,password){
        try{
            // check validation 
            const userService = strapi.plugin("users-permissions").service("user");

            // Find the user
            const user = await userService.fetch({ email: identifier });
            if (!user) {
              throw new Error("User not found");
            }
            
            // Validate password
            const isValidPassword = await userService.validatePassword(password, user.password);
            if (!isValidPassword) {
              throw new Error("Invalid credentials");
            }
            
            // Generate token
            const token = await this.generateJwt(user);
            return { token, user };
            
        }catch(error)
        {
            throw new Error(error.message || "not able to login"); 
        }
    }
  }));