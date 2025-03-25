export default {
    routes: [
      {
        method: "GET",
        path: "/posts/recent",
        handler: "post.getRecentPosts",
      },
      {
        method: "POST",
        path: "/posts",
        handler: "post.createPost",
      },
      {
        method: "DELETE",
        path: "/posts/:id",
        handler: "post.deletePost",
      },
    ],
  };
  