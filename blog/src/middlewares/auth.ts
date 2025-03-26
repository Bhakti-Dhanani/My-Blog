module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
      console.log("User from token:", ctx.state.user); // Debug log
      if (!ctx.state.user) {
        return ctx.unauthorized("You need to be logged in");
      }
      await next();
    };
  };
  