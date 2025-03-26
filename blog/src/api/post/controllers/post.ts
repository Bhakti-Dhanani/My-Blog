/**
 * post controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::post.post',({ strapi })=>({
    // get All posts
    async find(ctx){
        try
        {
            const limit =  Number(ctx.query.limit) || 10;
            const posts = await strapi.entityService.findMany("api::post.post",{
                limit:limit,
                populate: "*",
            })
            return posts;
        } catch(error){
            ctx.throw(500,"Error fatching the posts");
        }
    },
    // get recent 5 posts 
    async recent(ctx){
        try
        {
        const limit = Number(ctx.query.limit) || 5;
        const recentPosts = await strapi.service('api::post.post').getRecentPosts(limit);
        ctx.body = recentPosts;
        return recentPosts;
        }catch(error){
            ctx.throw(500, "error fetching recent post");
        }
    },
    async createPost(ctx){
        try {
          const postData = ctx.request.body;
          const newPost = await strapi.service("api::post.post").createPost(postData);
          ctx.body = newPost;
        } catch (err) {
          ctx.throw(500, err);
        }
      },
    
      async delete(ctx) {
        try {
          const { id } = ctx.params;
          const deletedPost = await strapi.service("api::post.post").deletePost(id);
          ctx.body = deletedPost;
        } catch (err) {
          ctx.throw(500, err.message);
        }
      },
}));
