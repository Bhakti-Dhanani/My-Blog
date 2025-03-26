/**
 * post service
 */

import { factories } from '@strapi/strapi';
import { error } from 'console';

export default factories.createCoreService('api::post.post',({strapi})=>({
    async getRecentPosts(limit = 5) {
        return await strapi.entityService.findMany("api::post.post", {
          limit,
          sort: { createdAt: "desc" },
          populate: "*",
        });
      },
      async createPost(ctx) {
        try {
          const postData = ctx.request.body;
          const newPost = await strapi.service("api::post.post").createPost(postData);
          ctx.body = newPost;
        } catch (err) {
          ctx.throw(500, err);
        }
      },
    
      async deletePost(id) {
        try{
          // check id id valid or not 
          const postId = Number(id);
          if(isNaN(postId)){
            throw new Error("invalid ID");
          }
          // check for the post existance
          const post = await strapi.entityService.findMany("api::post.post",id);
          if(!post){
            throw new Error("post not found");

          }
          // delete post 
          await strapi.entityService.delete("api::post.post",postId);
          return "post deleted successfully";
        }catch(error)
        {
          throw new Error(error.message || "error deleting post"); 
        }
      },
}));
