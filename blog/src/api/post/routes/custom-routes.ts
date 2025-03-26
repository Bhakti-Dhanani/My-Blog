export default {
  routes: [
    {
      method: 'GET',
      path: '/posts/recent',
      handler: 'api::post.post.recent',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/posts/:id',
      handler: 'api::post.post.delete',
      config: {
        policies: [],
      },
    },
  ],
};
