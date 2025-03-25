/**
 * post service
 */

import { factories } from '@strapi/strapi';

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
    
      async deletePost(ctx) {
        try {
          const { id } = ctx.params;
          const deletedPost = await strapi.service("api::post.post").deletePost(Number(id));
          ctx.body = deletedPost;
        } catch (err) {
          ctx.throw(500, err);
        }
      },
}));
